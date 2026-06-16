import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { can, type Role } from "@/lib/rbac/roles";

export async function GET() {
  const session = await getServerSession(authOptions) as any;
  const role = (session?.user as { role?: Role } | undefined)?.role;
  if (!can(role, "audit:read")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const events = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ events });
}
