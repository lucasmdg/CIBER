import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function calculateShannonEntropy(buffer: Buffer): number {
  const frequencies = new Array(256).fill(0);
  for (let i = 0; i < buffer.length; i++) {
    frequencies[buffer[i]]++;
  }
  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (frequencies[i] > 0) {
      const p = frequencies[i] / buffer.length;
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

function detectFileType(buffer: Buffer): string {
  if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return "Windows Executable (.exe, .dll)";
  }
  if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
    return "ZIP Archive / OpenXML Document";
  }
  if (buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return "PDF Document";
  }
  if (buffer.length >= 4 && buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) {
    return "Linux Executable (ELF)";
  }
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a) {
    return "PNG Image";
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "JPEG Image";
  }

  // Comprobar si parece texto ASCII/UTF-8 plano
  let isPlaintext = true;
  for (let i = 0; i < Math.min(buffer.length, 512); i++) {
    const charCode = buffer[i];
    if (charCode < 9 || (charCode > 13 && charCode < 32 && charCode !== 27)) {
      isPlaintext = false;
      break;
    }
  }
  return isPlaintext ? "Plain Text / Script File" : "Binary Data / Unknown";
}

type PESection = { name: string; virtualSize: number; rawSize: number };

function parsePEHeader(buffer: Buffer): { hasPESignature: boolean; sections: PESection[] } {
  if (buffer.length < 64) return { hasPESignature: false, sections: [] };
  
  const peHeaderOffset = buffer.readInt32LE(0x3c);
  if (peHeaderOffset + 24 > buffer.length) return { hasPESignature: false, sections: [] };
  
  const peSig = buffer.toString("ascii", peHeaderOffset, peHeaderOffset + 4);
  const hasPESignature = peSig === "PE\0\0";
  
  const sections: PESection[] = [];
  if (hasPESignature) {
    const numSections = buffer.readUInt16LE(peHeaderOffset + 6);
    const sizeOfOptionalHeader = buffer.readUInt16LE(peHeaderOffset + 20);
    let sectionOffset = peHeaderOffset + 24 + sizeOfOptionalHeader;
    
    for (let i = 0; i < Math.min(numSections, 16); i++) {
      if (sectionOffset + 40 > buffer.length) break;
      const name = buffer.toString("ascii", sectionOffset, sectionOffset + 8).replace(/\0/g, "").trim();
      const virtualSize = buffer.readUInt32LE(sectionOffset + 8);
      const rawSize = buffer.readUInt32LE(sectionOffset + 16);
      sections.push({ name, virtualSize, rawSize });
      sectionOffset += 40;
    }
  }
  
  return { hasPESignature, sections };
}

function findSuspiciousStrings(text: string): string[] {
  const findings: string[] = [];
  const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  const urlRegex = /https?:\/\/[a-zA-Z0-9.\-_]+(?::\d+)?(?:[a-zA-Z0-9.\-_/?&=#]+)?/g;
  const shellCommands = /\b(bash|sh|cmd|powershell|exec|eval|system|subprocess|spawn|socket|XMLHttpRequest|fetch|netcat|ncat|nc|wget|curl)\b/gi;
  
  const ips = text.match(ipRegex);
  if (ips) {
    ips.forEach(ip => {
      if (ip !== "127.0.0.1" && ip !== "0.0.0.0" && !findings.includes(`IP detectada: ${ip}`)) {
        findings.push(`IP detectada: ${ip}`);
      }
    });
  }
  
  const urls = text.match(urlRegex);
  if (urls) {
    urls.forEach(url => {
      if (!url.includes("localhost") && !findings.includes(`URL detectada: ${url}`)) {
        findings.push(`URL detectada: ${url}`);
      }
    });
  }
  
  const cmds = text.match(shellCommands);
  if (cmds) {
    cmds.forEach(cmd => {
      const matchText = `Comando/API de red: ${cmd.toLowerCase()}`;
      if (!findings.includes(matchText)) {
        findings.push(matchText);
      }
    });
  }
  
  return findings;
}

// GET: Recuperar historial de análisis
export async function GET() {
  const session = await getServerSession(authOptions);
  
  try {
    const history = await prisma.fileAnalysis.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    });
    
    // Mapear suspiciousStrings de JSON string a array
    const mappedHistory = history.map(item => ({
      ...item,
      suspiciousStrings: JSON.parse(item.suspiciousStrings)
    }));
    
    return NextResponse.json(mappedHistory);
  } catch (err) {
    console.error("Fetch history error:", err);
    return NextResponse.json({ error: "No se pudo recuperar el historial de análisis." }, { status: 500 });
  }
}

// POST: Procesar y analizar archivo subido
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    
    if (!file) {
      return NextResponse.json({ error: "Debe proporcionar un archivo para analizar." }, { status: 400 });
    }

    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "El archivo supera el tamaño máximo permitido de 10 MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Hashing
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
    const md5 = crypto.createHash("md5").update(buffer).digest("hex");
    
    // Tipo de archivo por magic bytes
    const fileType = detectFileType(buffer);
    
    // Entropía de Shannon
    const entropy = calculateShannonEntropy(buffer);
    
    // Búsqueda de strings sospechosos (intentando decodificar como texto plano)
    const textContent = buffer.toString("utf8", 0, Math.min(buffer.length, 128 * 1024)); // Analizar primeros 128KB de texto
    const suspiciousStrings = findSuspiciousStrings(textContent);
    
    // Análisis específico de Portable Executable si procede
    let peInfo = null;
    const isPE = fileType.includes("Windows Executable");
    if (isPE) {
      peInfo = parsePEHeader(buffer);
    }
    
    // Scoring y Veredicto
    let score = 0;
    
    if (isPE) {
      score += 40; // Los ejecutables nativos tienen un nivel de sospecha base más alto en análisis estáticos de red
    }
    
    if (entropy > 7.0) {
      score += 25; // Alta entropía (ofuscado, cifrado o comprimido)
    }
    
    score += Math.min(suspiciousStrings.length * 10, 35);
    
    let verdict: "clean" | "suspicious" | "likely_malicious" = "clean";
    if (score >= 70) {
      verdict = "likely_malicious";
    } else if (score >= 30) {
      verdict = "suspicious";
    }

    // Guardar en la base de datos local
    const savedAnalysis = await prisma.fileAnalysis.create({
      data: {
        filename: file.name,
        sha256,
        md5,
        fileType,
        sizeBytes: file.size,
        entropy,
        verdict,
        score,
        suspiciousStrings: JSON.stringify(suspiciousStrings)
      }
    });

    return NextResponse.json({
      id: savedAnalysis.id,
      filename: file.name,
      sha256,
      md5,
      fileType,
      sizeBytes: file.size,
      entropy,
      suspiciousStrings,
      verdict,
      score,
      peInfo,
      createdAt: savedAnalysis.createdAt
    });
  } catch (err) {
    console.error("File analysis error:", err);
    return NextResponse.json({ error: "Ocurrió un fallo durante el análisis estático del archivo." }, { status: 500 });
  }
}
