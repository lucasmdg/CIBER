import * as React from "react";
import { cn, severityColor } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "default"
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "low" | "medium" | "high" | "critical" | "ok" | "warn" | "fail";
}) {
  const map: Record<string, string> = {
    default: "bg-white/5 text-slate-200 border border-white/10",
    low: severityColor("low"),
    medium: severityColor("medium"),
    high: severityColor("high"),
    critical: severityColor("critical"),
    ok: "bg-success/10 text-success border border-success/40",
    warn: "bg-warning/10 text-warning border border-warning/40",
    fail: "bg-danger/10 text-danger border border-danger/40"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        map[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
