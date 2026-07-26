import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PageHeader({
  title,
  description,
  actions,
  badge
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: { text: string; tone?: "ok" | "warn" | "fail" | "default" };
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between")}>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          {badge && (
            <Badge tone={badge.tone ?? "default"} className="mt-1">
              {badge.text}
            </Badge>
          )}
        </div>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
