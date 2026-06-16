"use client";
import * as React from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import "reactflow/dist/style.css";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleAttackPaths } from "@/lib/data/samples";

const colorFor: Record<string, string> = {
  entry: "#1ad2ff",
  execution: "#facc15",
  lateral: "#fb923c",
  "priv-esc": "#ef4444",
  target: "#10b981"
};

function buildGraph(steps: { id: string; label: string; type: string }[]) {
  const nodes = steps.map((s, i) => ({
    id: s.id,
    position: { x: 80 + i * 220, y: 120 },
    data: { label: `${s.label} (${s.type})` },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
      background: "rgba(10,15,28,0.85)",
      border: `1px solid ${colorFor[s.type] ?? "#1ad2ff"}`,
      color: "#e2e8f0",
      borderRadius: 10,
      padding: 10,
      width: 180,
      fontSize: 12
    }
  }));
  const edges = steps.slice(0, -1).map((s, i) => {
    const next = steps[i + 1];
    return {
      id: `e${s.id}-${next?.id ?? ""}`,
      source: s.id,
      target: next?.id ?? "",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#1ad2ff" },
      style: { stroke: "#1ad2ff" },
      animated: true
    };
  });
  return { nodes, edges };
}

export default function AttackPathsPage() {
  const [active, setActive] = React.useState(0);
  const path = sampleAttackPaths[active];
  const { nodes, edges } = React.useMemo(() => buildGraph(path?.steps ?? []), [active]);

  return (
    <>
      <PageHeader
        title="Attack Path Visualization"
        description="Defensive, sample-only kill-chain graphs. Useful for tabletop exercises and detection coverage."
      />

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Scenarios</CardTitle>
              <CardSubtitle>Select to inspect</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sampleAttackPaths.map((p, i) => (
                <li key={p.name}>
                  <button
                    onClick={() => setActive(i)}
                    className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                      i === active
                        ? "border-cyber-500/60 bg-cyber-500/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.scenario}</div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300">
              {Object.entries(colorFor).map(([k, v]) => (
                <span key={k} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: v }} /> {k}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>{path?.name}</CardTitle>
              <CardSubtitle>{path?.scenario}</CardSubtitle>
            </div>
            <Badge tone="warn">EDUCATIONAL</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[460px] w-full rounded-lg border border-white/5 bg-black/30">
              <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
                <Background color="rgba(0,180,230,0.15)" gap={24} />
                <Controls />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
