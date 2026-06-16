import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["00", "04", "08", "12", "16", "20"];

function heatColor(v: number) {
  if (v < 0.2) return "bg-cyber-500/10";
  if (v < 0.4) return "bg-cyber-500/20";
  if (v < 0.6) return "bg-warning/30";
  if (v < 0.8) return "bg-warning/60";
  return "bg-danger/80";
}

export function RiskHeatmap() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Risk Heatmap</CardTitle>
          <CardSubtitle>Aggregated detection volume by weekday × time-of-day</CardSubtitle>
        </div>
        <Badge tone="warn">LIVE</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] gap-1 text-[10px] text-slate-400">
          <div />
          {days.map((d) => (
            <div key={d} className="px-1 py-1 text-center">
              {d}
            </div>
          ))}
          {hours.map((h) => (
            <Row key={h} hour={h} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ hour }: { hour: string }) {
  // deterministic synthetic data
  const cells = days.map((_, i) => {
    const seed = (hour.charCodeAt(0) + i * 13) % 100;
    return Math.min(1, (seed % 100) / 100 + 0.05);
  });
  return (
    <>
      <div className="px-2 py-2 text-right text-slate-400">{hour}:00</div>
      {cells.map((v, i) => (
        <div
          key={i}
          className={`h-6 rounded ${heatColor(v)}`}
          title={`Intensity ${(v * 100).toFixed(0)}%`}
        />
      ))}
    </>
  );
}
