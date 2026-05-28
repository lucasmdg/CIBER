"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ── Floating Gateway Core Animation (CSS-based) ── */
function GatewayCore() {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto">
      {/* Outer ring — slow orbit */}
      <div
        className="absolute inset-0 rounded-full border border-cyan/10"
        style={{ animation: "spin 30s linear infinite" }}
      />
      {/* Mid ring — counter-rotate */}
      <div
        className="absolute inset-4 rounded-full border border-cyan/8"
        style={{ animation: "spin 20s linear infinite reverse" }}
      />
      {/* Inner ring — orbit */}
      <div
        className="absolute inset-8 rounded-full border border-cyan/15"
        style={{ animation: "spin 15s linear infinite" }}
      />

      {/* Pulsing core glow */}
      <div className="absolute inset-12 rounded-full" style={{
        background: "radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%)",
        animation: "glow-breathe 4s ease-in-out infinite",
      }} />

      {/* Center node */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Diamond shape */}
          <div className="w-3 h-3 rotate-45 bg-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            style={{ animation: "data-pulse 3s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* Orbital signal dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div key={i} className="absolute inset-0 flex items-center justify-center" style={{
          transform: `rotate(${deg}deg)`,
          animation: `spin ${25 + i * 3}s linear infinite${i % 2 ? " reverse" : ""}`,
        }}>
          <div className="absolute" style={{
            top: i % 2 === 0 ? "8%" : "5%",
            left: "50%",
            transform: "translateX(-50%)",
          }}>
            <div className={`w-1 h-1 rounded-full ${i < 4 ? "bg-cyan/40" : i < 5 ? "bg-green/40" : "bg-amber/40"}`}
              style={{ boxShadow: `0 0 4px ${i < 4 ? "rgba(0,240,255,0.3)" : i < 5 ? "rgba(0,255,136,0.3)" : "rgba(255,170,0,0.3)"}` }}
            />
          </div>
        </div>
      ))}

      {/* Connecting fiber lines (CSS) */}
      {[45, 135, 225, 315].map((deg, i) => (
        <div key={`line-${i}`} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${deg}deg)` }}>
          <div className="absolute w-px bg-gradient-to-b from-transparent via-cyan/10 to-transparent"
            style={{ height: "40%", top: "5%" }}
          />
        </div>
      ))}
    </div>
  );
}

/* ── Hero Terminal Message ── */
function HeroTerminal() {
  const [typed, setTyped] = useState("");
  const message = "still learning — telecommunications & systems";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= message.length) {
        setTyped(message.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sys-panel-active rounded-lg px-5 py-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <div className="status-dot status-dot-active" />
        <span className="text-cyan/60 text-[10px] tracking-widest uppercase">
          SYSTEM.CORE.TERMINAL
        </span>
      </div>
      <div className="font-mono text-sm text-cyan leading-relaxed">
        <span className="text-green/60">lucas@sys</span>
        <span className="text-dim">:</span>
        <span className="text-cyan/60">~</span>
        <span className="text-dim">$ </span>
        <span className="text-text/90">{typed}</span>
        <span className="terminal-cursor ml-0.5" />
      </div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Ghost watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="ghost-text font-sans font-black text-[20vw] leading-none tracking-tighter whitespace-nowrap">
          LUCAS
        </span>
      </div>

      {/* Gateway Core */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative z-10 mb-8"
      >
        <GatewayCore />
      </motion.div>

      {/* Terminal message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <HeroTerminal />
      </motion.div>

      {/* Subsystem tags */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="relative z-10 mt-8 flex flex-wrap justify-center gap-3 max-w-2xl"
      >
        {[
          { label: "FIBER OPTICS", color: "cyan" },
          { label: "TCP/IP", color: "cyan" },
          { label: "CYBERSECURITY", color: "green" },
          { label: "PYTHON", color: "amber" },
          { label: "GPON", color: "cyan" },
          { label: "NETWORKING", color: "green" },
          { label: "LINUX", color: "amber" },
          { label: "C / C++", color: "cyan" },
        ].map(({ label, color }) => (
          <span
            key={label}
            className={`px-3 py-1 text-[10px] tracking-widest font-mono border rounded-sm
              ${color === "cyan" ? "text-cyan/50 border-cyan/10 bg-cyan-dim" :
                color === "green" ? "text-green/50 border-green/10 bg-green-dim" :
                "text-amber/50 border-amber/10 bg-amber-dim"
              }`}
          >
            {label}
          </span>
        ))}
      </motion.div>

      {/* Social links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="relative z-10 mt-8 flex items-center gap-6"
      >
        <a
          href="https://github.com/lucasmdg/CIBER"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] tracking-widest text-dim hover:text-cyan transition-colors duration-300"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          GITHUB
        </a>
        <span className="text-dim/30">|</span>
        <a
          href="https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] tracking-widest text-dim hover:text-cyan transition-colors duration-300"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LINKEDIN
        </a>
        <span className="text-dim/30">|</span>
        <a
          href="/CIBER/cv-lucas-mendez.pdf"
          className="flex items-center gap-2 text-[10px] tracking-widest text-dim hover:text-amber transition-colors duration-300"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          DOWNLOAD CV
        </a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] text-dim/40 uppercase">
          scroll to explore
        </span>
        <div className="w-px h-10 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          <motion.div
            className="w-full h-1/3"
            style={{ background: "linear-gradient(to bottom, #00f0ff, transparent)" }}
            animate={{ y: ["-100%", "300%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
