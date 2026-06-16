import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight in-memory token bucket. Sufficient for portfolio/demo.
const buckets = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 120;

function rateLimit(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "local";
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (b.count >= LIMIT) return false;
  b.count += 1;
  return true;
}

export default withAuth(
  function middleware(req) {
    if (!rateLimit(req)) {
      return new NextResponse("Too many requests", { status: 429 });
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token)
    },
    pages: { signIn: "/login" }
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/assets/:path*", "/vulnerabilities/:path*", "/threats/:path*", "/posture/:path*", "/attack-paths/:path*", "/incidents/:path*", "/reports/:path*", "/api/:path*"]
};
