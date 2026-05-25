"use client";

import { motion } from "framer-motion";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <motion.a
      href="#hero"
      className={`flex items-center gap-2 group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect x="0.5" y="0.5" width="27" height="27" rx="6" stroke="currentColor" strokeOpacity="0.15" />
        <path
          d="M7 20V8h3.5l3.5 7.5V8h3v12h-3.5L10 12.5V20H7z"
          fill="currentColor"
          fillOpacity="0.9"
        />
        <path
          d="M21 8v12h-3V8h3z"
          fill="url(#lm-gradient)"
          fillOpacity="0.9"
        />
        <defs>
          <linearGradient id="lm-gradient" x1="18" y1="8" x2="21" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#58A6FF" />
            <stop offset="1" stopColor="#79C0FF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[11px] font-mono tracking-[0.25em] text-muted group-hover:text-text transition-colors duration-300">
        LUCAS MÉNDEZ
      </span>
    </motion.a>
  );
}
