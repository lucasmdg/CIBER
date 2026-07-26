// app/api/ollama/status/route.ts
// GET → estado del proceso Ollama + modelos cargados en VRAM

import { NextResponse } from "next/server";
import { getStatus } from "@/lib/ollama/client";

export async function GET() {
  const status = await getStatus();
  return NextResponse.json(status);
}
