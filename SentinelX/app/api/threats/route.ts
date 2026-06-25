import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CISA_KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
const MITRE_ATTACK_URL = "https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas

async function getCachedOrFetch(key: string, url: string) {
  try {
    const cached = await prisma.externalCache.findUnique({ where: { key } });
    if (cached) {
      const age = Date.now() - new Date(cached.updatedAt).getTime();
      if (age < CACHE_EXPIRY_MS) {
        return JSON.parse(cached.data);
      }
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();

    await prisma.externalCache.upsert({
      where: { key },
      create: { key, data: JSON.stringify(data), updatedAt: new Date() },
      update: { data: JSON.stringify(data), updatedAt: new Date() }
    });

    return data;
  } catch (err) {
    console.error(`Cache fetch failed for ${key} (${url}):`, err);
    // Fallback a caché antiguo si existe
    const fallback = await prisma.externalCache.findUnique({ where: { key } });
    if (fallback) {
      return JSON.parse(fallback.data);
    }
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const iocQuery = searchParams.get("ioc");

  // 1. Obtener datos locales (actores y malware)
  const [actors, malware, assets] = await Promise.all([
    prisma.threatActor.findMany(),
    prisma.malware.findMany(),
    prisma.asset.findMany()
  ]);

  // 2. Cargar KEV de CISA (cacheado)
  const cisaData = await getCachedOrFetch("cisa_kev", CISA_KEV_URL);
  const cisaVulns = cisaData?.vulnerabilities || [];

  // 3. Si se solicita búsqueda de IOC (IP, dominio o hash)
  if (iocQuery) {
    const cleanIoc = iocQuery.trim().toLowerCase();
    const matches: string[] = [];
    
    // Buscar en KEV de CISA
    const matchingCisa = cisaVulns.filter((v: any) => 
      v.cveID.toLowerCase().includes(cleanIoc) || 
      v.vulnerabilityName.toLowerCase().includes(cleanIoc) ||
      (v.shortDescription && v.shortDescription.toLowerCase().includes(cleanIoc))
    );

    matchingCisa.slice(0, 10).forEach((v: any) => {
      matches.push(`CISA KEV [${v.cveID}]: ${v.vulnerabilityName} (${v.vendorProject} - ${v.product})`);
    });

    // Buscar en datos locales
    const matchingActors = actors.filter(a => 
      a.name.toLowerCase().includes(cleanIoc) || 
      a.ttps.toLowerCase().includes(cleanIoc) || 
      a.mitre.toLowerCase().includes(cleanIoc)
    );
    matchingActors.forEach(a => {
      matches.push(`Threat Actor Local: ${a.name} (TTPs: ${a.ttps})`);
    });

    const matchingMalware = malware.filter(m => 
      m.family.toLowerCase().includes(cleanIoc) || 
      m.type.toLowerCase().includes(cleanIoc)
    );
    matchingMalware.forEach(m => {
      matches.push(`Malware Local: ${m.family} (${m.type})`);
    });

    return NextResponse.json({ query: iocQuery, matches });
  }

  // 4. Cargar MITRE ATT&CK (cacheado)
  const mitreData = await getCachedOrFetch("mitre_attack", MITRE_ATTACK_URL);
  const mitreObjects = mitreData?.objects || [];

  // Filtrar técnicas relevantes
  const mitreTechniques = mitreObjects
    .filter((o: any) => o.type === "attack-pattern" && o.external_references?.[0]?.external_id)
    .map((o: any) => ({
      id: o.external_references[0].external_id,
      name: o.name,
      description: o.description || "",
      tactics: o.kill_chain_phases?.map((p: any) => p.phase_name) || []
    }));

  // Mapear técnicas más relevantes para los assets registrados en base a su sistema operativo
  const mappedTechniques: any[] = [];
  const activeOSs = Array.from(new Set(assets.map(a => a.os.toLowerCase())));

  // Identificar técnicas clásicas asociadas a los SO de los activos
  // Ejemplo: Acceso inicial, ejecución, escalado de privilegios
  mitreTechniques.slice(0, 50).forEach((t: any) => {
    let relevanceScore = 0;
    
    // Evaluar relevancia según el SO
    if (t.description.toLowerCase().includes("windows") && activeOSs.some(os => os.includes("win"))) {
      relevanceScore += 2;
    }
    if ((t.description.toLowerCase().includes("linux") || t.description.toLowerCase().includes("unix")) && activeOSs.some(os => os.includes("linux") || os.includes("jun") || os.includes("ubun"))) {
      relevanceScore += 2;
    }
    if (t.description.toLowerCase().includes("kubernetes") && activeOSs.some(os => os.includes("k8s") || os.includes("kube"))) {
      relevanceScore += 3;
    }
    if (t.description.toLowerCase().includes("cloud") && activeOSs.some(os => os.includes("aws") || os.includes("cloud"))) {
      relevanceScore += 3;
    }

    if (relevanceScore > 0) {
      mappedTechniques.push({
        ...t,
        relevanceScore
      });
    }
  });

  // Ordenar técnicas relevantes por puntuación
  mappedTechniques.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return NextResponse.json({
    actors,
    malware,
    cisaKev: cisaVulns.slice(0, 20), // Mostrar las últimas 20 entradas
    mitreTechniques: mappedTechniques.slice(0, 15) // Top 15 técnicas relevantes para los activos
  });
}
