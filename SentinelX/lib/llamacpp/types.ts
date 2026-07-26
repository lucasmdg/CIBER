// lib/llamacpp/types.ts
// Tipos para la integración con llama-server (llama.cpp)

export interface LlamaCppServerConfig {
  host: string;
  port: number;
  modelPath: string;
  contextSize?: number;
  gpuLayers?: number;
}

export interface LlamaCppServerStatus {
  running: boolean;
  pid?: number;
  port: number;
  modelPath?: string;
  uptime?: number;
  error?: string;
}

export interface LlamaCppModel {
  name: string;       // basename del fichero
  path: string;       // ruta absoluta al .gguf
  sizeBytes: number;
  quantization: string; // extraído del nombre, e.g. "Q4_K_M"
}

// El servidor llama.cpp expone API compatible con OpenAI,
// así que usamos tipos OpenAI-compat para el chat
export interface LlamaCppChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LlamaCppChatRequest {
  model?: string;
  messages: LlamaCppChatMessage[];
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}
