"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export type TrendPoint = { day: string; alerts: number; blocked: number; incidents: number };

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="alerts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1ad2ff" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#1ad2ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="blocked" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="incidents" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
        <YAxis stroke="#94a3b8" fontSize={11} />
        <Tooltip
          contentStyle={{
            background: "rgba(10,15,28,0.9)",
            border: "1px solid rgba(0,180,230,0.4)",
            borderRadius: 8,
            color: "#e2e8f0"
          }}
        />
        <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
        <Area type="monotone" dataKey="alerts" stroke="#1ad2ff" fill="url(#alerts)" strokeWidth={2} />
        <Area type="monotone" dataKey="blocked" stroke="#10b981" fill="url(#blocked)" strokeWidth={2} />
        <Area type="monotone" dataKey="incidents" stroke="#ef4444" fill="url(#incidents)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
