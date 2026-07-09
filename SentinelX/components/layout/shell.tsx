"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Activity,
  Boxes,
  Bug,
  Crosshair,
  Radar,
  GitBranch,
  AlarmClock,
  FileBarChart,
  LogOut,
  Globe,
  UploadCloud,
  Cpu,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/toast";
import { Progress } from "@/components/ui/progress";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Activity },
  { href: "/assets", label: "Assets", icon: Boxes },
  { href: "/vulnerabilities", label: "Vulnerabilities", icon: Bug },
  { href: "/threats", label: "Threat Intel", icon: Crosshair },
  { href: "/posture", label: "Posture Scanner", icon: Radar },
  { href: "/network", label: "Network Monitor", icon: Globe },
  { href: "/analyze", label: "File Analyzer", icon: UploadCloud },
  { href: "/attack-paths", label: "Attack Paths", icon: GitBranch },
  { href: "/incidents", label: "Incidents", icon: AlarmClock },
  { href: "/reports", label: "Reports", icon: FileBarChart }
];

// Navigation subcomponent memoized to prevent re-renders when CPU/RAM telemetry updates
const Navigation = React.memo(({ pathname }: { pathname: string }) => {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((n) => {
        const Icon = n.icon;
        const active = pathname === n.href || (n.href !== "/dashboard" && pathname?.startsWith(n.href));
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "group flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative overflow-hidden border border-transparent hover:border-cyber-500/20",
              active
                ? "bg-cyber-500/10 text-cyber-300 border-cyber-500/20 shadow-neon-cyan"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-cyber-300" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
});
Navigation.displayName = "Navigation";

export function Shell({ children, user }: { children: React.ReactNode; user?: { name?: string | null; role?: string } }) {
  const pathname = usePathname();
  const [telemetry, setTelemetry] = React.useState<{ cpu: number; mem: number } | null>(null);

  React.useEffect(() => {
    async function fetchTelemetry() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const data = await res.json();
          if (data.cpu !== undefined && data.mem !== undefined) {
            setTelemetry({ cpu: data.cpu, mem: data.mem });
          }
        }
      } catch (err) {
        console.error("Telemetry fetch error:", err);
      }
    }
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000); // Polling cada 5s
    return () => clearInterval(interval);
  }, []);

  const systemStatus = React.useMemo(() => {
    if (!telemetry) return { label: "SCANNING", color: "text-cyber-400 border-cyber-500/30 bg-cyber-500/5" };
    if (telemetry.cpu > 85 || telemetry.mem > 90) {
      return { label: "CRITICAL", color: "text-danger border-danger/30 bg-danger/5 animate-pulse shadow-neon-red" };
    }
    if (telemetry.cpu > 65 || telemetry.mem > 75) {
      return { label: "WARNING", color: "text-warning border-warning/30 bg-warning/5 shadow-neon-yellow" };
    }
    return { label: "SECURE", color: "text-success border-success/30 bg-success/5 shadow-neon-green" };
  }, [telemetry]);

  return (
    <ToastProvider>
      <div className="grid-bg min-h-screen">
        <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-cyber-200">
              <Shield className="h-5 w-5 text-cyber-300 animate-pulseGlow" />
              <span className="font-semibold tracking-[0.32em] text-gradient">SENTINELX</span>
            </Link>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="hidden sm:inline font-mono text-[10px] tracking-wider text-slate-500">SOC-1 · {new Date().toLocaleDateString()}</span>
              <span className={cn("rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase transition-all duration-300", systemStatus.color)}>
                {systemStatus.label}
              </span>
              {user && <span className="hidden md:inline font-mono text-slate-300 text-[10px]">{user.name} · {user.role}</span>}
              <form action="/api/auth/signout" method="post">
                <button className="rounded border border-white/10 px-2 py-1 text-slate-300 hover:text-white transition hover:bg-white/5" aria-label="Sign out">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="container grid grid-cols-1 gap-6 py-6 lg:grid-cols-[240px_1fr]">
          <aside className="glass sticky top-20 h-fit p-3 flex flex-col gap-6 animate-telemetry-pulse">
            <Navigation pathname={pathname || ""} />

            {/* Sidebar Live hardware telemetry footer */}
            <div className="border-t border-white/5 pt-4 mt-auto font-mono text-[10px] space-y-3">
              <div className="text-slate-500 uppercase tracking-widest text-[9px] font-bold">Telemetría Host</div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1"><Cpu className="h-3 w-3 text-cyber-400" /> CPU</span>
                  <span>{telemetry ? `${telemetry.cpu}%` : "--"}</span>
                </div>
                <Progress value={telemetry?.cpu ?? 0} className="h-1 bg-white/5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1"><HardDrive className="h-3 w-3 text-cyber-400" /> RAM</span>
                  <span>{telemetry ? `${telemetry.mem}%` : "--"}</span>
                </div>
                <Progress value={telemetry?.mem ?? 0} className="h-1 bg-white/5" />
              </div>
            </div>
          </aside>
          <main className="flex min-w-0 flex-col gap-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
