// app/api/bridge/status/route.ts
// GET → Devuelve el estado unificado de los backends para descubrimiento desde IDEs.

import { NextResponse } from "next/server";
import { getStatus as getOllamaStatus, listModels as getOllamaModels } from "@/lib/ollama/client";
import { getStatus as getLlamaStatus, scanGgufModels } from "@/lib/llamacpp/process-manager";
import type { BridgeStatusResponse } from "@/lib/bridge/vscode-opencode";

export async function GET() {
  try {
    const [ollamaSt, ollamaMods, llamaSt, llamaMods] = await Promise.all([
      getOllamaStatus(),
      getOllamaModels().catch(() => []),
      getLlamaStatus(),
      scanGgufModels(),
    ]);

    const response: BridgeStatusResponse = {
      system: "SentinelX-Sophia",
      version: "1.0.0",
      endpoints: {
        chat: "/api/ollama/chat", // Endpoint por defecto, OpenCode puede usar este
        models: "/api/ollama/models",
      },
      backends: {
        ollama: {
          available: ollamaSt.running,
          models: ollamaMods.map(m => m.name),
        },
        llamacpp: {
          available: llamaSt.running,
          models: llamaMods.map(m => m.name),
        },
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
