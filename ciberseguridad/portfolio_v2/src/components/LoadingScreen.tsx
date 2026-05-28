"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "BIOS POST ... OK", delay: 100 },
  { text: "Initializing kernel modules", delay: 200 },
  { text: "Loading network stack ............ [OK]", delay: 350 },
  { text: "Mounting /dev/fiber0 ............. [OK]", delay: 500 },
  { text: "Starting firewall daemon ......... [OK]", delay: 650 },
  { text: "Configuring TCP/IP ............... [OK]", delay: 800 },
  { text: "Establishing TLS 1.3 tunnel ...... [OK]", delay: 1000 },
  { text: "Loading project registry ......... [OK]", delay: 1200 },
  { text: "Scanning ports ................... [OK]", delay: 1400 },
  { text: "IDS module active ................ [OK]", delay: 1600 },
  { text: "", delay: 1700 },
  { text: "╔═══════════════════════════════════════╗", delay: 1800 },
  { text: "║   LUCAS_SYS v2.0 — BOOT COMPLETE     ║", delay: 1900 },
  { text: "║   Telecommunications & Systems        ║", delay: 2000 },
  { text: "╚═══════════════════════════════════════╝", delay: 2100 },
  { text: "", delay: 2200 },
  { text: "Entering operations console...", delay: 2400 },
];

export default function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    
    BOOT_LINES.forEach((line, i) => {
      timeouts.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
        }, line.delay)
      );
    });

    // Start exit after last line
    timeouts.push(
      setTimeout(() => {
        setExiting(true);
      }, 2800)
    );

    timeouts.push(
      setTimeout(() => {
        onFinish();
      }, 3400)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-lg px-8">
            {/* Boot header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="status-dot status-dot-active" />
              <span className="text-[9px] tracking-widest text-cyan/40 uppercase font-mono">
                SYSTEM BOOT SEQUENCE
              </span>
            </div>

            <div className="signal-line mb-4" />

            {/* Boot lines */}
            <div className="font-mono text-xs space-y-0.5">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`${
                    line.text.includes("[OK]") ? "text-green/60" :
                    line.text.includes("═") || line.text.includes("║") ? "text-cyan/60" :
                    line.text === "" ? "" :
                    "text-text/50"
                  }`}
                >
                  {line.text || "\u00A0"}
                </motion.div>
              ))}
              {visibleLines < BOOT_LINES.length && (
                <span className="terminal-cursor" />
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-px bg-border overflow-hidden">
              <motion.div
                className="h-full bg-cyan/30"
                initial={{ width: "0%" }}
                animate={{ width: `${(visibleLines / BOOT_LINES.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-[9999] bg-bg"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </AnimatePresence>
  );
}
