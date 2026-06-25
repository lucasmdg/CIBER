import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { audit } from "@/lib/audit/logger";
import { prisma } from "@/lib/prisma";
import si from "systeminformation";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

type CheckStatus = "pass" | "warn" | "fail";

type ScannerCheck = {
  id: string;
  name: string;
  status: CheckStatus;
  detail: string;
  recommendation: string;
  evidence?: string;
};

// Timeout fetch wrapper helper
async function checkUrl(url: string) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "manual" });
    return {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries())
    };
  } catch (err) {
    return {
      status: 0,
      headers: {} as Record<string, string>,
      error: (err as Error).message
    };
  } finally {
    clearTimeout(id);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  const checks: ScannerCheck[] = [];

  // --- 1. HEADERS DE SEGURIDAD ---
  const localUrl = "http://localhost:3000";
  const urlRes = await checkUrl(localUrl);
  
  if (urlRes.status > 0) {
    const headers = urlRes.headers;
    const requiredHeaders = [
      { name: "Content-Security-Policy", key: "content-security-policy", rec: "Añadir directivas CSP estrictas en las cabeceras HTTP." },
      { name: "X-Frame-Options", key: "x-frame-options", rec: "Establecer cabecera X-Frame-Options en DENY o SAMEORIGIN para mitigar clickjacking." },
      { name: "X-Content-Type-Options", key: "x-content-type-options", rec: "Establecer X-Content-Type-Options: nosniff para prevenir ataques de MIME sniffing." },
      { name: "Strict-Transport-Security", key: "strict-transport-security", rec: "Habilitar HSTS en producción para forzar conexiones HTTPS." },
      { name: "Referrer-Policy", key: "referrer-policy", rec: "Configurar Referrer-Policy en strict-origin-when-cross-origin para evitar fugas de referer." }
    ];

    let headerEvidence = "";
    let headersPass = 0;
    
    for (const h of requiredHeaders) {
      const value = headers[h.key];
      headerEvidence += `${h.name}: ${value ? "Presente" : "Ausente"}\n`;
      if (value) {
        headersPass++;
      }
    }

    const allPassed = headersPass === requiredHeaders.length;
    checks.push({
      id: "headers_sec",
      name: "Cabeceras de Seguridad HTTP",
      status: allPassed ? "pass" : headersPass > 2 ? "warn" : "fail",
      detail: `Se detectaron ${headersPass} de ${requiredHeaders.length} cabeceras de seguridad requeridas analizadas.`,
      recommendation: allPassed ? "Las cabeceras principales están bien configuradas." : "Implementar las cabeceras ausentes a nivel de servidor o middleware en next.config.mjs.",
      evidence: headerEvidence.trim()
    });
  } else {
    checks.push({
      id: "headers_sec",
      name: "Cabeceras de Seguridad HTTP",
      status: "fail",
      detail: `No se pudo conectar a ${localUrl} para analizar las cabeceras.`,
      recommendation: "Asegúrate de que la aplicación Next.js está levantada localmente en el puerto 3000.",
      evidence: `Error: ${urlRes.error}`
    });
  }

  // --- 2. CPU Y MEMORIA ---
  try {
    const load = await si.currentLoad();
    const mem = await si.mem();
    
    const cpuUsage = load.currentLoad;
    const freeMemPercent = (mem.free / mem.total) * 100;
    
    const cpuFail = cpuUsage > 85;
    const memFail = freeMemPercent < 10;
    
    let status: CheckStatus = "pass";
    let detail = `El uso de CPU está en ${cpuUsage.toFixed(1)}% y la memoria libre es del ${freeMemPercent.toFixed(1)}%.`;
    let recommendation = "El rendimiento de los recursos del sistema está dentro del rango seguro.";
    
    if (cpuFail || memFail) {
      status = "fail";
      if (cpuFail && memFail) {
        detail = `Recursos críticos saturados: CPU al ${cpuUsage.toFixed(1)}% y RAM libre inferior al 10% (${freeMemPercent.toFixed(1)}%).`;
        recommendation = "Revisar procesos de alto consumo. Podría indicar un ataque DDoS local, criptominería no autorizada o fuga de recursos.";
      } else if (cpuFail) {
        detail = `Uso de CPU elevado: ${cpuUsage.toFixed(1)}% (umbral de seguridad: 85%).`;
        recommendation = "Inspeccionar las tareas del procesador para identificar hilos rebeldes o procesos maliciosos en segundo plano.";
      } else {
        detail = `Memoria RAM al límite: solo queda libre un ${freeMemPercent.toFixed(1)}% de memoria total.`;
        recommendation = "Cerrar servicios no esenciales para prevenir denegación de servicio (OOM crash).";
      }
    }

    checks.push({
      id: "sys_resources",
      name: "Salud y Carga del Sistema",
      status,
      detail,
      recommendation,
      evidence: `CPU Load: ${cpuUsage.toFixed(2)}%\nTotal RAM: ${(mem.total / 1024 / 1024 / 1024).toFixed(2)} GB\nFree RAM: ${(mem.free / 1024 / 1024 / 1024).toFixed(2)} GB`
    });
  } catch (err) {
    checks.push({
      id: "sys_resources",
      name: "Salud y Carga del Sistema",
      status: "warn",
      detail: "No se pudieron recolectar métricas de hardware mediante systeminformation.",
      recommendation: "Verificar permisos de lectura de telemetría de hardware en el host OS.",
      evidence: (err as Error).message
    });
  }

  // --- 3. PROCESOS SOSPECHOSOS ---
  try {
    const processList = await si.processes();
    const blacklist = ["netcat", "nc", "ncat", "mimikatz", "meterpreter", "cobaltstrike"];
    const suspiciousRunning = processList.list.filter(p => 
      blacklist.some(b => p.name.toLowerCase().includes(b))
    );

    if (suspiciousRunning.length > 0) {
      checks.push({
        id: "susp_processes",
        name: "Monitoreo de Procesos",
        status: "fail",
        detail: `Se detectaron ${suspiciousRunning.length} procesos potencialmente sospechosos ejecutándose.`,
        recommendation: "Finalizar de inmediato los procesos señalados y ejecutar análisis antimalware. Estas herramientas suelen asociarse a intrusiones de Red Team o hacking.",
        evidence: suspiciousRunning.map(p => `PID: ${p.pid} | Name: ${p.name} | Path: ${p.path}`).join("\n")
      });
    } else {
      checks.push({
        id: "susp_processes",
        name: "Monitoreo de Procesos",
        status: "pass",
        detail: "Ninguno de los procesos blacklistados clásicos (nc, mimikatz, cobaltstrike, etc.) está en ejecución activa.",
        recommendation: "Mantener el filtrado del sistema y herramientas EDR activas.",
        evidence: `Total de procesos inspeccionados: ${processList.list.length}`
      });
    }
  } catch (err) {
    checks.push({
      id: "susp_processes",
      name: "Monitoreo de Procesos",
      status: "warn",
      detail: "No se pudo auditar la lista de procesos activos en segundo plano.",
      recommendation: "Asegurarse de que el usuario ejecutor de Node posee permisos para listar procesos en este sistema.",
      evidence: (err as Error).message
    });
  }

  // --- 4. VARIABLES DE ENTORNO PELIGROSAS ---
  const rejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  if (rejectUnauthorized === "0") {
    checks.push({
      id: "unsafe_env",
      name: "Validación de SSL de Node.js",
      status: "fail",
      detail: "La variable de entorno NODE_TLS_REJECT_UNAUTHORIZED está puesta en '0'.",
      recommendation: "Eliminar esta configuración de inmediato. Forzar la desactivación de validaciones TLS expone la aplicación a ataques Man-in-the-Middle (MitM) graves.",
      evidence: `NODE_TLS_REJECT_UNAUTHORIZED=${rejectUnauthorized}`
    });
  } else {
    checks.push({
      id: "unsafe_env",
      name: "Validación de SSL de Node.js",
      status: "pass",
      detail: "La validación estricta de certificados SSL/TLS para solicitudes HTTPS en Node.js está activa.",
      recommendation: "No deshabilitar las protecciones SSL globales.",
      evidence: `NODE_TLS_REJECT_UNAUTHORIZED=${rejectUnauthorized ?? "No establecida (por defecto activa)"}`
    });
  }

  // --- 5. DEPENDENCIAS CON VULNERABILIDADES (npm audit) ---
  try {
    // Usar --json para parsear los resultados de manera sencilla
    // Ejecutamos en la carpeta base o la de SentinelX
    const { stdout } = await execAsync("npm audit --json", { cwd: process.cwd() }).catch(err => {
      // npm audit devuelve código de salida no cero si encuentra vulnerabilidades,
      // por lo que entra aquí. El stdout sigue conteniendo el JSON del reporte.
      return { stdout: err.stdout || "" };
    });

    if (stdout.trim()) {
      const auditResult = JSON.parse(stdout);
      const metadata = auditResult.metadata || {};
      const vulns = metadata.vulnerabilities || {};
      const totalVulns = (vulns.info || 0) + (vulns.low || 0) + (vulns.moderate || 0) + (vulns.high || 0) + (vulns.critical || 0);

      if (totalVulns > 0) {
        checks.push({
          id: "npm_audit",
          name: "Auditoría de Dependencias NPM",
          status: vulns.critical > 0 || vulns.high > 0 ? "fail" : "warn",
          detail: `Se detectaron ${totalVulns} dependencias con vulnerabilidades (${vulns.critical} críticas, ${vulns.high} altas, ${vulns.moderate} moderadas).`,
          recommendation: "Ejecutar 'npm audit fix' o actualizar los paquetes obsoletos a sus versiones remediadas.",
          evidence: `Vulnerabilidades encontradas:\n- Críticas: ${vulns.critical}\n- Altas: ${vulns.high}\n- Moderadas: ${vulns.moderate}\n- Bajas: ${vulns.low}`
        });
      } else {
        checks.push({
          id: "npm_audit",
          name: "Auditoría de Dependencias NPM",
          status: "pass",
          detail: "El gestor de dependencias no reporta vulnerabilidades conocidas para el árbol de paquetes instalados.",
          recommendation: "Mantener actualizadas las dependencias regularmente.",
          evidence: "npm audit: 0 vulnerabilidades"
        });
      }
    } else {
      checks.push({
        id: "npm_audit",
        name: "Auditoría de Dependencias NPM",
        status: "warn",
        detail: "La salida del comando de auditoría estuvo vacía.",
        recommendation: "Verificar la conectividad de npm con el registro central y volver a escanear.",
        evidence: "npm audit stdout vacía"
      });
    }
  } catch (err) {
    checks.push({
      id: "npm_audit",
      name: "Auditoría de Dependencias NPM",
      status: "warn",
      detail: "No se pudo ejecutar el análisis de paquetes npm audit en este host.",
      recommendation: "Asegúrate de que npm está instalado y en el PATH del sistema ejecutor.",
      evidence: (err as Error).message
    });
  }

  // --- 6. ARCHIVOS .ENV EXPUESTOS ---
  const envUrl = "http://localhost:3000/.env";
  const envRes = await checkUrl(envUrl);
  
  if (envRes.status === 200) {
    checks.push({
      id: "env_exposed",
      name: "Protección de Archivo .env",
      status: "fail",
      detail: "El archivo de variables de entorno (.env) está expuesto y es accesible públicamente.",
      recommendation: "Configurar de inmediato el servidor web (Nginx/Apache) o middleware para bloquear cualquier acceso estático a archivos que empiecen con punto (.) o archivos con extensiones sensibles.",
      evidence: `HTTP GET ${envUrl} -> Status ${envRes.status}`
    });
  } else {
    checks.push({
      id: "env_exposed",
      name: "Protección de Archivo .env",
      status: "pass",
      detail: "El archivo de variables de entorno (.env) no es accesible de forma estática en la URL pública (devuelve código de bloqueo u omisión).",
      recommendation: "Mantener las reglas de exclusión de estáticos activas en producción.",
      evidence: `HTTP GET ${envUrl} -> Status ${envRes.status || "Bloqueado (Connection failed/timed out)"}`
    });
  }

  // Guardar en base de datos si hay sesión
  if (session?.user?.email) {
    try {
      // Guardar auditoría
      await audit({
        actor: session.user.email,
        action: "posture.scan",
        target: "localhost",
        meta: { checks: checks.length, fails: checks.filter(c => c.status === "fail").length }
      });
      
      // Guardar también en la tabla PostureCheck de base de datos
      // Limpiamos posture checks antiguos y guardamos los nuevos
      await prisma.postureCheck.deleteMany({ where: { target: "localhost" } });
      for (const c of checks) {
        await prisma.postureCheck.create({
          data: {
            target: "localhost",
            category: c.id,
            name: c.name,
            status: c.status,
            detail: c.detail,
            evidence: c.evidence ?? ""
          }
        });
      }
    } catch (dbErr) {
      console.error("Database save error for posture scan:", dbErr);
    }
  }

  return NextResponse.json({ target: "localhost", results: checks });
}
