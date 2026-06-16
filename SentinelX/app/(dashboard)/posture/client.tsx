"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Result = { name: string; status: "pass" | "warn" | "fail"; detail: string; evidence?: string };

export function PostureClient() {
  const [target, setTarget] = useState("http://localhost:3000");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    setRunning(true);
    try {
      const r = await fetch("/api/posture", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ target })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "scan failed");
      setResults(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "scan failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-2">
        <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="http://localhost:3000" />
        <Button onClick={run} disabled={running}>{running ? "Scanning..." : "Run"}</Button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {results.length > 0 && (
        <ul className="space-y-1 text-xs text-slate-300">
          {results.map((r) => (
            <li key={r.name} className="flex items-center justify-between rounded border border-white/5 bg-white/[0.02] px-2 py-1">
              <span>{r.name}</span>
              <span className={r.status === "pass" ? "text-success" : r.status === "warn" ? "text-warning" : "text-danger"}>
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[11px] text-slate-500">Only loopback or RFC1918 targets accepted.</p>
    </div>
  );
}
