// app/api/mcp/route.ts
// GET  → lista todos los servidores MCP registrados
// POST → registra un nuevo servidor MCP

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { pingMcp } from "@/lib/mcp/client";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional().default(""),
});

export async function GET() {
  const servers = await (prisma as any).mcpServer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(
    servers.map((s: any) => ({
      ...s,
      tools: s.tools ? JSON.parse(s.tools) : [],
    }))
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, url, description } = parsed.data;

  // Hacer un ping inicial para descubrir herramientas
  const ping = await pingMcp(url);

  const server = await (prisma as any).mcpServer.create({
    data: {
      name,
      url,
      description,
      active: ping.ok,
      lastPing: new Date().toISOString(),
      lastPingStatus: ping.ok ? "ok" : "error",
      tools: JSON.stringify(ping.tools),
    },
  });

  return NextResponse.json({ ...server, tools: ping.tools }, { status: 201 });
}
