// app/api/ollama/models/route.ts
// GET  → lista modelos instalados en Ollama
// POST → inicia pull de un modelo (streaming SSE de progreso)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listModels, pullModel } from "@/lib/ollama/client";

export async function GET() {
  try {
    const models = await listModels();
    return NextResponse.json(models);
  } catch (err) {
    return NextResponse.json(
      { error: "Ollama no disponible", detail: String(err) },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { name } = await req.json() as { name: string };
  if (!name) return NextResponse.json({ error: "name requerido" }, { status: 400 });

  const stream = pullModel(name);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
