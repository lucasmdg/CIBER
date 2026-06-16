import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const paths = await prisma.attackPath.findMany();
  return NextResponse.json({
    paths: paths.map((p) => ({ ...p, steps: JSON.parse(p.steps) }))
  });
}
