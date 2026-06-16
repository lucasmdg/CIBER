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
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/toast";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Activity },
  { href: "/assets", label: "Assets", icon: Boxes },
  { href: "/vulnerabilities", label: "Vulnerabilities", icon: Bug },
  { href: "/threats", label: "Threat Intel", icon: Crosshair },
  { href: "/posture", label: "Posture", icon: Radar },
  { href: "/attack-paths", label: "Attack Paths", icon: GitBranch },
  { href: "/incidents", label: "Incidents", icon: AlarmClock },
  { href: "/reports", label: "Reports", icon: FileBarChart }
];

export function Shell({ children, user }: { children: React.ReactNode; user?: { name?: string | null; role?: string } }) {
  const pathname = usePathname();
  return (
    <ToastProvider>
      <div className="grid-bg min-h-screen">
        <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-cyber-200">
              <Shield className="h-5 w-5 text-cyber-300" />
              <span className="font-semibold tracking-[0.32em]">SENTINELX</span>
            </Link>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="hidden sm:inline">SOC-1 · {new Date().toLocaleDateString()}</span>
              <span className="rounded border border-success/40 bg-success/10 px-2 py-0.5 text-success">SECURE</span>
              {user && <span className="hidden md:inline">{user.name} · {user.role}</span>}
              <form action="/api/auth/signout" method="post">
                <button className="rounded border border-white/10 px-2 py-1 text-slate-300 hover:text-white" aria-label="Sign out">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="container grid grid-cols-1 gap-6 py-6 lg:grid-cols-[220px_1fr]">
          <aside className="glass-soft sticky top-20 h-fit p-3">
            <nav className="flex flex-col gap-1">
              {nav.map((n) => {
                const Icon = n.icon;
                const active = pathname?.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                      active
                        ? "bg-cyber-500/15 text-cyber-100 shadow-neon"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className="flex min-w-0 flex-col gap-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
