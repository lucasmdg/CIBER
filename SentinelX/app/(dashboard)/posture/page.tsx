import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { samplePosture } from "@/lib/data/samples";
import { Radar, ShieldCheck, ShieldAlert, ShieldX, Download } from "lucide-react";
import { PostureClient } from "./client";
import { PostureTrendChart } from "@/components/posture/trend-chart";

export default function PosturePage() {
  const score = Math.round(
    (samplePosture.filter((p) => p.status === "pass").length / samplePosture.length) * 100
  );
  return (
    <>
      <PageHeader
        title="Security Posture Scanner"
        description="Safe, loopback-only configuration checks. Defensive guidance, never exploit code."
        actions={
          <a
            href="/api/posture/report"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10 transition-colors"
            title="Descarga el último escaneo en JSON firmado con SHA-256"
          >
            <Download className="h-3.5 w-3.5" />
            Export JSON Report
          </a>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Overall Posture</CardTitle>
              <CardSubtitle>Aggregate of safe checks</CardSubtitle>
            </div>
            <Radar className="h-4 w-4 text-cyber-300" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white">{score}</div>
            <div className="mt-1 text-sm text-slate-400">out of 100</div>
            <PostureClient />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Check catalogue</CardTitle>
              <CardSubtitle>All checks target loopback / private ranges only</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-white/5">
              {samplePosture.map((p) => (
                <li key={p.name} className="grid grid-cols-[24px_1fr_auto] items-start gap-3 py-3">
                  <span className="mt-1">
                    {p.status === "pass" ? (
                      <ShieldCheck className="h-5 w-5 text-success" />
                    ) : p.status === "warn" ? (
                      <ShieldAlert className="h-5 w-5 text-warning" />
                    ) : (
                      <ShieldX className="h-5 w-5 text-danger" />
                    )}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-slate-100">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.category} · {p.target}</div>
                    <p className="mt-1 text-xs text-slate-300">{p.detail}</p>
                    {p.evidence && <pre className="mt-1 max-w-full overflow-x-auto rounded bg-black/40 p-2 text-[11px] text-slate-400">{p.evidence}</pre>}
                  </div>
                  <Badge tone={p.status === "pass" ? "ok" : p.status === "warn" ? "warn" : "fail"}>
                    {p.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Score Trend Chart */}
      <PostureTrendChart />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Defensive guardrails</CardTitle>
            <CardSubtitle>Why SentinelX never becomes offensive tooling</CardSubtitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-300">
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">Loopback / RFC1918 targets only — enforced in <code>postureScanRequestSchema</code>.</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">No payload generators, no exploit code, no shell exec.</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">Read-only configuration inspections and HTTP header checks.</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">CSP, HSTS, X-Frame-Options, Referrer-Policy headers verified.</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">Rate-limited and audit-logged scanner endpoints.</li>
            <li className="rounded-md border border-white/5 bg-white/[0.02] p-3">Findings mapped to NIST CSF and CIS Controls.</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
