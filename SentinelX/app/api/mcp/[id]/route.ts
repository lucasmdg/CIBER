// app/api/mcp/[id]/route.ts
// PATCH  → activar/desactivar servidor MCP
// DELETE → eliminar servidor MCP

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { active } = await req.json() as { active: boolean };
  const server = await (prisma as any).mcpServer.update({
    where: { id: params.id },
    data: { active },
  });
  return NextResponse.json({ ...server, tools: server.tools ? JSON.parse(server.tools) : [] });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await (prisma as any).mcpServer.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}
