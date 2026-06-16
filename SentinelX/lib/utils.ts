import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatPct(n: number) {
  return `${n.toFixed(1)}%`;
}

export function severityColor(sev: "low" | "medium" | "high" | "critical") {
  return {
    low: "text-threat-low bg-threat-low/10 border-threat-low/40",
    medium: "text-threat-medium bg-threat-medium/10 border-threat-medium/40",
    high: "text-threat-high bg-threat-high/10 border-threat-high/40",
    critical: "text-threat-critical bg-threat-critical/10 border-threat-critical/40"
  }[sev];
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function safeRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
