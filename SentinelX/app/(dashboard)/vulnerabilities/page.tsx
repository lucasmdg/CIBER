"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendChart, type TrendPoint } from "@/components/dashboard/trend-chart";
import { Search, ArrowUpDown } from "lucide-react";

type Vuln = {
  id: string;
  cve: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  cvss: number;
  status: "open" | "in_review" | "remediating" | "mitigated" | "closed";
  description: string;
  published: string;
  affected: { asset: { name: string } }[];
};

const SORT_KEYS = ["cvss", "published", "severity"] as const;

export default function VulnerabilitiesPage() {
  const [items, setItems] = React.useState<Vuln[]>([]);
  const [q, setQ] = React.useState("");
  const [sev, setSev] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");
  const [sort, setSort] = React.useState<(typeof SORT_KEYS)[number]>("cvss");
  const [dir, setDir] = React.useState<"asc" | "desc">("desc");

  React.useEffect(() => {
    fetch("/api/vulnerabilities", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(d.vulnerabilities ?? []));
  }, []);

  const sevOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

  const filtered = items
    .filter((v) => {
      const matchesQ = [v.cve, v.title, v.description].some((s) => s.toLowerCase().includes(q.toLowerCase()));
      const matchesS = sev === "all" || v.severity === sev;
      const matchesSt = status === "all" || v.status === status;
      return matchesQ && matchesS && matchesSt;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sort === "cvss") cmp = a.cvss - b.cvss;
      else if (sort === "published") cmp = new Date(a.published).getTime() - new Date(b.published).getTime();
      else if (sort === "severity") cmp = sevOrder[a.severity] - sevOrder[b.severity];
      return dir === "asc" ? cmp : -cmp;
    });

  const trend: TrendPoint[] = React.useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((v) => {
      const m = new Date(v.published).toLocaleString("en-US", { month: "short" });
      counts[m] = (counts[m] ?? 0) + 1;
    });
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({
      day: m,
      alerts: counts[m] ?? Math.floor(Math.random() * 8),
      blocked: Math.max(0, (counts[m] ?? 0) - 1),
      incidents: 0
    }));
  }, [items]);

  return (
    <>
      <PageHeader
        title="Vulnerability Management"
        description="Track CVEs, prioritise by risk, drive remediation and observe trends."
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Monthly vulnerability discovery</CardTitle>
            <CardSubtitle>Synthetic sample data</CardSubtitle>
          </div>
        </CardHeader>
        <CardContent>
          <TrendChart data={trend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Vulnerabilities</CardTitle>
            <CardSubtitle>{filtered.length} matching · {items.length} total</CardSubtitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_140px_140px_160px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input className="pl-8" placeholder="Search CVE, title, description" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <Select value={sev} onChange={(e) => setSev(e.target.value)}>
              <option value="all">All severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="in_review">In review</option>
              <option value="remediating">Remediating</option>
              <option value="mitigated">Mitigated</option>
              <option value="closed">Closed</option>
            </Select>
            <Select
              value={`${sort}-${dir}`}
              onChange={(e) => {
                const [s, d] = e.target.value.split("-") as [(typeof SORT_KEYS)[number], "asc" | "desc"];
                setSort(s);
                setDir(d);
              }}
            >
              <option value="cvss-desc">Risk: high ? low</option>
              <option value="cvss-asc">Risk: low ? high</option>
              <option value="published-desc">Newest first</option>
              <option value="published-asc">Oldest first</option>
              <option value="severity-desc">Severity: high ? low</option>
            </Select>
          </div>

          <Table>
            <Thead>
              <Tr>
                <Th>CVE</Th>
                <Th>Title</Th>
                <Th>
                  <button onClick={() => setSort("severity")} className="inline-flex items-center gap-1">
                    Severity <ArrowUpDown className="h-3 w-3" />
                  </button>
                </Th>
                <Th>CVSS</Th>
                <Th>Status</Th>
                <Th>Affected assets</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((v) => (
                <Tr key={v.id}>
                  <Td className="font-mono text-cyber-200">{v.cve}</Td>
                  <Td>
                    <div className="font-medium text-slate-100">{v.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{v.description}</div>
                  </Td>
                  <Td>
                    <Badge tone={v.severity}>{v.severity}</Badge>
                  </Td>
                  <Td>{v.cvss.toFixed(1)}</Td>
                  <Td>
                    <Badge tone={v.status === "closed" || v.status === "mitigated" ? "ok" : v.status === "open" ? "fail" : "warn"}>
                      {v.status.replace("_", " ")}
                    </Badge>
                  </Td>
                  <Td>
                    {v.affected.length === 0 ? (
                      <span className="text-slate-500">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {v.affected.slice(0, 3).map((f) => (
                          <span key={f.asset.name} className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-slate-200">
                            {f.asset.name}
                          </span>
                        ))}
                        {v.affected.length > 3 && <span className="text-xs text-slate-400">+{v.affected.length - 3}</span>}
                      </div>
                    )}
                  </Td>
                </Tr>
              ))}
              {filtered.length === 0 && (
                <Tr>
                  <Td colSpan={6} className="text-center text-slate-500">No vulnerabilities match your filter.</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
