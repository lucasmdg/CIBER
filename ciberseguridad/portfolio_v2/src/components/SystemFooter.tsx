"use client";

import { projectsData } from "@/data/projects";

export default function SystemFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-8 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        {/* Signal line */}
        <div className="signal-line w-full mb-6" />

        {/* Telemetry grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-[9px] font-mono tracking-wider">
          <div>
            <span className="text-dim/30 block mb-1">SYSTEM</span>
            <span className="text-green/50">LUCAS_SYS v2.0</span>
          </div>
          <div>
            <span className="text-dim/30 block mb-1">PROJECTS</span>
            <span className="text-cyan/50">{projectsData.length} LOADED</span>
          </div>
          <div>
            <span className="text-dim/30 block mb-1">STATUS</span>
            <div className="flex items-center gap-1.5">
              <div className="status-dot status-dot-online" style={{ width: 4, height: 4 }} />
              <span className="text-green/50">200 OK</span>
            </div>
          </div>
          <div>
            <span className="text-dim/30 block mb-1">PROTOCOL</span>
            <span className="text-cyan/50">HTTPS / TLS 1.3</span>
          </div>
        </div>

        {/* Links row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/lucasmdg/CIBER"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] tracking-widest text-dim/40 hover:text-cyan transition-colors"
            >
              GITHUB
            </a>
            <span className="text-dim/15">|</span>
            <a
              href="https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] tracking-widest text-dim/40 hover:text-cyan transition-colors"
            >
              LINKEDIN
            </a>
            <span className="text-dim/15">|</span>
            <a
              href="/CIBER/cv-lucas-mendez.pdf"
              className="text-[9px] tracking-widest text-dim/40 hover:text-amber transition-colors"
            >
              CV
            </a>
          </div>
          <span className="text-[9px] tracking-widest text-dim/20">
            © {year}
          </span>
        </div>

        {/* Bottom telemetry bar */}
        <div className="signal-line w-full mb-3" />
        <div className="flex items-center justify-between text-[8px] font-mono tracking-widest text-dim/20">
          <span>TCP/IP ACTIVE · PORT 443</span>
          <span>TERMINAL SESSION ACTIVE</span>
          <span>LUCAS_NET v2.0</span>
        </div>
      </div>
    </footer>
  );
}
