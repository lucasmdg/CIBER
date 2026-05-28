"use client";

import { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const stages = ["Initializing environment...", "Loading subsystems...", "Establishing connection..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => document.getElementById("loading")?.remove(), 300);
          return 100;
        }
        return prev + 2;
      });

      const newStage = Math.floor((progress / 100) * 3);
      if (newStage !== stage && newStage < 3) setStage(newStage);
    }, 20);

    return () => clearInterval(interval);
  }, [progress, stage]);

  return (
    <div
      id="loading"
      className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center gap-8"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 border border-signal-cyan/10 rounded-full animate-spin" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-4 border-t border-signal-cyan/40 rounded-full animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
        <div className="absolute inset-8 border-b border-signal-cyan/60 rounded-full animate-spin" style={{ animationDuration: "1s" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-signal-cyan text-xs terminal tracking-wider">
            {progress}%
          </span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-signal-cyan/70 text-xs terminal tracking-widest uppercase">
          {stages[Math.min(stage, stages.length - 1)]}
        </p>
        <div className="w-48 h-0.5 bg-bg-elevated rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-signal-cyan to-signal-green rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.1) 2px, rgba(0,212,255,0.1) 4px)",
        }}
      />
    </div>
  );
};

export default LoadingScreen;
