// app/api/usage/route.ts
// GET → agregados de uso por día, backend y modelo

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { estimateCloudCost } from "@/lib/usage/tracker";

export async function GET() {
  try {
    const events = await (prisma as any).usageEvent.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Totales globales
    const totalTokensIn = events.reduce((s: number, e: any) => s + e.tokensIn, 0);
    const totalTokensOut = events.reduce((s: number, e: any) => s + e.tokensOut, 0);
    const totalTokens = totalTokensIn + totalTokensOut;
    const totalDurationMs = events.reduce((s: number, e: any) => s + e.durationMs, 0);
    const cloudCostEur = estimateCloudCost(totalTokens);

    // Agrupar por día
    const byDay: Record<string, { date: string; tokens: number; requests: number }> = {};
    for (const e of events) {
      const day = new Date(e.createdAt).toISOString().slice(0, 10);
      if (!byDay[day]) byDay[day] = { date: day, tokens: 0, requests: 0 };
      byDay[day].tokens += e.tokensIn + e.tokensOut;
      byDay[day].requests += 1;
    }

    // Agrupar por backend
    const byBackend: Record<string, { tokens: number; requests: number }> = {};
    for (const e of events) {
      if (!byBackend[e.backend]) byBackend[e.backend] = { tokens: 0, requests: 0 };
      byBackend[e.backend].tokens += e.tokensIn + e.tokensOut;
      byBackend[e.backend].requests += 1;
    }

    return NextResponse.json({
      summary: {
        totalRequests: events.length,
        totalTokens,
        totalDurationMs,
        cloudCostEur: parseFloat(cloudCostEur.toFixed(4)),
        savedEur: parseFloat(cloudCostEur.toFixed(4)), // igual a cloudCostEur porque local = 0€
      },
      byDay: Object.values(byDay),
      byBackend,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
