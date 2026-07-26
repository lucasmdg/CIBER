﻿"use client";
// app/(dashboard)/system/page.tsx
// Centro de control del sistema: Procesos / Recursos / Servicios

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Cpu, HardDrive, Activity, Search, RefreshCw,
  AlertTriangle, Thermometer, Database, X, AlertOctagon
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "resources" | "processes";

interface Resources {
  cpu: { load: number; cores: number[] };
  ram: { totalGb: number; usedGb: number; freeGb: number; percent: number };
  disk: { mount: string; totalGb: number; usedGb: number; percent: number; fs: string }[];
  temp: { main: number | null; cores: number[]; max: number | null };
}

interface Process {
  pid: number;
  name: string;
  command: string;
  cpu: number;
  memMb: number;
  state: string;
  user: string;
}

function GaugeRing({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width="90" height="90" className="-rotate-90">
          <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="45" cy="45" r={r} fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold font-mono">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function SystemPage() {
  const [tab, setTab] = React.useState<Tab>("resources");
  const [resources, setResources] = React.useState<Resources | null>(null);
  const [processes, setProcesses] = React.useState<{ count: number; list: Process[] } | null>(null);
  const [loadingRes, setLoadingRes] = React.useState(true);
  const [loadingProc, setLoadingProc] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [killTarget, setKillTarget] = React.useState<Process | null>(null);
  const [killing, setKilling] = React.useState(false);
  const [killError, setKillError] = React.useState<string | null>(null);

  // Recursos: polling cada 3s
  React.useEffect(() => {
    async function fetchResources() {
      const res = await fetch("/api/system/resources").catch(() => null);
      if (res?.ok) setResources(await res.json());
      setLoadingRes(false);
    }
    fetchResources();
    const id = setInterval(fetchResources, 3000);
    return () => clearInterval(id);
  }, []);

  async function loadProcesses() {
    setLoadingProc(true);
    try {
      const res = await fetch("/api/system/processes");
      if (res.ok) setProcesses(await res.json());
    } finally {
      setLoadingProc(false);
    }
  }

  React.useEffect(() => {
    if (tab === "processes") loadProcesses();
  }, [tab]);

  async function killProcess() {
    if (!killTarget) return;
    setKilling(true);
    setKillError(null);
    try {
      const res = await fetch("/api/system/processes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid: killTarget.pid }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        setKillError(error);
      } else {
        setKillTarget(null);
        await loadProcesses();
      }
    } finally {
      setKilling(false);
    }
  }

  const filteredProcs = React.useMemo(() => {
    const list = processes?.list ?? [];
    const q = search.toLowerCase();
    return q ? list.filter(p => p.name.toLowerCase().includes(q) || String(p.pid).includes(q)) : list;
  }, [processes, search]);

  const cpuColor = resources?.cpu.load ?? 0 > 85 ? "#ff4757" : resources?.cpu.load ?? 0 > 65 ? "#ffa502" : "#00d4ff";
  const ramColor = resources?.ram.percent ?? 0 > 90 ? "#ff4757" : resources?.ram.percent ?? 0 > 75 ? "#ffa502" : "#2ed573";

  const tabs = [
    { id: "resources" as Tab, label: "Recursos en vivo", icon: Activity },
    { id: "processes" as Tab, label: `Procesos${processes ? ` (${processes.count})` : ""}`, icon: Cpu },
  ];

  return (
    <>
      <PageHeader
        badge={{ text: "MÓDULO REAL", tone: "ok" }}
        title="Centro de Control del Sistema"
        description="Procesos activos, uso de recursos y telemetría del host en tiempo real."
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors",
                tab === t.id ? "border-cyber-500 text-cyber-300" : "border-transparent text-slate-500 hover:text-slate-300"
              )}>
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* â”€â”€ Recursos â”€â”€ */}
      {tab === "resources" && (
        <div className="grid gap-4">
          {/* Gauges principales */}
          <Card>
            <CardHeader>
              <CardTitle>Telemetría en tiempo real</CardTitle>
              <CardSubtitle>Actualización cada 3 segundos Â· datos del host local</CardSubtitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-8 justify-center py-2">
                {resources ? (
                  <>
                    <GaugeRing value={resources.cpu.load} color={cpuColor} label="CPU" />
                    <GaugeRing value={resources.ram.percent} color={ramColor} label="RAM" />
                    {resources.disk.map(d => (
                      <GaugeRing key={d.mount} value={d.percent} color="#a78bfa" label={d.mount} />
                    ))}
                  </>
                ) : (
                  <div className="h-24 flex items-center text-slate-600 text-sm">Cargando telemetría...</div>
                )}
              </div>

              {resources && (
                <div className="mt-4 grid gap-2">
                  {/* Cores CPU */}
                  {resources.cpu.cores.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono text-slate-600 mb-1.5 uppercase tracking-wider">Carga por núcleo</p>
                      <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
                        {resources.cpu.cores.map((c, i) => (
                          <div key={i} className="space-y-0.5">
                            <div className="text-[9px] font-mono text-slate-600 text-center">C{i}</div>
                            <Progress value={c} className="h-1" />
                            <div className="text-[9px] font-mono text-center text-slate-500">{c}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RAM detalle */}
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center border-t border-white/5 pt-3 mt-1">
                    <div>
                      <div className="text-slate-500">Total</div>
                      <div className="text-slate-200 font-semibold">{resources.ram.totalGb} GB</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Usado</div>
                      <div className="text-warning font-semibold">{resources.ram.usedGb} GB</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Libre</div>
                      <div className="text-success font-semibold">{resources.ram.freeGb} GB</div>
                    </div>
                  </div>

                  {/* Temperatura */}
                  {resources.temp.main !== null && (
                    <div className="flex items-center gap-2 rounded bg-white/3 border border-white/5 px-3 py-2 text-xs font-mono">
                      <Thermometer className="h-4 w-4 text-warning" />
                      <span className="text-slate-400">CPU Temp</span>
                      <span className={cn("font-semibold", (resources.temp.main ?? 0) > 80 ? "text-danger" : "text-slate-200")}>
                        {resources.temp.main}Â°C
                      </span>
                      {resources.temp.max && (
                        <span className="text-slate-600">max {resources.temp.max}Â°C</span>
                      )}
                    </div>
                  )}

                  {/* Discos */}
                  <div className="space-y-2 border-t border-white/5 pt-3">
                    {resources.disk.map(d => (
                      <div key={d.mount}>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="flex items-center gap-1.5">
                            <Database className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-300">{d.mount}</span>
                            <span className="text-slate-600">{d.fs}</span>
                          </span>
                          <span className="text-slate-400">{d.usedGb} / {d.totalGb} GB</span>
                        </div>
                        <Progress value={d.percent} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* â”€â”€ Procesos â”€â”€ */}
      {tab === "processes" && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filtrar por nombre o PID..."
                className="w-full rounded-lg bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-500/40"
              />
            </div>
            <Button variant="outline" onClick={loadProcesses} disabled={loadingProc} className="gap-1.5">
              <RefreshCw className={cn("h-3 w-3", loadingProc && "animate-spin")} />
              Refrescar
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500">
                      <th className="px-4 py-3" scope="col">PID</th>
                      <th className="px-4 py-3" scope="col">Nombre</th>
                      <th className="px-4 py-3" scope="col">Usuario</th>
                      <th className="px-4 py-3 text-right" scope="col">CPU%</th>
                      <th className="px-4 py-3 text-right" scope="col">RAM (MB)</th>
                      <th className="px-4 py-3" scope="col">Estado</th>
                      <th className="px-4 py-3" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProcs.slice(0, 100).map(p => (
                      <tr key={p.pid} className="hover:bg-white/3 transition-colors group">
                        <td className="px-4 py-2 text-slate-500">{p.pid}</td>
                        <td className="px-4 py-2 text-slate-200 max-w-[200px] truncate" title={p.command}>{p.name}</td>
                        <td className="px-4 py-2 text-slate-500">{p.user}</td>
                        <td className={cn(
                          "px-4 py-2 text-right font-semibold",
                          p.cpu > 50 ? "text-danger" : p.cpu > 20 ? "text-warning" : "text-slate-400"
                        )}>{p.cpu}</td>
                        <td className="px-4 py-2 text-right text-slate-400">{p.memMb.toFixed(0)}</td>
                        <td className="px-4 py-2">
                          <Badge tone={p.state === "running" ? "ok" : "warn"} className="text-[9px]">
                            {p.state}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => setKillTarget(p)}
                            className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-500 hover:text-danger hover:bg-danger/10 transition-all"
                            title={`Terminar proceso ${p.pid}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProcs.length === 0 && (
                  <div className="py-12 text-center text-slate-600 text-sm">
                    {loadingProc ? "Cargando procesos..." : "No se encontraron procesos."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Modal de confirmación de kill */}
          {killTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <Card className="max-w-sm w-full mx-4 border-danger/30">
                <CardContent className="py-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="h-6 w-6 text-danger flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-200">Terminar proceso</p>
                      <p className="text-xs text-slate-500 mt-0.5">Esta acción es irreversible.</p>
                    </div>
                  </div>
                  <div className="rounded bg-white/5 border border-white/10 px-3 py-2 font-mono text-sm">
                    <span className="text-slate-400">PID {killTarget.pid}</span>{" "}
                    <span className="text-slate-200">{killTarget.name}</span>
                  </div>
                  {killError && (
                    <p className="text-xs text-danger">{killError}</p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Button variant="danger" onClick={killProcess} disabled={killing} className="flex-1">
                      {killing ? "Terminando..." : "Sí, terminar proceso"}
                    </Button>
                    <Button variant="outline" onClick={() => { setKillTarget(null); setKillError(null); }} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </>
  );
}
