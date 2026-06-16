import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const incidents = await prisma.incident.findMany({ include: { events: { orderBy: { ts: "asc" } } } });
  return NextResponse.json({ incidents });
}
