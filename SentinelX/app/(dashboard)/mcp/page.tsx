﻿"use client";
// app/(dashboard)/mcp/page.tsx

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server, Plus, RefreshCw, CheckCircle, XCircle,
  Zap, Trash2, ToggleLeft, ToggleRight, Wrench, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { McpServerRecord, McpPingResult } from "@/lib/mcp/types";

export default function McpPage() {
  const [servers, setServers] = React.useState<McpServerRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", url: "", description: "" });
  const [pinging, setPinging] = React.useState<string | null>(null);
  const [pingResult, setPingResult] = React.useState<{ id: string; result: McpPingResult } | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/mcp");
      if (res.ok) setServers(await res.json());
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  async function register() {
    if (!form.name || !form.url) return;
    const res = await fetch("/api/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", url: "", description: "" });
      setAdding(false);
      await load();
    }
  }

  async function ping(id: string) {
    setPinging(id);
    setPingResult(null);
    try {
      const res = await fetch(`/api/mcp/${id}/ping`, { method: "POST" });
      if (res.ok) {
        const result: McpPingResult = await res.json();
        setPingResult({ id, result });
        await load();
      }
    } finally {
      setPinging(null);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/mcp/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    await load();
  }

  async function deleteServer(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/mcp/${id}`, { method: "DELETE" });
      await load();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <PageHeader
        badge={{ text: "MÓDULO REAL", tone: "ok" }}
        title="Gestor de MCPs"
        description="Model Context Protocol â€” registra servidores, descubre herramientas y monitoriza su estado."
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">{servers.length} servidores registrados</span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading} className="gap-1.5 text-xs">
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
            Refrescar
          </Button>
          <Button onClick={() => setAdding(!adding)} className="gap-1.5 text-xs">
            <Plus className="h-3 w-3" />
            Añadir MCP
          </Button>
        </div>
      </div>

      {/* Form de registro */}
      {adding && (
        <Card className="border-cyber-500/20">
          <CardHeader>
            <CardTitle>Registrar nuevo servidor MCP</CardTitle>
            <CardSubtitle>Se hará un ping inicial para descubrir las herramientas disponibles</CardSubtitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500 font-mono mb-1 block">Nombre *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="filesystem-mcp"
                  className="w-full rounded bg-white/5 border border-white/10 px-3 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-500/40"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-mono mb-1 block">URL del servidor *</label>
                <input
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="http://localhost:3001"
                  className="w-full rounded bg-white/5 border border-white/10 px-3 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-500/40"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-mono mb-1 block">Descripción (opcional)</label>
              <input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Acceso al sistema de ficheros local"
                className="w-full rounded bg-white/5 border border-white/10 px-3 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-500/40"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={register} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Registrar y hacer ping
              </Button>
              <Button variant="outline" onClick={() => setAdding(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de servidores */}
      {loading && servers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500 text-sm">
            Cargando servidores MCP...
          </CardContent>
        </Card>
      ) : servers.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-3 text-slate-600">
            <Server className="h-10 w-10" />
            <p className="text-sm">No hay servidores MCP registrados.</p>
            <p className="text-xs text-slate-700">Añade uno con el botón superior. Ejemplos: filesystem-mcp, github-mcp, brave-search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {servers.map(s => (
            <Card key={s.id} className={cn(!s.active && "opacity-60")}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-200">{s.name}</span>
                      <Badge tone={s.lastPingStatus === "ok" ? "ok" : s.lastPingStatus === "error" ? "fail" : "warn"}>
                        {s.lastPingStatus ?? "PENDIENTE"}
                      </Badge>
                      {!s.active && <Badge tone="warn">DESACTIVADO</Badge>}
                    </div>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{s.url}</p>
                    {s.description && <p className="text-xs text-slate-500 mt-1">{s.description}</p>}

                    {/* Herramientas descubiertas */}
                    {s.tools.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {s.tools.map(t => (
                          <span
                            key={t.name}
                            className="inline-flex items-center gap-1 rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-400"
                            title={t.description}
                          >
                            <Wrench className="h-2.5 w-2.5" />
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Ãšltimo ping */}
                    {s.lastPing && (
                      <p className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-slate-600">
                        <Clock className="h-2.5 w-2.5" />
                        Ãšltimo ping: {new Date(s.lastPing).toLocaleString()}
                      </p>
                    )}

                    {/* Resultado de ping en vivo */}
                    {pingResult?.id === s.id && (
                      <div className={cn(
                        "mt-2 rounded px-2 py-1 text-xs font-mono",
                        pingResult.result.ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      )}>
                        {pingResult.result.ok
                          ? `âœ“ OK Â· ${pingResult.result.latencyMs}ms Â· ${pingResult.result.tools.length} herramientas`
                          : `âœ— ${pingResult.result.error}`}
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => ping(s.id)}
                      disabled={pinging === s.id}
                      className="flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[10px] font-mono text-slate-400 hover:text-cyber-300 hover:border-cyber-500/30 transition-colors"
                      title="Ping"
                    >
                      <Zap className={cn("h-3 w-3", pinging === s.id && "animate-pulse")} />
                      Ping
                    </button>
                    <button
                      onClick={() => toggleActive(s.id, !s.active)}
                      className="rounded border border-white/10 p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title={s.active ? "Desactivar" : "Activar"}
                    >
                      {s.active
                        ? <ToggleRight className="h-4 w-4 text-success" />
                        : <ToggleLeft className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteServer(s.id)}
                      disabled={deleting === s.id}
                      className="rounded border border-white/10 p-1.5 text-slate-400 hover:text-danger transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
