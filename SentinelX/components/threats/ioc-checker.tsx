"use client";

import { useState, useCallback } from "react";
import { Search, Shield, AlertTriangle, CheckCircle, XCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock IOC reputation database — en modo real, esto llamaría a VirusTotal/AbuseIPDB APIs
const MOCK_IOC_DB: Record<string, { reputation: "clean" | "suspicious" | "malicious"; score: number; source: string; tags: string[]; detail: string }> = {
  "1.1.1.1":        { reputation: "clean",      score: 0,   source: "Cloudflare DNS",           tags: ["cdn", "dns"],              detail: "IP de Cloudflare DNS legítima." },
  "8.8.8.8":        { reputation: "clean",      score: 0,   source: "Google DNS",                tags: ["dns", "google"],           detail: "Servidor DNS público de Google." },
  "185.220.101.34": { reputation: "malicious",  score: 97,  source: "AbuseIPDB (mock)",         tags: ["tor-exit", "scanner"],     detail: "Nodo de salida Tor conocido. Asociado a intentos de fuerza bruta en SSH (2024-Q4)." },
  "45.142.212.100": { reputation: "malicious",  score: 91,  source: "Threat Intel DB (mock)",   tags: ["c2", "botnet"],            detail: "Infraestructura C2 asociada a la familia de ransomware BlackCat/ALPHV." },
  "192.168.1.1":    { reputation: "clean",      score: 0,   source: "RFC1918",                  tags: ["private", "gateway"],      detail: "Dirección RFC1918 privada. No routable en internet." },
  "5f4dcc3b5aa765d61d8327deb882cf99": { reputation: "malicious", score: 100, source: "NSRL/VirusTotal (mock)", tags: ["md5", "common-password"], detail: "Hash MD5 de la cadena 'password'. Detectado en 68/72 motores AV en VirusTotal." },
  "e99a18c428cb38d5f260853678922e03": { reputation: "suspicious", score: 55, source: "Internal DB (mock)",   tags: ["md5", "ab123"],  detail: "Hash MD5 de 'ab123'. Moderado historial de detección en herramientas de análisis." },
  "github.com":     { reputation: "clean",      score: 0,   source: "Reputation DB (mock)",     tags: ["cdn", "dev-platform"],     detail: "Plataforma de desarrollo. Sin indicadores de compromiso conocidos." },
  "evil-c2.ru":     { reputation: "malicious",  score: 98,  source: "Threat Intel DB (mock)",   tags: ["c2", "phishing", "domain"], detail: "Dominio registrado hace < 7 días. Infraestructura activa de phishing. Categoría: malware delivery." },
};

const DEMO_SAMPLES = [
  "185.220.101.34",
  "45.142.212.100",
  "5f4dcc3b5aa765d61d8327deb882cf99",
  "evil-c2.ru",
  "1.1.1.1",
];

type IOCResult = {
  ioc: string;
  reputation: "clean" | "suspicious" | "malicious" | "unknown";
  score: number;
  source: string;
  tags: string[];
  detail: string;
};

function ReputationBadge({ rep }: { rep: IOCResult["reputation"] }) {
  const cfg = {
    clean:      { cls: "text-success border-success/30 bg-success/10",      icon: <CheckCircle className="h-3 w-3" />, label: "CLEAN" },
    suspicious: { cls: "text-warning border-warning/30 bg-warning/10",      icon: <AlertTriangle className="h-3 w-3" />, label: "SUSPICIOUS" },
    malicious:  { cls: "text-danger border-danger/30 bg-danger/10",         icon: <XCircle className="h-3 w-3" />, label: "MALICIOUS" },
    unknown:    { cls: "text-slate-400 border-slate-700 bg-slate-800/50",   icon: <Shield className="h-3 w-3" />, label: "UNKNOWN" },
  }[rep];

  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${cfg.cls}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export function IOCChecker() {
  const [query, setQuery] = useState("");
  const [demoMode, setDemoMode] = useState(true);
  const [results, setResults] = useState<IOCResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const lookup = useCallback(async (ioc: string) => {
    const trimmed = ioc.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    // Simula latencia de red (modo demo) o llamada real (modo real = aún apunta a mock)
    await new Promise((r) => setTimeout(r, demoMode ? 400 : 900));

    const found = MOCK_IOC_DB[trimmed] ?? MOCK_IOC_DB[ioc.trim()];

    const result: IOCResult = found
      ? { ioc: ioc.trim(), ...found }
      : {
          ioc: ioc.trim(),
          reputation: "unknown",
          score: 0,
          source: demoMode ? "Demo DB" : "Consulta externa (no disponible en entorno local)",
          tags: [],
          detail: "No se encontraron indicadores de compromiso para este valor en la base de datos.",
        };

    setResults((prev) => [result, ...prev.filter((r) => r.ioc !== ioc.trim())]);
    setHistory((prev) => [ioc.trim(), ...prev.filter((h) => h !== ioc.trim())].slice(0, 10));
    setLoading(false);
    setQuery("");
  }, [demoMode]);

  return (
    <div className="space-y-4">
      {/* Header + Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyber-300">IOC Reputation Check</h3>
          <p className="text-xs text-slate-500 mt-0.5">IPs, dominios o hashes MD5/SHA-256</p>
        </div>
        <button
          onClick={() => setDemoMode((d) => !d)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono transition-colors ${
            demoMode
              ? "border-cyber-500/40 bg-cyber-500/10 text-cyber-300"
              : "border-warning/40 bg-warning/10 text-warning"
          }`}
          title={demoMode ? "Modo Demo: datos simulados" : "Modo Real: consulta APIs externas (requiere keys)"}
        >
          {demoMode ? <ToggleLeft className="h-3.5 w-3.5" /> : <ToggleRight className="h-3.5 w-3.5" />}
          {demoMode ? "DEMO" : "REAL"}
        </button>
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup(query)}
          placeholder="185.220.101.34, evil-c2.ru, 5f4dcc3b5aa765d6..."
          className="font-mono bg-black/50 border-white/10 text-slate-200 text-xs"
          disabled={loading}
        />
        <Button
          onClick={() => lookup(query)}
          disabled={loading || !query.trim()}
          className="bg-cyber-500 hover:bg-cyber-600 text-black font-semibold"
        >
          {loading ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Quick Samples (demo mode only) */}
      {demoMode && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-slate-500 self-center">Muestras:</span>
          {DEMO_SAMPLES.map((s) => (
            <button
              key={s}
              onClick={() => lookup(s)}
              className="rounded border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-slate-400 hover:border-cyber-500/40 hover:text-cyber-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {results.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-10 text-slate-600 gap-2">
          <Shield className="h-8 w-8 text-slate-700" />
          <p className="text-xs">Introduce un IOC para consultar su reputación defensiva.</p>
        </div>
      )}

      <ul className="space-y-2">
        {results.map((r) => (
          <li
            key={r.ioc}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-white/10"
          >
            <div className="flex items-start justify-between gap-2">
              <code className="text-sm text-slate-100 break-all">{r.ioc}</code>
              <div className="flex items-center gap-2 shrink-0">
                {r.score > 0 && (
                  <span className="font-mono text-xs text-slate-400">
                    Score: <span className={r.score > 80 ? "text-danger" : "text-warning"}>{r.score}/100</span>
                  </span>
                )}
                <ReputationBadge rep={r.reputation} />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">{r.detail}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-slate-600">Fuente: {r.source}</span>
              {r.tags.map((t) => (
                <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">{t}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
