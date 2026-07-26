// app/api/llamacpp/status/route.ts

import { NextResponse } from "next/server";
import { getStatus } from "@/lib/llamacpp/process-manager";

export async function GET() {
  const status = getStatus();
  return NextResponse.json(status);
}
