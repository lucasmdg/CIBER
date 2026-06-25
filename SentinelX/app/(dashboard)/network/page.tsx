"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldAlert, Wifi, Globe, Server, ArrowDown, ArrowUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Interface = {
  iface: string;
  ip: string;
  mac: string;
  speed: string;
  status: string;
};

type Connection = {
  protocol: string;
  localAddress: string;
  localPort: string;
  peerAddress: string;
  peerPort: string;
  state: string;
  isSuspicious: boolean;
};

type Stat = {
  iface: string;
  rx_sec: number;
  tx_sec: number;
};

export default function NetworkPage() {
  const [data, setData] = React.useState<{ interfaces: Interface[]; connections: Connection[]; stats: Stat[] } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function fetchNetworkData() {
    try {
      const res = await fetch("/api/network/scan");
      if (!res.ok) throw new Error("Fallo al escanear telemetría de red.");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = React.useMemo(() => {
    if (!data?.stats) return [];
    return data.stats.map(s => ({
      name: s.iface,
      Descarga: parseFloat((s.rx_sec / 1024).toFixed(2)), // KB/s
      Subida: parseFloat((s.tx_sec / 1024).toFixed(2)) // KB/s
    }));
  }, [data]);

  const suspiciousConnections = React.useMemo(() => {
    if (!data?.connections) return [];
    return data.connections.filter(c => c.isSuspicious);
  }, [data]);

  return (
    <>
      <PageHeader
        title="Network Telemetry Monitor"
        description="Monitorización de sockets activos, interfaces locales y volumen de tráfico en tiempo real."
      />

      {error && (
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="py-4 text-sm text-danger flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <span>Error de telemetría: {error}</span>
          </CardContent>
        </Card>
      )}

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyber-500 border-t-transparent" />
            <p className="text-xs text-slate-400 font-mono animate-pulse">CARGANDO TELEMETRÍA EN VIVO...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Top Panel: Resumen de Interfaces y Tráfico */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Volumen de Tráfico</CardTitle>
                    <CardSubtitle>Velocidades de descarga y subida por interfaz activa (KB/s)</CardSubtitle>
                  </div>
                  <Activity className="h-4 w-4 text-cyber-300" />
                </div>
              </CardHeader>
              <CardContent className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#4a5568" fontSize={11} tickLine={false} />
                      <YAxis stroke="#4a5568" fontSize={11} tickLine={false} axisLine={false} unit=" KB" />
                      <Tooltip
                        contentStyle={{ background: "#0e1117", borderColor: "#1c2030", borderRadius: "8px" }}
                        labelStyle={{ color: "#e2e8f0", fontFamily: "JetBrains Mono", fontSize: "12px" }}
                      />
                      <Bar dataKey="Descarga" fill="#00d4ff" radius={[4, 4, 0, 0]} name="Descarga (KB/s)" />
                      <Bar dataKey="Subida" fill="#ffa502" radius={[4, 4, 0, 0]} name="Subida (KB/s)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                    No se registran estadísticas de tráfico activas.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Interfaces de Red</CardTitle>
                    <CardSubtitle>Dispositivos de hardware activos</CardSubtitle>
                  </div>
                  <Wifi className="h-4 w-4 text-cyber-300" />
                </div>
              </CardHeader>
              <CardContent className="scrollbar-thin max-h-64 overflow-y-auto">
                <ul className="space-y-3">
                  {data?.interfaces.map(i => (
                    <li key={i.iface} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-cyber-300">{i.iface}</span>
                        <Badge tone={i.status === "up" ? "ok" : "warn"}>{i.status}</Badge>
                      </div>
                      <div className="mt-1 grid grid-cols-2 text-[11px] text-slate-400 font-mono">
                        <div>IP: {i.ip}</div>
                        <div>Speed: {i.speed}</div>
                        <div className="col-span-2">MAC: {i.mac}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Panel: Conexiones de Sockets Activas */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle>Sockets Abiertos & Conexiones Activas</CardTitle>
                  <CardSubtitle>Sockets locales TCP/UDP e IPs remotas (filtrando por puertos y estados)</CardSubtitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={suspiciousConnections.length > 0 ? "fail" : "ok"}>
                    {suspiciousConnections.length} SOSPECHOSAS
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="scrollbar-thin max-h-96 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-slate-400 font-mono">
                      <th className="py-2 px-3">Protocolo</th>
                      <th className="py-2 px-3">Dirección Local</th>
                      <th className="py-2 px-3">Dirección Remota</th>
                      <th className="py-2 px-3">Estado</th>
                      <th className="py-2 px-3 text-right">Gravedad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {data?.connections.map((c, idx) => (
                      <tr
                        key={idx}
                        className={
                          c.isSuspicious
                            ? "bg-danger/5 text-danger font-medium"
                            : c.state === "ESTABLISHED"
                            ? "text-slate-200"
                            : "text-slate-400"
                        }
                      >
                        <td className="py-2 px-3">{c.protocol}</td>
                        <td className="py-2 px-3">
                          {c.localAddress}:{c.localPort}
                        </td>
                        <td className="py-2 px-3">
                          {c.peerAddress}:{c.peerPort}
                        </td>
                        <td className="py-2 px-3">
                          <span className={c.state === "LISTEN" ? "text-cyber-400 font-semibold" : ""}>
                            {c.state}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          {c.isSuspicious ? (
                            <span className="inline-flex items-center gap-1 rounded bg-danger/20 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                              <ShieldAlert className="h-3 w-3" /> SOSPECHOSO
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 uppercase">Seguro</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
