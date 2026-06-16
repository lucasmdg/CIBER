import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <table className={cn("w-full text-left text-sm", className)} {...props} />
    </div>
  );
}
export const Thead = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <thead {...p} />;
export const Tbody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p} />;
export const Tr = (p: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="border-b border-white/5 transition hover:bg-white/[0.03]" {...p} />
);
export const Th = ({ className, ...p }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn("px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400", className)} {...p} />
);
export const Td = ({ className, ...p }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-3 py-2 text-sm text-slate-200", className)} {...p} />
);
