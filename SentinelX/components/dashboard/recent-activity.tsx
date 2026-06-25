"use client";
import * as React from "react";
import { Activity, Clock, ShieldAlert } from "lucide-react";

type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  target: string | null;
  meta: string | null;
  createdAt: string;
};

export function RecentActivity() {
  const [events, setEvents] = React.useState<AuditEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [forbidden, setForbidden] = React.useState(false);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/audit");
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (!res.ok) throw new Error("Fallo al obtener logs");
      const data = await res.json();
      setEvents(data.events?.slice(0, 10) ?? []); // Mostrar los últimos 10
      setForbidden(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Polling cada 10s
    return () => clearInterval(interval);
  }, []);

  if (forbidden) {
    return (
      <div className="glass p-5 flex flex-col items-center justify-center text-xs text-slate-500 min-h-[200px]">
        <ShieldAlert className="h-5 w-5 text-warning mb-2" />
        <span>Acceso restringido: no tiene permisos para auditar logs.</span>
      </div>
    );
  }

  return (
    <section className="glass p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyber-300">Actividad Reciente</h2>
        <span className="text-xs text-slate-400">Live logs (10s)</span>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyber-500 border-t-transparent" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-8">No se han registrado eventos recientes.</p>
      ) : (
        <ul className="space-y-3 font-mono text-xs max-h-64 overflow-y-auto scrollbar-thin pr-1">
          {events.map((e) => {
            const metaObj = e.meta ? JSON.parse(e.meta) : {};
            return (
              <li key={e.id} className="border-b border-white/5 pb-2 last:border-0 last:pb-0 flex items-start gap-2.5">
                <Clock className="h-3.5 w-3.5 text-slate-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span className="text-cyber-300 font-semibold">{e.actor}</span>
                    <span>{new Date(e.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-300 mt-0.5">
                    Ejecutó <span className="text-slate-100 font-semibold">{e.action}</span>
                    {e.target && <> en <span className="text-slate-400">{e.target}</span></>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
