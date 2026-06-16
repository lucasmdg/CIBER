import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security/rate-limit";
import { assetCreateSchema } from "@/lib/security/validation";
import { audit } from "@/lib/audit/logger";
import { can, type Role } from "@/lib/rbac/roles";

export async function GET() {
  const rl = rateLimit({ headers: new Headers(), ip: null } as unknown as import("next/server").NextRequest);
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const assets = await prisma.asset.findMany({ orderBy: { riskScore: "desc" } });
  return NextResponse.json({ assets });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any;
  const role = (session?.user as { role?: Role } | undefined)?.role;
  if (!can(role, "assets:write")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = assetCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "invalid" }, { status: 400 });
  }
  const created = await prisma.asset.create({ data: parsed.data });
  await audit({
    actor: session?.user?.email ?? "anonymous",
    action: "asset.create",
    target: created.id,
    meta: { name: created.name }
  });
  return NextResponse.json({ asset: created }, { status: 201 });
}
