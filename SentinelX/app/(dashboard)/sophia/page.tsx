"use client";
// app/(dashboard)/sophia/page.tsx
// Panel principal de Sophia: 3 tabs â€” Chat / Modelos / Backends

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatPanel } from "@/components/sophia/chat-panel";
import {
  Bot, Server, Download, RefreshCw, CheckCircle, XCircle,
  Play, Square, Cpu, HardDrive, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Tab = "chat" | "models" | "backends" | "ide";

interface OllamaModel {
  name: string;
  size: number;
  details: { parameter_size: string; quantization_level: string; family: string };
  modified_at: string;
}

interface OllamaStatus {
  running: boolean;
  models: { name: string; size_vram: number }[];
}

interface LlamaCppStatus {
  running: boolean;
  pid?: number;
  port: number;
  modelPath?: string;
  uptime?: number;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  return `${bytes} B`;
}

export default function SophiaPage() {
  const [tab, setTab] = React.useState<Tab>("chat");
  const [ollamaModels, setOllamaModels] = React.useState<OllamaModel[]>([]);
  const [ollamaStatus, setOllamaStatus] = React.useState<OllamaStatus | null>(null);
  const [llamaStatus, setLlamaStatus] = React.useState<LlamaCppStatus | null>(null);
  const [pulling, setPulling] = React.useState<string | null>(null);
  const [pullInput, setPullInput] = React.useState("");
  const [pullProgress, setPullProgress] = React.useState<string>("");
  const [loadingModels, setLoadingModels] = React.useState(false);

  async function loadModels() {
    setLoadingModels(true);
    try {
      const [models, status, llamaSt] = await Promise.all([
        fetch("/api/ollama/models").then(r => r.ok ? r.json() : []),
        fetch("/api/ollama/status").then(r => r.ok ? r.json() : null),
        fetch("/api/llamacpp/status").then(r => r.ok ? r.json() : null),
      ]);
      setOllamaModels(models);
      setOllamaStatus(status);
      setLlamaStatus(llamaSt);
    } finally {
      setLoadingModels(false);
    }
  }

  React.useEffect(() => {
    if (tab === "models" || tab === "backends") loadModels();
  }, [tab]);

  async function pullModel() {
    const name = pullInput.trim();
    if (!name || pulling) return;
    setPulling(name);
    setPullProgress("Iniciando descarga...");
    try {
      const res = await fetch("/api/ollama/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.body) throw new Error("Sin stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";
        for (const chunk of lines) {
          const line = chunk.replace(/^data:\s*/, "");
          if (!line) continue;
          try {
            const parsed = JSON.parse(line);
            const pct = parsed.total && parsed.completed
              ? ` (${Math.round((parsed.completed / parsed.total) * 100)}%)`
              : "";
            setPullProgress(parsed.status + pct);
          } catch { /* skip */ }
        }
      }
      setPullProgress("âœ“ Descarga completa");
      await loadModels();
      setPullInput("");
    } catch (err) {
      setPullProgress(`Error: ${String(err)}`);
    } finally {
      setPulling(null);
    }
  }

  async function toggleLlamaCpp(action: "start" | "stop") {
    await fetch("/api/llamacpp/server", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await loadModels();
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "chat", label: "Chat", icon: Bot },
    { id: "models", label: "Modelos Ollama", icon: Package },
    { id: "backends", label: "Backends", icon: Server },
    { id: "ide", label: "Integración IDE", icon: Cpu },
  ];

  return (
    <>
      <PageHeader
        badge={{ text: "MÓDULO REAL", tone: "ok" }}
        title="Sophia"
        description="Asistente local de IA â€” Ollama Â· llama.cpp Â· 100% en tu hardware, sin APIs externas."
      />

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-white/5 pb-0">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors",
                tab === t.id
                  ? "border-cyber-500 text-cyber-300"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* â”€â”€ Tab: Chat â”€â”€ */}
      {tab === "chat" && (
        <Card className="flex-1" style={{ height: "calc(100vh - 280px)" }}>
          <ChatPanel className="h-full" />
        </Card>
      )}

      {/* â”€â”€ Tab: Modelos Ollama â”€â”€ */}
      {tab === "models" && (
        <div className="grid gap-4">
          {/* Pull de nuevo modelo */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Descargar modelo</CardTitle>
                  <CardSubtitle>ollama pull &lt;nombre&gt; â€” p.ej. deepseek-r1:7b, llama3.2:3b</CardSubtitle>
                </div>
                <Button variant="outline" onClick={loadModels} disabled={loadingModels} className="gap-1.5">
                  <RefreshCw className={cn("h-3 w-3", loadingModels && "animate-spin")} />
                  Refrescar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  value={pullInput}
                  onChange={e => setPullInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && pullModel()}
                  placeholder="deepseek-r1:7b"
                  className="flex-1 rounded bg-white/5 border border-white/10 px-3 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-500/40"
                />
                <Button onClick={pullModel} disabled={!!pulling || !pullInput.trim()} className="gap-1.5">
                  <Download className="h-4 w-4" />
                  {pulling ? "Descargando..." : "Pull"}
                </Button>
              </div>
              {pullProgress && (
                <p className="mt-2 text-xs font-mono text-cyber-400">{pullProgress}</p>
              )}
            </CardContent>
          </Card>

          {/* Lista de modelos */}
          <Card>
            <CardHeader>
              <CardTitle>Modelos instalados ({ollamaModels.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {ollamaModels.length === 0 ? (
                <p className="text-sm text-slate-500">No hay modelos descargados en Ollama.</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {ollamaModels.map(m => {
                    const isLoaded = ollamaStatus?.models?.some(r => r.name === m.name);
                    return (
                      <div key={m.name} className="flex items-center justify-between py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-slate-200">{m.name}</span>
                            {isLoaded && (
                              <Badge tone="ok" className="text-[9px]">EN VRAM</Badge>
                            )}
                          </div>
                          <div className="mt-0.5 flex gap-3 text-[11px] text-slate-500 font-mono">
                            <span>{m.details?.parameter_size}</span>
                            <span>{m.details?.quantization_level}</span>
                            <span>{m.details?.family}</span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">{formatBytes(m.size)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* â”€â”€ Tab: Backends â”€â”€ */}
      {tab === "backends" && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Ollama */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ollama</CardTitle>
                  <CardSubtitle>Gestor de modelos â€” localhost:11434</CardSubtitle>
                </div>
                {ollamaStatus?.running ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-danger" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Estado</span>
                <Badge tone={ollamaStatus?.running ? "ok" : "fail"}>
                  {ollamaStatus?.running ? "ACTIVO" : "OFFLINE"}
                </Badge>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Modelos instalados</span>
                <span className="text-slate-300">{ollamaModels.length}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Cargados en VRAM</span>
                <span className="text-slate-300">{ollamaStatus?.models?.length ?? 0}</span>
              </div>
              <p className="text-[11px] text-slate-600 pt-2">
                Ollama se gestiona como proceso del sistema, independiente de SentinelX. Para arrancar/parar, usa el cliente Ollama instalado.
              </p>
            </CardContent>
          </Card>

          {/* llama.cpp */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>llama.cpp (llama-server)</CardTitle>
                  <CardSubtitle>GGUF directo â€” localhost:{llamaStatus?.port ?? 8080}</CardSubtitle>
                </div>
                {llamaStatus?.running ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-slate-600" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Estado</span>
                <Badge tone={llamaStatus?.running ? "ok" : "warn"}>
                  {llamaStatus?.running ? "ACTIVO" : "OFFLINE"}
                </Badge>
              </div>
              {llamaStatus?.pid && (
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">PID</span>
                  <span className="text-slate-300">{llamaStatus.pid}</span>
                </div>
              )}
              {llamaStatus?.modelPath && (
                <div className="text-xs font-mono text-slate-500 truncate" title={llamaStatus.modelPath}>
                  Modelo: {llamaStatus.modelPath.split(/[/\\]/).pop()}
                </div>
              )}
              {llamaStatus?.uptime !== undefined && (
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Uptime</span>
                  <span className="text-slate-300">{llamaStatus.uptime}s</span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {!llamaStatus?.running ? (
                  <Button variant="outline" className="gap-1.5 text-xs" onClick={() => toggleLlamaCpp("start")}>
                    <Play className="h-3 w-3" /> Arrancar
                  </Button>
                ) : (
                  <Button variant="danger" className="gap-1.5 text-xs" onClick={() => toggleLlamaCpp("stop")}>
                    <Square className="h-3 w-3" /> Parar
                  </Button>
                )}
              </div>
              {!llamaStatus?.running && (
                <p className="text-[11px] text-slate-600">
                  Configura LLAMACPP_BIN y LLAMACPP_MODEL en .env para arrancar llama-server desde aquí.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab: Integración IDE ── */}
      {tab === "ide" && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Integración con VS Code (Continue.dev)</CardTitle>
              <CardSubtitle>Añade Sophia como tu asistente AI gratuito dentro del editor</CardSubtitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300">
                Abre VS Code, instala la extensión <strong>Continue.dev</strong> y pega esta configuración en tu archivo <code>config.json</code>:
              </p>
              <pre className="bg-ink-950 p-4 rounded-md border border-white/10 text-xs font-mono text-cyber-300 overflow-x-auto">
{`{
  "models": [
    {
      "title": "Sophia (SentinelX)",
      "provider": "openai",
      "model": "qwen3.6:latest",
      "apiBase": "http://localhost:3000/api/v1"
    }
  ]
}`}
              </pre>
              <p className="text-xs text-slate-500">
                La URL <code className="text-cyber-400">http://localhost:3000/api/v1</code> es un proxy compatible con OpenAI que gestiona SentinelX internamente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integración con OpenCode / Cline</CardTitle>
              <CardSubtitle>Configura el acceso al API unificado</CardSubtitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300">
                En los ajustes de OpenCode o Cline, selecciona <strong>OpenAI Compatible</strong> e introduce:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-400 font-mono space-y-1">
                <li><span className="text-slate-500">Base URL:</span> <span className="text-cyber-300">http://localhost:3000/api/v1</span></li>
                <li><span className="text-slate-500">Model Name:</span> <span className="text-cyber-300">qwen3.6:latest</span></li>
                <li><span className="text-slate-500">API Key:</span> <span className="text-cyber-300">sentinelx-local</span> (puede ser cualquier cosa)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
