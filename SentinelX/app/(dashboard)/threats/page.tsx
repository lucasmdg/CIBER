import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleThreatActors, sampleMalware } from "@/lib/data/samples";
import { Crosshair, Bug } from "lucide-react";

export default function ThreatsPage() {
  return (
    <>
      <PageHeader
        title="Threat Intelligence Center"
        description="Curated public intelligence on adversary groups, malware families and TTPs mapped to MITRE ATT&CK."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Tracked Threat Actors</CardTitle>
              <CardSubtitle>Public sources only · defensive use</CardSubtitle>
            </div>
            <Crosshair className="h-4 w-4 text-cyber-300" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {sampleThreatActors.map((a) => (
                <li key={a.name} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{a.name}</div>
                      <div className="text-xs text-slate-400">{a.aliases}</div>
                    </div>
                    <Badge tone="high">{a.origin}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{a.summary}</p>
                  <dl className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-400 sm:grid-cols-2">
                    <div><span className="text-slate-500">Motivation:</span> {a.motivation}</div>
                    <div><span className="text-slate-500">TTPs:</span> {a.ttps}</div>
                    <div className="sm:col-span-2"><span className="text-slate-500">MITRE:</span> {a.mitre}</div>
                  </dl>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Malware Families</CardTitle>
              <CardSubtitle>Defensive signatures and behaviours</CardSubtitle>
            </div>
            <Bug className="h-4 w-4 text-cyber-300" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {sampleMalware.map((m) => (
                <li key={m.family} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{m.family}</div>
                      <div className="text-xs text-slate-400">First seen {m.firstSeen.toLocaleDateString()}</div>
                    </div>
                    <Badge tone="medium">{m.type}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">Campaign: {m.campaign}</p>
                  <p className="mt-1 text-xs text-slate-400">TTPs: {m.ttps}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>MITRE ATT&CK Coverage</CardTitle>
            <CardSubtitle>Detection content mapped per tactic</CardSubtitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { id: "TA0001", name: "Initial Access", cov: 64 },
              { id: "TA0002", name: "Execution", cov: 52 },
              { id: "TA0003", name: "Persistence", cov: 71 },
              { id: "TA0004", name: "Privilege Escalation", cov: 48 },
              { id: "TA0005", name: "Defense Evasion", cov: 39 },
              { id: "TA0006", name: "Credential Access", cov: 60 },
              { id: "TA0007", name: "Discovery", cov: 77 },
              { id: "TA0008", name: "Lateral Movement", cov: 42 },
              { id: "TA0011", name: "Command and Control", cov: 65 },
              { id: "TA0010", name: "Exfiltration", cov: 33 }
            ].map((t) => (
              <div key={t.id} className="rounded-md border border-white/5 bg-white/[0.02] p-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">{t.id}</div>
                <div className="text-sm font-medium text-slate-100">{t.name}</div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full bg-gradient-to-r from-cyber-500 to-cyber-300" style={{ width: `${t.cov}%` }} />
                </div>
                <div className="mt-1 text-right text-[11px] text-cyber-200">{t.cov}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
