import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="grid-bg relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center text-center">
        <div className="glass mx-auto max-w-3xl p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyber-500/20 text-cyber-200 shadow-neon">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
            <span className="text-gradient">SentinelX</span>
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.32em] text-cyber-300">
            Cyber Security Operations Dashboard
          </p>
          <p className="mt-6 text-slate-300">
            A defensive, educational SOC console: asset inventory, vulnerability management, threat
            intelligence, attack-path visualisation, incident timeline, posture scanner and reports.
            Built for blue teams, DevSecOps engineers and security recruiters.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md bg-cyber-500/90 px-5 py-2.5 text-sm font-medium text-white shadow-neon hover:bg-cyber-400"
            >
              Enter the SOC <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-100 hover:bg-white/10"
            >
              View live demo
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Demo only. All telemetry is synthetic. No real scanning, no exploit code, no offensive tooling.
          </p>
        </div>
      </div>
    </main>
  );
}
