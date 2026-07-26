// lib/usage/tracker.ts
// Registra tokens/tiempo por conversación y backend en la BD.
// Se llama desde los endpoints de chat al finalizar cada respuesta.

import { prisma } from "@/lib/prisma";

export type Backend = "ollama" | "llamacpp";

interface UsageRecord {
  backend: Backend;
  model: string;
  tokensIn: number;
  tokensOut: number;
  durationMs: number;
}

// Costes de referencia (€ por 1M tokens) para el panel de comparación.
// Source: precios públicos a julio 2025. Solo para la UI de comparación, sin transacciones reales.
const CLOUD_COST_PER_MILLION_TOKENS: Record<string, number> = {
  "gpt-4o":         10.0,  // input+output promedio
  "gpt-4o-mini":    0.6,
  "claude-3-5-sonnet": 9.0,
  "gemini-1.5-pro": 7.0,
  "default":        5.0,   // fallback conservador
};

export async function recordUsage(record: UsageRecord): Promise<void> {
  await (prisma as any).usageEvent.create({
    data: {
      backend: record.backend,
      model: record.model,
      tokensIn: record.tokensIn,
      tokensOut: record.tokensOut,
      durationMs: record.durationMs,
    },
  });
}

export function estimateCloudCost(tokensTotal: number, referenceModel = "default"): number {
  const pricePerMillion = CLOUD_COST_PER_MILLION_TOKENS[referenceModel]
    ?? CLOUD_COST_PER_MILLION_TOKENS["default"];
  return (tokensTotal / 1_000_000) * pricePerMillion;
}

/** Aproximación de tokens: ~4 chars por token (heurístico GPT-style). */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}
