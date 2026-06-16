import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleAssets } from "@/lib/data/samples";

export function AssetSummary() {
  const counts = sampleAssets.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Asset Inventory</CardTitle>
          <CardSubtitle>{sampleAssets.length} monitored assets</CardSubtitle>
        </div>
        <Badge tone="ok">SYNCED</Badge>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {top.map(([type, n]) => (
            <li key={type} className="flex items-center justify-between">
              <span className="capitalize text-slate-200">{type}</span>
              <span className="text-cyber-200">{n}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
