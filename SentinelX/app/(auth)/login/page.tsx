"use client";
import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = React.useState("analyst@sentinelx.local");
  const [password, setPassword] = React.useState("SentinelX-Demo-2026");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    setLoading(false);
    if (res?.error) setError("Invalid credentials");
    else router.push(callbackUrl);
  }

  return (
    <main className="grid-bg relative min-h-screen">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <form
          onSubmit={onSubmit}
          className="glass w-full max-w-md p-8"
          aria-label="SentinelX sign in"
        >
          <div className="flex items-center gap-3 text-cyber-200">
            <Shield className="h-5 w-5" />
            <span className="font-semibold tracking-[0.32em]">SENTINELX</span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">Sign in to the SOC</h1>
          <p className="mt-1 text-sm text-slate-400">
            Demo credentials are pre-filled. Replace with NextAuth-backed IdP for production.
          </p>
          <div className="mt-6 space-y-3">
            <label className="block text-xs uppercase tracking-wide text-slate-400">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 focus:border-cyber-400/60 focus:outline-none"
              />
            </label>
            <label className="block text-xs uppercase tracking-wide text-slate-400">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 focus:border-cyber-400/60 focus:outline-none"
              />
            </label>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-cyber-500/90 px-4 text-sm font-medium text-white shadow-neon hover:bg-cyber-400 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign in"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            This dashboard is for defensive and educational use only. See SECURITY.md.
          </p>
        </form>
      </div>
    </main>
  );
}
