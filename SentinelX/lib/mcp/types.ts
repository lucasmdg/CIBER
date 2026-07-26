// lib/mcp/types.ts

export interface McpTool {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
}

export interface McpServerRecord {
  id: string;
  name: string;
  url: string;
  description: string;
  active: boolean;
  lastPing: string | null;
  lastPingStatus: "ok" | "error" | "pending" | null;
  tools: McpTool[];
  createdAt: string;
}

export interface McpPingResult {
  ok: boolean;
  latencyMs: number;
  tools: McpTool[];
  error?: string;
}
