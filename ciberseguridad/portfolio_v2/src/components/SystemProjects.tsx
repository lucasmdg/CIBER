"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData, type ProjectLevel } from "@/data/projects";

const levelConfig: Record<ProjectLevel, { label: string; color: string; dotClass: string }> = {
  basico: { label: "BASIC", color: "text-green/70", dotClass: "status-dot-online" },
  intermedio: { label: "INTERMEDIATE", color: "text-cyan/70", dotClass: "status-dot-active" },
  avanzado: { label: "ADVANCED", color: "text-amber/70", dotClass: "status-dot-warning" },
  futuro: { label: "FUTURE", color: "text-dim", dotClass: "" },
  varios: { label: "MISC", color: "text-cyan/70", dotClass: "status-dot-active" },
};

const filters: { label: string; value: ProjectLevel | "all"; count: number }[] = [
  { label: "ALL", value: "all", count: projectsData.length },
  { label: "BASIC", value: "basico", count: projectsData.filter((p) => p.level === "basico").length },
  { label: "INTERMEDIATE", value: "intermedio", count: projectsData.filter((p) => p.level === "intermedio").length },
  { label: "ADVANCED", value: "avanzado", count: projectsData.filter((p) => p.level === "avanzado").length },
  { label: "FUTURE", value: "futuro", count: projectsData.filter((p) => p.level === "futuro").length },
  { label: "MISC", value: "varios", count: projectsData.filter((p) => p.level === "varios").length },
];

function ProjectRow({ project: p, index }: { project: typeof projectsData[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = levelConfig[p.level];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
    >
      <div
        className="project-row px-4 py-3 cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Main row */}
        <div className="flex items-center gap-4">
          {/* Index */}
          <span className="text-[10px] text-dim/40 font-mono w-6 text-right shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Status dot */}
          <div className={`status-dot shrink-0 ${cfg.dotClass}`}
            style={!cfg.dotClass ? { background: "#484f58", boxShadow: "none", animation: "none" } : {}}
          />

          {/* Title */}
          <span className="text-xs text-text/80 group-hover:text-cyan transition-colors flex-1 truncate">
            {p.title}
          </span>

          {/* Level badge */}
          <span className={`text-[9px] tracking-widest font-mono ${cfg.color} shrink-0 hidden sm:inline`}>
            {cfg.label}
          </span>

          {/* Tags */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {p.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[9px] text-dim/50 font-mono px-1.5 py-0.5 border border-border rounded-sm">
                {t}
              </span>
            ))}
          </div>

          {/* Expand arrow */}
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`text-dim/30 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-14 border-l-2 border-cyan/10 ml-4">
              <p className="text-[11px] text-muted leading-relaxed mb-3">
                {p.description}
              </p>

              {/* System info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[9px] font-mono">
                <div>
                  <span className="text-dim/40 block">CATEGORY</span>
                  <span className={cfg.color}>{cfg.label}</span>
                </div>
                <div>
                  <span className="text-dim/40 block">PROTOCOL</span>
                  <span className="text-text/60">{p.tags[0] || "N/A"}</span>
                </div>
                <div>
                  <span className="text-dim/40 block">STATE</span>
                  <span className="text-green/60">{p.level === "futuro" ? "QUEUED" : "DEPLOYED"}</span>
                </div>
                <div>
                  <span className="text-dim/40 block">LATENCY</span>
                  <span className="text-cyan/60">{(Math.random() * 20 + 1).toFixed(1)}ms</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3 md:hidden">
                {p.tags.map((t) => (
                  <span key={t} className="text-[9px] text-dim/50 font-mono px-1.5 py-0.5 border border-border rounded-sm">
                    {t}
                  </span>
                ))}
              </div>

              {/* GitHub link */}
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] tracking-widest text-cyan/50 hover:text-cyan transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                VIEW SOURCE →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SystemProjects() {
  const [active, setActive] = useState<ProjectLevel | "all">("all");

  const filtered = active === "all"
    ? projectsData
    : projectsData.filter((p) => p.level === active);

  return (
    <section id="projects" className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="status-dot status-dot-warning" />
            <span className="text-[10px] tracking-widest text-amber/60 uppercase font-mono">
              PROJECT REGISTRY — {projectsData.length} ENTRIES
            </span>
          </div>
          <div className="signal-line w-full" />
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-1 mb-6"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`px-3 py-1.5 text-[9px] font-mono tracking-widest border rounded-sm transition-all duration-200
                ${active === f.value
                  ? "text-cyan border-cyan/20 bg-cyan-dim"
                  : "text-dim/40 border-border hover:text-dim hover:border-border-light"
                }`}
            >
              {f.label} <span className="text-dim/30">({f.count})</span>
            </button>
          ))}
        </motion.div>

        {/* Project list */}
        <div className="sys-panel rounded-lg overflow-hidden divide-y divide-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.map((p, i) => (
                <ProjectRow key={p.title} project={p} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Repository link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <a
            href="https://github.com/lucasmdg/CIBER"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest text-dim hover:text-cyan transition-colors font-mono"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            FULL REPOSITORY ON GITHUB →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
