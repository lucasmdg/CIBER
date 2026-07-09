"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Terminal, Shield, Play } from "lucide-react";

type Result = { id: string; name: string; status: "pass" | "warn" | "fail"; detail: string; recommendation: string; evidence?: string };

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export function PostureClient() {
  const [target, setTarget] = useState("http://localhost:3000");
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function cancel() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLines(prev => [...prev, "\n[ABORTED] Operación de escaneo cancelada por el operador. Deteniendo tareas y cerrando sockets..."]);
      setError("Escaneo cancelado por el operador.");
      setRunning(false);
    }
  }

  async function run() {
    setError(null);
    setRunning(true);
    setLines([]);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    const addLine = async (txt: string, delay = 0) => {
      if (signal.aborted) return;
      setLines(prev => [...prev, txt]);
      if (delay > 0) {
        await sleep(delay);
      }
    };

    try {
      await addLine("[*] Inicializando Scanner de Postura de Seguridad...", 150);
      if (signal.aborted) return;
      await addLine(`[*] Host objetivo: ${target} (Loopback/Localhost)`, 100);
      if (signal.aborted) return;
      await addLine("[*] Cargando librerías de telemetría de hardware...", 80);
      if (signal.aborted) return;
      await addLine("[*] Cargando firmas de blacklist de procesos...", 80);
      if (signal.aborted) return;
      await addLine("[*] Conectando con el socket local... Por favor, espere.", 150);
      if (signal.aborted) return;
      
      const startTime = Date.now();
      
      // Llamada real al endpoint con soporte de AbortSignal
      const r = await fetch("/api/scanner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ target }),
        signal
      });
      
      if (signal.aborted) return;
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "El escaneo ha fallado.");

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      await addLine(`[+] Conexión establecida con éxito. Telemetría recolectada en ${duration} segundos.`, 100);
      if (signal.aborted) return;
      await addLine("[*] Ejecutando análisis heurístico secuencial de directivas...", 150);
      if (signal.aborted) return;

      const checks = data.results as Result[];
      let fails = 0;
      let warns = 0;
      let passes = 0;

      // Imprimir checks secuencialmente con un delay realista de 60 a 120 ms
      for (const check of checks) {
        if (signal.aborted) return;
        const delay = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
        
        let statusString = "";
        if (check.status === "pass") {
          statusString = "[PASS]";
          passes++;
        } else if (check.status === "warn") {
          statusString = "[WARN]";
          warns++;
        } else if (check.status === "fail") {
          statusString = "[FAIL]";
          fails++;
        } else {
          statusString = "[ERROR]";
          fails++;
        }

        await addLine(`[CHECK] ${check.name.padEnd(45, ".")} ${statusString}`, delay);
        if (signal.aborted) return;
        await addLine(`        Detalle: ${check.detail}`, 20);
        if (signal.aborted) return;
        await addLine(`        Rec:     ${check.recommendation}`, 20);
        if (signal.aborted) return;
        if (check.evidence) {
          const evidenceLines = check.evidence.split("\n");
          await addLine("        Evidencia:", 10);
          for (const evLine of evidenceLines) {
            if (signal.aborted) return;
            await addLine(`          > ${evLine}`, 10);
          }
        }
        await addLine("--------------------------------------------------------------------------------", 10);
      }

      if (signal.aborted) return;
      // Calcular puntuación final
      const totalChecks = passes + warns + fails;
      const score = totalChecks > 0 ? Math.round((passes / totalChecks) * 100) : 0;
      
      await addLine("[+]", 50);
      await addLine("=================================== RESUMEN ===================================", 50);
      await addLine(`[+] Escaneo completado para el host local.`, 50);
      await addLine(`[+] Puntuación General: ${score}/100`, 50);
      await addLine(`[+] Métricas: ${passes} Aprobados, ${warns} Advertencias, ${fails} Fallos Críticos.`, 50);
      
      if (fails > 0) {
        await addLine("[!] ADVERTENCIA: Se han detectado fallos de seguridad críticos en el host.", 50);
        await addLine("[!] Revise las recomendaciones indicadas arriba y aplique remediaciones.", 50);
      } else {
        await addLine("[+] EXCELENTE: El sistema cumple con todas las directivas defensivas probadas.", 50);
      }
      await addLine("===============================================================================", 30);

    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        // Ya manejado por cancel()
        return;
      }
      setError(e instanceof Error ? e.message : "El escaneo ha fallado.");
      setLines(prev => [...prev, `\n[ERROR] Error durante el proceso de escaneo: ${e instanceof Error ? e.message : "Fallo de conexión"}`]);
    } finally {
      if (abortControllerRef.current === controller) {
        setRunning(false);
      }
    }
  }

  const renderLine = (line: string) => {
    if (line.includes("[PASS]")) {
      const parts = line.split("[PASS]");
      return (
        <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
          {parts[0]}<span className="text-success font-bold">[PASS]</span>{parts[1]}
        </div>
      );
    }
    if (line.includes("[WARN]")) {
      const parts = line.split("[WARN]");
      return (
        <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
          {parts[0]}<span className="text-warning font-bold">[WARN]</span>{parts[1]}
        </div>
      );
    }
    if (line.includes("[FAIL]")) {
      const parts = line.split("[FAIL]");
      return (
        <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
          {parts[0]}<span className="text-danger font-bold">[FAIL]</span>{parts[1]}
        </div>
      );
    }
    if (line.includes("[ERROR]")) {
      const parts = line.split("[ERROR]");
      return (
        <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
          {parts[0]}<span className="text-danger font-bold">[ERROR]</span>{parts[1]}
        </div>
      );
    }
    if (line.includes("[ABORTED]")) {
      return <div className="whitespace-pre-wrap leading-relaxed text-warning font-bold">{line}</div>;
    }
    if (line.startsWith("[*]")) {
      return <div className="whitespace-pre-wrap leading-relaxed text-cyber-300">{line}</div>;
    }
    if (line.startsWith("[+]")) {
      return <div className="whitespace-pre-wrap leading-relaxed text-success">{line}</div>;
    }
    return <div className="whitespace-pre-wrap leading-relaxed text-slate-400">{line}</div>;
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Botones de acción */}
      <div className="flex gap-2">
        <Input 
          value={target} 
          onChange={(e) => setTarget(e.target.value)} 
          placeholder="http://localhost:3000" 
          className="font-mono bg-black/50 border-white/10 text-slate-200"
          disabled={running}
        />
        <Button 
          onClick={run} 
          disabled={running} 
          className="bg-cyber-500 hover:bg-cyber-600 text-black font-semibold flex items-center gap-1.5"
        >
          {running ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              <span>Escaneando...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Ejecutar Escaneo</span>
            </>
          )}
        </Button>
        {running && (
          <Button 
            onClick={cancel} 
            variant="danger"
            className="font-semibold flex items-center gap-1.5"
          >
            Cancelar
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-danger font-mono bg-danger/5 border border-danger/25 p-2 rounded">{error}</p>}
      
      {/* Terminal Simulator View */}
      <div className="rounded-lg border border-[#1c2030] bg-[#0a0a0a] p-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-cyber-400" />
            <span>sentinelx-scanner-console.sh</span>
          </div>
          <span className="text-[10px] tracking-wider uppercase text-slate-500">Live Shell Output</span>
        </div>

        <div className="scrollbar-thin h-96 overflow-y-auto font-mono text-xs space-y-1 select-text scroll-smooth">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-600 gap-2 select-none">
              <Shield className="h-8 w-8 text-slate-700 animate-pulse" />
              <p>Consola inactiva. Inicie el escaneo de postura para visualizar la telemetría.</p>
            </div>
          ) : (
            lines.map((line, i) => (
              <div key={i}>
                {renderLine(line)}
              </div>
            ))
          )}
          {running && (
            <div className="inline-block h-3.5 w-2 bg-[#2ed573] animate-pulse ml-0.5" />
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
      
      <p className="text-[10px] text-slate-500 font-mono">
        Nota: Este escáner ejecuta análisis defensivos sobre localhost y telemetría local de hardware/procesos. No realiza ataques ofensivos.
      </p>
    </div>
  );
}
