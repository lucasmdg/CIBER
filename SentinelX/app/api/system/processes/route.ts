// app/api/system/processes/route.ts
// GET    → lista de procesos simulados (mock) para evitar alertas del SO/EDR
// DELETE → simula matar un proceso (mock)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Generador de procesos aleatorios realistas
const mockProcesses = [
  { pid: 1024, name: "node.exe", command: "node server.js", user: "SYSTEM" },
  { pid: 2048, name: "chrome.exe", command: "chrome.exe --type=renderer", user: "lucas" },
  { pid: 4096, name: "svchost.exe", command: "svchost.exe -k LocalService", user: "SYSTEM" },
  { pid: 8192, name: "Code.exe", command: "Code.exe --type=renderer", user: "lucas" },
  { pid: 1234, name: "explorer.exe", command: "explorer.exe", user: "lucas" },
  { pid: 5678, name: "MsMpEng.exe", command: "MsMpEng.exe", user: "SYSTEM" },
  { pid: 9012, name: "llama-server.exe", command: "llama-server.exe --port 8080", user: "lucas" },
  { pid: 3456, name: "docker.exe", command: "dockerd", user: "root" },
  { pid: 7890, name: "python.exe", command: "python script.py", user: "lucas" },
  { pid: 2345, name: "discord.exe", command: "discord.exe", user: "lucas" },
];

let currentMocks = mockProcesses.map(p => ({
  ...p,
  cpu: parseFloat((Math.random() * 10).toFixed(1)),
  memMb: Math.floor(Math.random() * 500) + 50,
  state: Math.random() > 0.1 ? "running" : "sleeping",
  started: new Date(Date.now() - Math.random() * 10000000).toISOString(),
}));

export async function GET() {
  try {
    // Añadir variabilidad simulada a CPU/RAM en cada request
    currentMocks = currentMocks.map(p => ({
      ...p,
      cpu: Math.max(0, parseFloat((p.cpu + (Math.random() * 2 - 1)).toFixed(1))),
      memMb: Math.max(10, p.memMb + Math.floor(Math.random() * 20 - 10)),
    }));
    
    // Ordenar por CPU
    currentMocks.sort((a, b) => b.cpu - a.cpu);
    
    return NextResponse.json({ count: currentMocks.length, list: currentMocks });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { pid } = await req.json() as { pid: number };
  if (!pid) return NextResponse.json({ error: "pid requerido" }, { status: 400 });

  try {
    // Simular el kill del proceso en la base de datos mock
    const initialLength = currentMocks.length;
    currentMocks = currentMocks.filter(p => p.pid !== pid);
    
    if (currentMocks.length === initialLength) {
      return NextResponse.json({ error: "Proceso no encontrado en la simulación" }, { status: 404 });
    }

    return NextResponse.json({ killed: true, pid, simulated: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
