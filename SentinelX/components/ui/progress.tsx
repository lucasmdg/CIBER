import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({ value, tone = "cyber", className }: { value: number; tone?: "cyber" | "success" | "warning" | "danger"; className?: string }) {
  const toneMap: Record<string, string> = {
    cyber: "from-cyber-500 to-cyber-300",
    success: "from-success to-emerald-300",
    warning: "from-warning to-amber-300",
    danger: "from-danger to-rose-300"
  };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/5", className)}>
      <div
        className={cn("h-full rounded-full bg-gradient-to-r", toneMap[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
