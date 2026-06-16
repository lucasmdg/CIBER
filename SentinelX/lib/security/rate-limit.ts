import type { NextRequest } from "next/server";

const buckets = new Map<string, { count: number; reset: number }>();

export function clientKey(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

export function rateLimit(req: NextRequest, limit = 60, windowMs = 60_000) {
  const key = clientKey(req);
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }
  if (b.count >= limit) return { ok: false, remaining: 0, reset: b.reset };
  b.count += 1;
  return { ok: true, remaining: limit - b.count, reset: b.reset };
}
