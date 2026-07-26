// lib/ollama/client.ts
// Wrapper tipado para el backend Ollama.
// Decisión: llamadas HTTP directas en lugar de usar el SDK de Ollama
// para tener control total sobre errores, timeouts y streaming sin
// añadir una capa de abstracción que complique el debugging.

import type { OllamaModel, OllamaTagsResponse, OllamaStatusResponse, OllamaPullProgress, ChatMessage } from "./types";

const OLLAMA_BASE = process.env.OLLAMA_HOST ?? "http://localhost:11434";

// ---------- modelos ----------

export async function listModels(): Promise<OllamaModel[]> {
  const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Ollama /api/tags responded ${res.status}`);
  const data: OllamaTagsResponse = await res.json();
  return data.models ?? [];
}

export async function getStatus(): Promise<OllamaStatusResponse> {
  try {
    const [tagsRes, psRes] = await Promise.all([
      fetch(`${OLLAMA_BASE}/api/tags`, { next: { revalidate: 0 } }),
      fetch(`${OLLAMA_BASE}/api/ps`, { next: { revalidate: 0 } }),
    ]);
    const running = tagsRes.ok;
    const ps = psRes.ok ? await psRes.json() : { models: [] };
    return { running, models: ps.models ?? [] };
  } catch {
    return { running: false, models: [] };
  }
}

// ---------- pull (streaming de progreso) ----------

/**
 * Inicia una descarga de modelo y devuelve un ReadableStream
 * de objetos OllamaPullProgress (NDJSON line by line).
 * El caller puede pasarlo directamente como body de una Response SSE.
 */
export function pullModel(modelName: string): ReadableStream<string> {
  return new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch(`${OLLAMA_BASE}/api/pull`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: modelName, stream: true }),
        });
        if (!res.ok || !res.body) {
          controller.enqueue(`data: ${JSON.stringify({ error: `Ollama responded ${res.status}` })}\n\n`);
          controller.close();
          return;
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
            if (!line.trim()) continue;
            try {
              const parsed: OllamaPullProgress = JSON.parse(line);
              controller.enqueue(`data: ${JSON.stringify(parsed)}\n\n`);
            } catch { /* malformed line — skip */ }
          }
        }
      } catch (err) {
        controller.enqueue(`data: ${JSON.stringify({ error: String(err) })}\n\n`);
      } finally {
        controller.close();
      }
    },
  });
}

// ---------- chat ----------

/**
 * Llama al endpoint de chat de Ollama en modo streaming.
 * Retorna un ReadableStream de tokens (strings) para pasar
 * directamente al cliente o a Vercel AI SDK.
 */
export async function* streamChat(
  model: string,
  messages: ChatMessage[],
  options?: { temperature?: number; num_ctx?: number }
): AsyncGenerator<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      options: { temperature: options?.temperature ?? 0.7, num_ctx: options?.num_ctx ?? 4096 },
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Ollama chat responded ${res.status}`);
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
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        const token: string = parsed?.message?.content ?? "";
        if (token) yield token;
        if (parsed?.done) return;
      } catch { /* skip */ }
    }
  }
}
