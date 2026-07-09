"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Clock } from "lucide-react";

type ScanRecord = {
  timestamp: string;
  score: number;
  passes: number;
  warns: number;
  fails: number;
  label: string;
};

// Generamos historial mock simulado consistente. En producción,
// esto vendría de /api/posture/history que devolvería PostureCheck agrupados por sesión.
function buildMockHistory(): ScanRecord[] {
  const base = [78, 65, 82, 71, 90, 84, 77];
  return base.map((score, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const passes = Math.round((score / 100) * 6);
    const fails = 6 - passes;
    return {
      timestamp: d.toISOString(),
      score,
      passes,
      warns: 1,
      fails: Math.max(0, fails - 1),
      label: d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" }),
    };
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload as ScanRecord;
    return (
      <div className="rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 shadow-xl text-xs font-mono">
        <p className="text-cyber-300 font-semibold mb-1">{label}</p>
        <p className="text-white">Score: <span className="text-cyber-400 font-bold">{d.score}/100</span></p>
        <p className="text-success">PASS: {d.passes}</p>
        <p className="text-warning">WARN: {d.warns}</p>
        <p className="text-danger">FAIL: {d.fails}</p>
      </div>
    );
  }
  return null;
};

export function PostureTrendChart() {
  const [data] = useState<ScanRecord[]>(buildMockHistory);
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const delta = last.score - prev.score;

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyber-300 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            Score Trend (7 days)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Historical posture score per scan session</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{last.score}</div>
          <div className={`text-xs font-mono ${delta >= 0 ? "text-success" : "text-danger"}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} vs prev scan
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#00d4ff"
            strokeWidth={2}
            dot={{ fill: "#00d4ff", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#00d4ff", stroke: "#ffffff30" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
