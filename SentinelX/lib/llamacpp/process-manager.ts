// lib/llamacpp/process-manager.ts
// Gestiona el proceso llama-server como hijo del proceso Node.
// Trade-off: gestionarlo desde Node significa que se mata cuando el servidor
// se reinicia. Aceptable para uso local; para producción real se usaría
// systemd/PM2. La alternativa de "conectarse a un llama-server externo ya
// corriendo" también está soportada via LLAMACPP_HOST en .env.

import { execa } from "execa";
import type { ResultPromise } from "execa";
import type { LlamaCppServerConfig, LlamaCppServerStatus } from "./types";
import path from "path";
import fs from "fs";

// ---- estado singleton en memoria del proceso ----
interface ManagedProcess {
  proc: ResultPromise;
  config: LlamaCppServerConfig;
  startedAt: Date;
  logs: string[];
}

let _managed: ManagedProcess | null = null;

function defaultConfig(): LlamaCppServerConfig {
  return {
    host: process.env.LLAMACPP_HOST ?? "127.0.0.1",
    port: parseInt(process.env.LLAMACPP_PORT ?? "8080", 10),
    modelPath: process.env.LLAMACPP_MODEL ?? "",
    contextSize: parseInt(process.env.LLAMACPP_CTX ?? "4096", 10),
    gpuLayers: parseInt(process.env.LLAMACPP_GPU_LAYERS ?? "0", 10),
  };
}

export function getStatus(): LlamaCppServerStatus {
  const config = defaultConfig();

  // Si hay una URL externa configurada, no gestionamos el proceso — solo reportamos
  if (process.env.LLAMACPP_EXTERNAL === "true") {
    return {
      running: true,
      port: config.port,
      modelPath: config.modelPath,
    };
  }

  if (!_managed) {
    return { running: false, port: config.port };
  }

  const proc = _managed.proc;
  // proc.exitCode === null significa que sigue corriendo
  const running = proc.exitCode === null && !proc.killed;

  return {
    running,
    pid: proc.pid,
    port: _managed.config.port,
    modelPath: _managed.config.modelPath,
    uptime: running ? Math.floor((Date.now() - _managed.startedAt.getTime()) / 1000) : undefined,
  };
}

export async function startServer(config?: Partial<LlamaCppServerConfig>): Promise<LlamaCppServerStatus> {
  const full: LlamaCppServerConfig = { ...defaultConfig(), ...config };

  // Validaciones previas
  const binaryName = process.platform === "win32" ? "llama-server.exe" : "llama-server";
  const llamaBin = process.env.LLAMACPP_BIN ?? binaryName;

  if (!full.modelPath || !fs.existsSync(full.modelPath)) {
    throw new Error(`Model path not found: ${full.modelPath}. Set LLAMACPP_MODEL en .env o pasa modelPath.`);
  }

  if (_managed) {
    const st = getStatus();
    if (st.running) return st; // ya corriendo, nada que hacer
    _managed = null;
  }

  const argList = [
    "--host", full.host,
    "--port", String(full.port),
    "--model", full.modelPath,
    "--ctx-size", String(full.contextSize ?? 4096),
    "--n-gpu-layers", String(full.gpuLayers ?? 0),
  ];

  const proc = execa(llamaBin, argList, {
    reject: false,
    detached: false,
  }) as ResultPromise;

  const logs: string[] = [];

  proc.stdout?.on("data", (chunk: Buffer) => {
    logs.push(chunk.toString());
    if (logs.length > 200) logs.shift(); // ring buffer
  });
  proc.stderr?.on("data", (chunk: Buffer) => {
    logs.push(`[err] ${chunk.toString()}`);
    if (logs.length > 200) logs.shift();
  });

  _managed = { proc, config: full, startedAt: new Date(), logs };

  // Esperar hasta 5s a que el servidor responda
  const start = Date.now();
  while (Date.now() - start < 5000) {
    try {
      const res = await fetch(`http://${full.host}:${full.port}/health`);
      if (res.ok) break;
    } catch { /* no disponible todavía */ }
    await new Promise(r => setTimeout(r, 300));
  }

  return getStatus();
}

export async function stopServer(): Promise<void> {
  if (!_managed) return;
  _managed.proc.kill("SIGTERM");
  await new Promise(r => setTimeout(r, 500));
  if (!_managed.proc.killed) _managed.proc.kill("SIGKILL");
  _managed = null;
}

export function getLogs(): string[] {
  return _managed?.logs ?? [];
}

/** Busca archivos .gguf en el directorio configurado */
export function scanGgufModels(): { name: string; path: string; sizeBytes: number; quantization: string }[] {
  const dir = process.env.LLAMACPP_MODELS_DIR ?? path.join(process.env.HOME ?? "C:\\Users", "models");
  if (!fs.existsSync(dir)) return [];

  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".gguf"));
    return files.map(f => {
      const filePath = path.join(dir, f);
      const stat = fs.statSync(filePath);
      // Extrae cuantización del nombre: e.g. "model-Q4_K_M.gguf" → "Q4_K_M"
      const qMatch = f.match(/[.-](Q\d[_A-Z0-9]+)\.gguf$/i);
      return {
        name: f.replace(".gguf", ""),
        path: filePath,
        sizeBytes: stat.size,
        quantization: qMatch?.[1] ?? "unknown",
      };
    });
  } catch {
    return [];
  }
}
