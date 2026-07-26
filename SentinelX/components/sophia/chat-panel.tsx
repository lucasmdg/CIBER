"use client";
import * as React from "react";
import { useChat } from "ai/react";
import { Bot, Send, User, Loader2, AlertCircle, Cpu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Backend = "ollama" | "llamacpp";

export function ChatPanel({ className }: { className?: string }) {
  const [backend, setBackend] = React.useState<Backend>("ollama");
  const [model, setModel] = React.useState("qwen3.6:latest");
  const [availableModels, setAvailableModels] = React.useState<{name: string, label: string}[]>([]);
  const [llamaAvailable, setLlamaAvailable] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: backend === "ollama" ? "/api/ollama/chat" : "/api/llamacpp/chat",
    body: { model },
    initialMessages: [
      { id: "1", role: "system", content: "Eres Sophia, el asistente local de SentinelX. Eres experta en ciberseguridad defensiva. Sé concisa y directa." }
    ]
  });

  React.useEffect(() => {
    fetch("/api/ollama/models")
      .then(r => r.ok ? r.json() : [])
      .then(models => {
        setAvailableModels(models.map((m: any) => ({ name: m.name, label: m.name })));
        if (models.length > 0) setModel(models[0].name);
      })
      .catch(() => {});

    fetch("/api/llamacpp/status")
      .then(r => r.ok ? r.json() : { running: false })
      .then(s => setLlamaAvailable(s.running))
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const displayMessages = messages.filter(m => m.role !== "system");

  return (
    <div className={cn("flex flex-col h-full bg-ink-950/80 backdrop-blur-xl border border-white/5 rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.05)]", className)}>
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-white/5">
        <div className="flex rounded-md overflow-hidden border border-white/10 text-[10px] font-mono shadow-inner">
          {(["ollama", "llamacpp"] as Backend[]).map(b => (
            <button
              key={b}
              onClick={() => setBackend(b)}
              disabled={b === "llamacpp" && !llamaAvailable}
              className={cn(
                "px-3 py-1 transition-all uppercase tracking-wider",
                backend === b
                  ? "bg-cyber-500/30 text-cyber-300 shadow-[inset_0_0_10px_rgba(0,212,255,0.2)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5",
                b === "llamacpp" && !llamaAvailable && "opacity-30 cursor-not-allowed"
              )}
            >
              {b}
            </button>
          ))}
        </div>

        {backend === "ollama" && (
          <div className="relative">
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="appearance-none bg-black/40 border border-white/10 rounded px-3 py-1 pr-7 text-[10px] font-mono text-slate-300 cursor-pointer focus:outline-none focus:border-cyber-500/50 shadow-sm"
            >
              {availableModels.map(m => (
                <option key={m.name} value={m.name} className="bg-ink-950">{m.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
          </div>
        )}
        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
          <span className={cn(
            "h-1.5 w-1.5 rounded-full shadow-[0_0_5px_currentColor]",
            backend === "ollama" ? "bg-success text-success" : llamaAvailable ? "bg-success text-success" : "bg-danger text-danger"
          )} />
          {backend === "ollama" ? "Ollama Online" : llamaAvailable ? "llama-server Online" : "Offline"}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-thin">
        {displayMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-cyber-500/20 blur-xl rounded-full animate-pulse" />
              <div className="relative h-16 w-16 rounded-full bg-cyber-500/10 border border-cyber-500/30 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                <Bot className="h-8 w-8 text-cyber-400" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-300 to-purple-400">Sophia v2.1</p>
              <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-widest">Local Intel Engine</p>
            </div>
          </div>
        )}

        {displayMessages.map(msg => (
          <div key={msg.id} className={cn("flex gap-3 animate-in slide-in-from-bottom-2 duration-300", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-cyber-500/20 border border-cyber-500/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(0,212,255,0.15)]">
                <Bot className="h-4 w-4 text-cyber-300" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed backdrop-blur-md",
                msg.role === "user"
                  ? "bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tr-sm"
                  : "bg-cyber-900/20 border border-cyber-500/20 text-slate-300 rounded-tl-sm shadow-[0_2px_10px_rgba(0,212,255,0.02)]"
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-danger/10 border border-danger/30 px-3 py-2 text-xs text-danger animate-pulse">
            <AlertCircle className="h-4 w-4" /> <span>Error de IA: {error.message}</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-black/20 border-t border-white/5">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Comunica con Sophia..."
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyber-500/50 focus:ring-1 focus:ring-cyber-500/30 transition-all shadow-inner font-mono"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "flex h-[46px] w-[46px] items-center justify-center rounded-xl border transition-all duration-300",
              isLoading || !input.trim()
                ? "border-white/5 bg-white/5 text-slate-600"
                : "border-cyber-500/50 bg-cyber-500/20 text-cyber-300 hover:bg-cyber-500/30 shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
            )}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
