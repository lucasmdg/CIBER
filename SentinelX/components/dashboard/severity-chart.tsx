"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22d3ee", "#facc15", "#fb923c", "#ef4444"];

export function SeverityChart({
  data
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip
          contentStyle={{
            background: "rgba(10,15,28,0.9)",
            border: "1px solid rgba(0,180,230,0.4)",
            borderRadius: 8,
            color: "#e2e8f0"
          }}
        />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(0,0,0,0.4)" />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
