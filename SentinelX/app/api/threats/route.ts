import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [actors, malware] = await Promise.all([
    prisma.threatActor.findMany(),
    prisma.malware.findMany()
  ]);
  return NextResponse.json({ actors, malware });
}
