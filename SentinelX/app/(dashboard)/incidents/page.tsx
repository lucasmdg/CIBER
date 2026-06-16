import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleIncidents } from "@/lib/data/samples";
import { AlarmClock, CheckCircle2, CircleDot, Clock4, FileSearch, ShieldOff, Sparkles } from "lucide-react";

const phases = [
  { key: "detection", icon: AlarmClock, label: "Detection" },
  { key: "investigation", icon: FileSearch, label: "Investigation" },
  { key: "containment", icon: ShieldOff, label: "Containment" },
  { key: "eradication", icon: Sparkles, label: "Eradication" },
  { key: "recovery", icon: CheckCircle2, label: "Recovery" },
  { key: "post_incident", icon: Clock4, label: "Post-Incident" }
] as const;

export default function IncidentsPage() {
  return (
    <>
      <PageHeader
        title="Incident Response"
        description="NIST SP 800-61 phases: detection ? investigation ? containment ? eradication ? recovery ? post-incident."
      />
      <div className="grid gap-4">
        {sampleIncidents.map((i) => {
          const activeIdx = phases.findIndex((p) => p.key === i.phase);
          return (
            <Card key={i.id}>
              <CardHeader>
                <div>
                  <CardTitle>{i.title}</CardTitle>
                  <CardSubtitle>{i.summary}</CardSubtitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={i.severity === "critical" ? "critical" : i.severity === "high" ? "high" : "medium"}>
                    {i.severity}
                  </Badge>
                  <Badge tone="warn">{i.phase.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <ol className="flex min-w-[720px] items-stretch gap-3">
                    {phases.map((p, idx) => {
                      const Icon = p.icon;
                      const state = idx < activeIdx ? "done" : idx === activeIdx ? "active" : "todo";
                      const event = i.events.find((e) => e.phase === p.key);
                      return (
                        <li key={p.key} className="flex-1 min-w-[140px]">
                          <div
                            className={`rounded-lg border p-3 h-full ${
                              state === "active"
                                ? "border-cyber-500/60 bg-cyber-500/10"
                                : state === "done"
                                ? "border-success/40 bg-success/5"
                                : "border-white/10 bg-white/[0.02]"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300">
                              {state === "done" ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : state === "active" ? (
                                <CircleDot className="h-4 w-4 text-cyber-300" />
                              ) : (
                                <Icon className="h-4 w-4 text-slate-500" />
                              )}
                              {p.label}
                            </div>
                            <div className="mt-2 text-sm font-medium text-slate-100">{event?.title ?? "—"}</div>
                            <p className="mt-1 text-xs text-slate-400">{event?.description ?? "Pending."}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
