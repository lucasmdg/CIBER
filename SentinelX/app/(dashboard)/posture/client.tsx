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

  // Auto scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  async function run() {
    setError(null);
    setRunning(true);
    setLines([]);

    const addLine = async (txt: string, delay = 0) => {
      setLines(prev => [...prev, txt]);
      if (delay > 0) {
        await sleep(delay);
      }
    };

    try {
      await addLine("[*] Inicializando Scanner de Postura de Seguridad...", 200);
      await addLine(`[*] Host objetivo: ${target} (Loopback/Localhost)`, 150);
      await addLine("[*] Cargando librerías de telemetría de hardware...", 100);
      await addLine("[*] Cargando firmas de blacklist de procesos...", 100);
      await addLine("[*] Conectando con el socket local... Por favor, espere.", 200);
      
      const startTime = Date.now();
      
      // Llamada real al endpoint
      const r = await fetch("/api/scanner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ target })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "El escaneo ha fallado.");

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      await addLine(`[+] Conexión establecida con éxito. Telemetría recolectada en ${duration} segundos.`, 150);
      await addLine("[*] Ejecutando análisis heurístico secuencial de directivas...", 200);

      const checks = data.results as Result[];
      let fails = 0;
      let warns = 0;
      let passes = 0;

      // Imprimir checks secuencialmente con un delay realista de 60 a 120 ms
      for (const check of checks) {
        const delay = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
        
        let statusString = "";
        if (check.status === "pass") {
          statusString = "[PASS]";
          passes++;
        } else if (check.status === "warn") {
          statusString = "[WARN]";
          warns++;
        } else {
          statusString = "[FAIL]";
          fails++;
        }

        await addLine(`[CHECK] ${check.name.padEnd(45, ".")} ${statusString}`, delay);
        await addLine(`        Detalle: ${check.detail}`, 30);
        await addLine(`        Rec:     ${check.recommendation}`, 30);
        if (check.evidence) {
          const evidenceLines = check.evidence.split("\n");
          await addLine("        Evidencia:", 10);
          for (const evLine of evidenceLines) {
            await addLine(`          > ${evLine}`, 10);
          }
        }
        await addLine("--------------------------------------------------------------------------------", 20);
      }

      // Calcular puntuación final
      const score = Math.round((passes / (passes + warns + fails)) * 100);
      
      await addLine("[+]", 100);
      await addLine("=================================== RESUMEN ===================================", 100);
      await addLine(`[+] Escaneo completado para el host local.`, 100);
      await addLine(`[+] Puntuación General: ${score}/100`, 150);
      await addLine(`[+] Métricas: ${passes} Aprobados, ${warns} Advertencias, ${fails} Fallos Críticos.`, 100);
      
      if (fails > 0) {
        await addLine("[!] ADVERTENCIA: Se han detectado fallos de seguridad críticos en el host.", 100);
        await addLine("[!] Revise las recomendaciones indicadas arriba y aplique remediaciones.", 100);
      } else {
        await addLine("[+] EXCELENTE: El sistema cumple con todas las directivas defensivas probadas.", 100);
      }
      await addLine("===============================================================================", 50);

    } catch (e) {
      setError(e instanceof Error ? e.message : "El escaneo ha fallado.");
      setLines(prev => [...prev, `\n[ERR] Error durante el proceso de escaneo: ${e instanceof Error ? e.message : "Fallo de conexión"}`]);
    } finally {
      setRunning(false);
    }
  }

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

        <div className="scrollbar-thin h-96 overflow-y-auto font-mono text-xs text-[#2ed573] space-y-1 select-text scroll-smooth">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-600 gap-2 select-none">
              <Shield className="h-8 w-8 text-slate-700 animate-pulse" />
              <p>Consola inactiva. Inicie el escaneo de postura para visualizar la telemetría.</p>
            </div>
          ) : (
            lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap leading-relaxed">
                {line}
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
