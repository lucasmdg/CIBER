import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleThreatActors, sampleMalware } from "@/lib/data/samples";

export function ThreatFeed() {
  const feed = [
    ...sampleThreatActors.map((a) => ({ source: "Threat actor", title: a.name, meta: a.origin, tone: "high" as const })),
    ...sampleMalware.map((m) => ({ source: "Malware", title: m.family, meta: m.campaign, tone: "medium" as const }))
  ];
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Threat Intelligence Feed</CardTitle>
          <CardSubtitle>Public, sample data only</CardSubtitle>
        </div>
        <Badge tone="critical">DEFENSIVE</Badge>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-white/5">
          {feed.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <div>
                <div className="font-medium text-slate-100">{f.title}</div>
                <div className="text-xs text-slate-500">{f.source} · {f.meta}</div>
              </div>
              <Badge tone={f.tone}>{f.tone.toUpperCase()}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
