"use client";

import { useEffect, useState } from "react";

export default function HUDOverlay() {
  const [time, setTime] = useState("");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", { hour12: false }) +
          "." +
          String(now.getMilliseconds()).padStart(3, "0")
      );
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none font-mono" style={{ fontSize: "10px" }}>
      {/* Top-left: System ID */}
      <div className="absolute top-4 left-5 flex items-center gap-3">
        <div className="status-dot status-dot-online" />
        <span className="text-green tracking-widest uppercase opacity-60">
          LUCAS_SYS v2.0
        </span>
      </div>

      {/* Top-right: Clock + Uptime */}
      <div className="absolute top-4 right-5 text-right">
        <div className="text-cyan opacity-50 tracking-wider">{time || "00:00:00.000"}</div>
        <div className="text-dim tracking-wider mt-0.5">
          UPTIME {formatUptime(uptime)}
        </div>
      </div>

      {/* Bottom-left: System status */}
      <div className="absolute bottom-4 left-5 flex items-center gap-4">
        <span className="text-dim tracking-wider">PORT 443</span>
        <span className="text-dim">|</span>
        <span className="text-green opacity-50 tracking-wider">STATUS 200</span>
        <span className="text-dim">|</span>
        <span className="text-dim tracking-wider">TLS 1.3</span>
      </div>

      {/* Bottom-right: Protocol */}
      <div className="absolute bottom-4 right-5 text-right">
        <span className="text-dim tracking-wider">TCP/IP ACTIVE</span>
      </div>

      {/* Corner brackets — top left */}
      <svg className="absolute top-2 left-2 opacity-10" width="20" height="20" viewBox="0 0 20 20">
        <path d="M0 8V0h8" fill="none" stroke="#00f0ff" strokeWidth="1" />
      </svg>
      {/* Corner brackets — top right */}
      <svg className="absolute top-2 right-2 opacity-10" width="20" height="20" viewBox="0 0 20 20">
        <path d="M20 8V0h-8" fill="none" stroke="#00f0ff" strokeWidth="1" />
      </svg>
      {/* Corner brackets — bottom left */}
      <svg className="absolute bottom-2 left-2 opacity-10" width="20" height="20" viewBox="0 0 20 20">
        <path d="M0 12v8h8" fill="none" stroke="#00f0ff" strokeWidth="1" />
      </svg>
      {/* Corner brackets — bottom right */}
      <svg className="absolute bottom-2 right-2 opacity-10" width="20" height="20" viewBox="0 0 20 20">
        <path d="M20 12v8h-8" fill="none" stroke="#00f0ff" strokeWidth="1" />
      </svg>

      {/* Vertical side signal lines */}
      <div className="absolute left-0 top-1/4 h-1/2 signal-line-vertical opacity-30" />
      <div className="absolute right-0 top-1/3 h-1/3 signal-line-vertical opacity-20" />
    </div>
  );
}
