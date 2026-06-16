import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const vulnerabilities = await prisma.vulnerability.findMany({
    orderBy: { cvss: "desc" },
    include: { affected: { include: { asset: { select: { name: true } } } } }
  });
  return NextResponse.json({ vulnerabilities });
}
