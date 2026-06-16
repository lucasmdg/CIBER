import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security/rate-limit";
import { audit } from "@/lib/audit/logger";
import type { NextRequest } from "next/server";

const body = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(128),
  name: z.string().min(2).max(80)
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const json = await req.json().catch(() => null);
  const parsed = body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "invalid" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: "user_exists" }, { status: 409 });
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: { email: parsed.data.email, name: parsed.data.name, passwordHash, role: "analyst" }
  });
  await audit({ actor: user.email, action: "user.register", target: user.id });
  return NextResponse.json({ id: user.id }, { status: 201 });
}
