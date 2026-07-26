// lib/llamacpp/client.ts
// Wrapper tipado para el backend llama.cpp (llama-server).
// llama-server expone API compatible con OpenAI en /v1/chat/completions,
// igual que Ollama en modo compat. Mismo patrón de streaming que el cliente Ollama.

import type { LlamaCppChatMessage } from "./types";

const LLAMACPP_BASE = `http://${process.env.LLAMACPP_HOST ?? "127.0.0.1"}:${process.env.LLAMACPP_PORT ?? "8080"}`;

export async function isReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${LLAMACPP_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function* streamChat(
  messages: LlamaCppChatMessage[],
  options?: { temperature?: number; max_tokens?: number }
): AsyncGenerator<string> {
  const res = await fetch(`${LLAMACPP_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      stream: true,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 2048,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`llama-server responded ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.replace(/^data:\s*/, "").trim();
      if (!trimmed || trimmed === "[DONE]") continue;
      try {
        const parsed = JSON.parse(trimmed);
        const token: string = parsed?.choices?.[0]?.delta?.content ?? "";
        if (token) yield token;
      } catch { /* skip malformed */ }
    }
  }
}
