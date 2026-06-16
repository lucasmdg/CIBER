import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function Kpi({
  label,
  value,
  hint,
  tone = "cyber",
  icon
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "cyber" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyber-500/10 blur-3xl" />
      <CardHeader>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
          {icon}
          {label}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold text-white">{value}</div>
        {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
        <div className="mt-3">
          <Progress value={typeof value === "number" ? value : 0} tone={tone} />
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4")}>{children}</div>;
}
