﻿"use client";
// app/(dashboard)/usage/page.tsx
// Panel de créditos, uso y rentabilidad de Sophia vs cloud

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Coins, Zap, Clock, TrendingUp, Euro } from "lucide-react";

interface UsageData {
  summary: {
    totalRequests: number;
    totalTokens: number;
    totalDurationMs: number;
    cloudCostEur: number;
    savedEur: number;
  };
  byDay: { date: string; tokens: number; requests: number }[];
  byBackend: Record<string, { tokens: number; requests: number }>;
}

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-bold font-mono mt-1 ${accent ?? "text-slate-200"}`}>{value}</p>
            {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-2">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UsagePage() {
  const [data, setData] = React.useState<UsageData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/usage")
      .then(r => r.ok ? r.json() : null)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
        badge={{ text: "MÓDULO REAL", tone: "ok" }} title="Uso y Rentabilidad" description="Tokens, tiempo y ahorro frente a proveedores cloud." />
        <div className="h-48 flex items-center justify-center text-slate-600 text-sm">Cargando datos de uso...</div>
      </>
    );
  }

  const summary = data?.summary;
  const avgDurS = summary ? (summary.totalDurationMs / 1000 / Math.max(summary.totalRequests, 1)).toFixed(1) : "â€”";

  return (
    <>
      <PageHeader
        badge={{ text: "MÓDULO REAL", tone: "ok" }}
        title="Uso y Rentabilidad"
        description="Consumo de tokens por backend, tiempo de inferencia y coste evitado frente a APIs de pago."
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Zap}
          label="Tokens totales"
          value={summary ? (summary.totalTokens / 1000).toFixed(1) + "K" : "0"}
          sub={`${summary?.totalRequests ?? 0} peticiones`}
        />
        <StatCard
          icon={Clock}
          label="Tiempo medio"
          value={`${avgDurS}s`}
          sub="por petición"
        />
        <StatCard
          icon={Euro}
          label="Coste en cloud"
          value={`â‚¬${summary?.cloudCostEur?.toFixed(2) ?? "0.00"}`}
          sub="si usaras GPT-4o, Claude, etc."
          accent="text-warning"
        />
        <StatCard
          icon={Coins}
          label="Coste real (local)"
          value="â‚¬0.00"
          sub={`Ahorro: â‚¬${summary?.savedEur?.toFixed(2) ?? "0.00"}`}
          accent="text-success"
        />
      </div>

      {/* Comparativa visual */}
      <Card className="border-success/20 bg-success/3">
        <CardContent className="py-5">
          <div className="flex items-center gap-4 flex-wrap">
            <TrendingUp className="h-8 w-8 text-success flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">
                {summary && summary.cloudCostEur > 0
                  ? `Has generado ${(summary.totalTokens / 1000).toFixed(1)}K tokens por â‚¬0.00`
                  : "Empieza a usar Sophia para ver tu ahorro acumulado"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                La misma carga en GPT-4o Mini costaría ~â‚¬{summary ? (summary.totalTokens / 1_000_000 * 0.6).toFixed(4) : "0"},
                en Claude Sonnet ~â‚¬{summary ? (summary.totalTokens / 1_000_000 * 9).toFixed(4) : "0"}.
                Aquí: 0â‚¬ por token, para siempre.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de tokens por día */}
      {(data?.byDay?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tokens por día</CardTitle>
            <CardSubtitle>Actividad de Sophia en el tiempo</CardSubtitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.byDay}>
                <defs>
                  <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#4a5568" fontSize={10} tickLine={false} />
                <YAxis stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0e1117", borderColor: "#1c2030", borderRadius: "8px" }}
                  labelStyle={{ color: "#e2e8f0", fontFamily: "JetBrains Mono", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="tokens" stroke="#00d4ff" fill="url(#tokenGrad)" strokeWidth={2} name="Tokens" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Por backend */}
      {data?.byBackend && Object.keys(data.byBackend).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uso por backend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(data.byBackend).map(([backend, stats]) => (
                <div key={backend} className="rounded-lg bg-white/3 border border-white/8 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-slate-300 capitalize">{backend}</span>
                    <span className="text-xs text-slate-500 font-mono">{stats.requests} peticiones</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-cyber-300 mt-1">
                    {(stats.tokens / 1000).toFixed(1)}K tokens
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!data || data.summary.totalRequests === 0) && (
        <Card>
          <CardContent className="py-12 text-center text-slate-600">
            <p className="text-sm">Sin datos de uso todavía.</p>
            <p className="text-xs mt-1">Usa el chat de Sophia para que empiece a registrarse el consumo.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
