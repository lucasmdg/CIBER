"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Toast = { id: number; title: string; description?: string; tone?: "info" | "success" | "warn" | "danger" };
type Ctx = { push: (t: Omit<Toast, "id">) => void };
const C = React.createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Toast[]>([]);
  const push = React.useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 4500);
  }, []);
  return (
    <C.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-lg border p-3 text-sm shadow-glass backdrop-blur",
              t.tone === "danger" && "border-danger/50 bg-danger/10 text-danger",
              t.tone === "warn" && "border-warning/50 bg-warning/10 text-warning",
              t.tone === "success" && "border-success/50 bg-success/10 text-success",
              (!t.tone || t.tone === "info") && "border-cyber-500/50 bg-cyber-500/10 text-cyber-100"
            )}
          >
            <div className="font-semibold">{t.title}</div>
            {t.description && <div className="text-xs opacity-80">{t.description}</div>}
          </div>
        ))}
      </div>
    </C.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(C);
  if (!ctx) return { push: () => {} } as Ctx;
  return ctx;
}
