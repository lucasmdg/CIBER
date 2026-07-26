// app/api/llamacpp/models/route.ts
// GET → lista archivos .gguf encontrados en LLAMACPP_MODELS_DIR

import { NextResponse } from "next/server";
import { scanGgufModels } from "@/lib/llamacpp/process-manager";

export async function GET() {
  const models = scanGgufModels();
  return NextResponse.json(models);
}
