// app/api/llamacpp/server/route.ts
// GET  → estado del proceso llama-server
// POST → arrancar (body: { action: "start", modelPath?, port? }) o parar ({ action: "stop" })

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getStatus, startServer, stopServer, getLogs } from "@/lib/llamacpp/process-manager";

export async function GET() {
  const status = getStatus();
  const logs = getLogs().slice(-50); // últimas 50 líneas
  return NextResponse.json({ ...status, logs });
}

export async function POST(req: NextRequest) {
  const { action, modelPath, port } = await req.json() as {
    action: "start" | "stop";
    modelPath?: string;
    port?: number;
  };

  try {
    if (action === "start") {
      const status = await startServer({ modelPath, port });
      return NextResponse.json(status);
    } else if (action === "stop") {
      await stopServer();
      return NextResponse.json({ running: false });
    }
    return NextResponse.json({ error: "action debe ser start o stop" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
