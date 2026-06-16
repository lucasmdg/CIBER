import { PageHeader } from "@/components/layout/page-header";
import { Kpi, KpiGrid } from "@/components/dashboard/kpi";
import { RiskHeatmap } from "@/components/dashboard/risk-heatmap";
import { TrendChart, type TrendPoint } from "@/components/dashboard/trend-chart";
import { SeverityChart } from "@/components/dashboard/severity-chart";
import { ComplianceCard } from "@/components/dashboard/compliance";
import { ThreatFeed } from "@/components/dashboard/threat-feed";
import { AssetSummary } from "@/components/dashboard/asset-summary";
import { sampleAssets, sampleVulns, sampleThreatActors, sampleIncidents, samplePosture } from "@/lib/data/samples";
import { ShieldCheck, Activity, Bug, Radar } from "lucide-react";

function computeSecurityScore(assets: typeof sampleAssets, vulns: typeof sampleVulns): number {
  const weights = { low: 1, medium: 3, high: 7, critical: 12 } as const;
  const impact = vulns.reduce((acc, v) => acc + weights[v.severity] * v.cvss, 0);
  const exposure = assets.reduce((acc, a) => acc + a.riskScore, 0) || 1;
  const raw = 100 - (impact / exposure) * 6;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

const trend: TrendPoint[] = [
  { day: "Mon", alerts: 42, blocked: 38, incidents: 2 },
  { day: "Tue", alerts: 64, blocked: 60, incidents: 3 },
  { day: "Wed", alerts: 51, blocked: 48, incidents: 1 },
  { day: "Thu", alerts: 73, blocked: 65, incidents: 4 },
  { day: "Fri", alerts: 88, blocked: 79, incidents: 5 },
  { day: "Sat", alerts: 33, blocked: 31, incidents: 0 },
  { day: "Sun", alerts: 27, blocked: 26, incidents: 1 }
];

export default function DashboardPage() {
  const score = computeSecurityScore(sampleAssets, sampleVulns);
  const activeAlerts = samplePosture.filter((p) => p.status !== "pass").length + sampleVulns.filter((v) => v.status === "open").length;
  const critical = sampleVulns.filter((v) => v.severity === "critical" && v.status !== "closed").length;
  const actors = sampleThreatActors.length;
  return (
    <>
      <PageHeader
        title="Executive Security Dashboard"
        description="Real-time posture, threat exposure and incident response readiness."
        actions={
          <a className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10" href="/reports">
            Export executive PDF
          </a>
        }
      />

      <KpiGrid>
        <Kpi label="Security Score" value={score} tone={score >= 75 ? "success" : score >= 55 ? "warning" : "danger"} hint="Composite 0–100" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
        <Kpi label="Active Alerts" value={activeAlerts} tone="warning" hint="Open + posture warnings" icon={<Activity className="h-3.5 w-3.5" />} />
        <Kpi label="Critical Vulnerabilities" value={critical} tone="danger" hint="Unresolved CVSS = 9.0" icon={<Bug className="h-3.5 w-3.5" />} />
        <Kpi label="Tracked Threat Actors" value={actors} tone="cyber" hint="Public intel only" icon={<Radar className="h-3.5 w-3.5" />} />
      </KpiGrid>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="glass lg:col-span-2 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyber-300">Security Trends (7d)</h2>
            <span className="text-xs text-slate-400">alerts · blocked · incidents</span>
          </div>
          <TrendChart data={trend} />
        </section>
        <section className="glass p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyber-300">Vulnerability Severity</h2>
            <span className="text-xs text-slate-400">by count</span>
          </div>
          <SeverityChart
            data={["low", "medium", "high", "critical"].map((s) => ({
              name: s,
              value: sampleVulns.filter((v) => v.severity === s).length
            }))}
          />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RiskHeatmap />
        <ThreatFeed />
        <ComplianceCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AssetSummary />
        <section className="glass lg:col-span-2 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyber-300">Active Incidents</h2>
          <ul className="divide-y divide-white/5">
            {sampleIncidents.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="text-sm font-medium text-slate-100">{i.title}</div>
                  <div className="text-xs text-slate-500">{i.summary}</div>
                </div>
                <span className="rounded border border-warning/40 bg-warning/10 px-2 py-0.5 text-[11px] uppercase text-warning">
                  {i.phase}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
