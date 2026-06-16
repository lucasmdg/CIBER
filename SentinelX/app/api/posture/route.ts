import { NextResponse } from "next/server";
import { z } from "zod";
import { postureScanRequestSchema } from "@/lib/security/validation";
import { audit } from "@/lib/audit/logger";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";

type Check = { name: string; status: "pass" | "warn" | "fail"; detail: string; evidence?: string };

async function safeFetch(url: string) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 4000);
  try {
    const r = await fetch(url, { signal: c.signal, redirect: "manual" });
    return { status: r.status, headers: Object.fromEntries(r.headers.entries()) };
  } finally {
    clearTimeout(t);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any;
  const body = await req.json().catch(() => null);
  const parsed = postureScanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "invalid" }, { status: 400 });
  }
  const target = parsed.data.target.replace(/\/$/, "");
  const results: Check[] = [];

  try {
    const res = await safeFetch(target);
    const headers = res.headers as Record<string, string>;
    results.push({
      name: "HTTPS enforced",
      status: target.startsWith("https") ? "pass" : "warn",
      detail: target.startsWith("https")
        ? "Connection is encrypted end-to-end."
        : "Plain HTTP accepted. In production enable HSTS and redirect to HTTPS."
    });
    results.push({
      name: "Content-Security-Policy header",
      status: headers["content-security-policy"] ? "pass" : "fail",
      detail: headers["content-security-policy"] ? "CSP header present." : "Missing CSP header."
    });
    results.push({
      name: "X-Frame-Options / clickjacking",
      status: headers["x-frame-options"] || headers["content-security-policy"]?.includes("frame-ancestors") ? "pass" : "warn",
      detail: "Defines whether the page can be framed by other origins."
    });
    results.push({
      name: "Referrer-Policy",
      status: headers["referrer-policy"] ? "pass" : "warn",
      detail: headers["referrer-policy"] ? "Header present." : "Add strict-origin-when-cross-origin."
    });
    results.push({
      name: "HSTS",
      status: headers["strict-transport-security"] ? "pass" : "warn",
      detail: headers["strict-transport-security"] ? "Strict-Transport-Security active." : "Configure HSTS in production."
    });
  } catch (e) {
    results.push({
      name: "Target reachability",
      status: "fail",
      detail: `Could not reach ${target}: ${(e as Error).message}`
    });
  }

  await audit({
    actor: session?.user?.email ?? "anonymous",
    action: "posture.scan",
    target,
    meta: { checks: results.length, fails: results.filter((r) => r.status === "fail").length }
  });

  return NextResponse.json({ target, results });
}
