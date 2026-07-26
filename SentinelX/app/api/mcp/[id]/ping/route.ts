// app/api/mcp/[id]/ping/route.ts
// POST → refresca el estado y herramientas de un servidor MCP

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { pingMcp } from "@/lib/mcp/client";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const server = await (prisma as any).mcpServer.findUnique({ where: { id: params.id } });
  if (!server) return NextResponse.json({ error: "MCP no encontrado" }, { status: 404 });

  const ping = await pingMcp(server.url);

  await (prisma as any).mcpServer.update({
    where: { id: params.id },
    data: {
      lastPing: new Date().toISOString(),
      lastPingStatus: ping.ok ? "ok" : "error",
      tools: JSON.stringify(ping.tools),
      active: ping.ok,
    },
  });

  return NextResponse.json(ping);
}
