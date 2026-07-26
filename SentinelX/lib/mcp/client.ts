// lib/mcp/client.ts
// Llamadas al protocolo MCP (JSON-RPC over HTTP) para descubrir
// herramientas y hacer llamadas de prueba.

import type { McpPingResult, McpTool } from "./types";

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: unknown;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: number;
  result?: unknown;
  error?: { code: number; message: string };
}

async function rpc(url: string, method: string, params?: unknown): Promise<unknown> {
  const body: JsonRpcRequest = { jsonrpc: "2.0", id: 1, method, params };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`MCP HTTP ${res.status}`);
  const data: JsonRpcResponse = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

export async function pingMcp(url: string): Promise<McpPingResult> {
  const t0 = Date.now();
  try {
    // Paso 1: initialize
    await rpc(url, "initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "SentinelX-Sophia", version: "1.0" },
    });

    // Paso 2: tools/list
    const result = await rpc(url, "tools/list", {}) as { tools?: McpTool[] };
    const tools: McpTool[] = result?.tools ?? [];

    return { ok: true, latencyMs: Date.now() - t0, tools };
  } catch (err) {
    return { ok: false, latencyMs: Date.now() - t0, tools: [], error: String(err) };
  }
}

export async function callTool(
  url: string,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  await rpc(url, "initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "SentinelX-Sophia", version: "1.0" },
  });
  return rpc(url, "tools/call", { name: toolName, arguments: args });
}
