import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, ShieldCheck, Bug, Crosshair, AlarmClock } from "lucide-react";

const reportKinds = [
  { key: "executive", title: "Executive Report", desc: "High-level posture, top risks and recommendations.", icon: ShieldCheck },
  { key: "technical", title: "Technical Report", desc: "Detailed findings, asset and vulnerability tables.", icon: Bug },
  { key: "threat", title: "Threat Brief", desc: "Actors, malware families and MITRE ATT&CK coverage.", icon: Crosshair },
  { key: "incident", title: "Incident Report", desc: "Timeline, IR actions, lessons learned.", icon: AlarmClock }
] as const;

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Security Reports"
        description="Generate portfolio-ready PDF reports. Branded, deterministic and offline-safe."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportKinds.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.key}>
              <CardHeader>
                <div>
                  <CardTitle>{r.title}</CardTitle>
                  <CardSubtitle>{r.desc}</CardSubtitle>
                </div>
                <Icon className="h-4 w-4 text-cyber-300" />
              </CardHeader>
              <CardContent>
                <a
                  href={`/api/reports/${r.key}`}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-cyber-500/90 px-4 text-sm font-medium text-white shadow-neon hover:bg-cyber-400"
                >
                  <FileBarChart className="h-4 w-4" /> Download PDF
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Compliance Mapping</CardTitle>
            <CardSubtitle>Each report cross-references the listed frameworks</CardSubtitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm text-slate-300">
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">NIST CSF 2.0</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">ISO/IEC 27001:2022</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">CIS Controls v8</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">MITRE ATT&CK</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">PCI DSS 4.0</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">NIST SP 800-61 (IR)</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">OWASP ASVS L2</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">SOC 2 Trust Services</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
