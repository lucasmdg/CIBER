import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit/logger";
import { can, type Role } from "@/lib/rbac/roles";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions) as any;
  const role = (session?.user as { role?: Role } | undefined)?.role;
  if (!can(role, "assets:write")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await prisma.asset.delete({ where: { id: params.id } });
  await audit({ actor: session?.user?.email ?? "anonymous", action: "asset.delete", target: params.id });
  return NextResponse.json({ ok: true });
}
