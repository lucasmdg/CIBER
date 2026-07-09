import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Recoger últimos checks de postura de base de datos
  const checks = await prisma.postureCheck.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const timestamp = new Date().toISOString();
  const analyst = session?.user?.email ?? "anonymous";

  // Calcular score basado en los checks
  const passes = checks.filter((c) => c.status === "pass").length;
  const score =
    checks.length > 0 ? Math.round((passes / checks.length) * 100) : 0;

  const reportPayload = {
    meta: {
      generator: "SentinelX SOC Dashboard v2",
      timestamp,
      analyst,
      format_version: "2.0",
    },
    summary: {
      score,
      total_checks: checks.length,
      passed: passes,
      warned: checks.filter((c) => c.status === "warn").length,
      failed: checks.filter((c) => c.status === "fail").length,
    },
    findings: checks.map((c) => ({
      id: c.id,
      category: c.category,
      name: c.name,
      status: c.status,
      detail: c.detail,
      evidence: c.evidence,
      target: c.target,
      scanned_at: c.createdAt.toISOString(),
    })),
    compliance_refs: [
      "NIST CSF 2.0 — ID.AM, PR.IP",
      "CIS Controls v8 — Control 4 (Secure Configuration)",
      "ISO/IEC 27001:2022 — A.8.8",
    ],
    // Hash SHA-256 de integridad del reporte (sin el campo integrity en sí)
    integrity: "",
  };

  // Calcular hash SHA-256 sobre el cuerpo del reporte (excluyendo el campo integrity)
  const payloadForHash = { ...reportPayload, integrity: undefined };
  const hash = createHash("sha256")
    .update(JSON.stringify(payloadForHash))
    .digest("hex");

  reportPayload.integrity = `sha256:${hash}`;

  const jsonBody = JSON.stringify(reportPayload, null, 2);

  return new NextResponse(jsonBody, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="sentinelx-posture-${Date.now()}.json"`,
      "X-Report-Integrity": `sha256:${hash}`,
      "Cache-Control": "no-store",
    },
  });
}
