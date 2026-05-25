"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData, type ProjectLevel } from "@/data/projects";

const filters: { label: string; value: ProjectLevel | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Básico", value: "basico" },
  { label: "Intermedio", value: "intermedio" },
  { label: "Avanzado", value: "avanzado" },
  { label: "Futuro", value: "futuro" },
];

const levelColors: Record<ProjectLevel, string> = {
  basico: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  intermedio: "text-accent border-accent/20 bg-accent/5",
  avanzado: "text-purple-400 border-purple-400/20 bg-purple-400/5",
  futuro: "text-muted border-border bg-surface",
};

const levelLabels: Record<ProjectLevel, string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  futuro: "Futuro",
};

// Featured = 6 most representative projects (mix of avanzado + intermedio)
const featuredTitles = [
  "Red Team Lab Simulation",
  "Network IDS (NIDS)",
  "Mini Metasploit Framework",
  "Advanced Password Manager",
  "Web Pentesting Framework",
  "Threat Hunting Lab",
];

function ProjectCard({
  project: p,
  index,
  compact,
}: {
  project: (typeof projectsData)[0];
  index: number;
  compact?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.03 }}
    >
      <a
        href={p.github}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => {
            setHover(false);
            setMouse({ x: 50, y: 50 });
          }}
          className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
            compact ? "p-4" : "p-6"
          } glass-panel card-hover`}
          style={{
            transform: hover
              ? `perspective(800px) rotateX(${(mouse.y - 50) * -0.02}deg) rotateY(${(mouse.x - 50) * 0.02}deg)`
              : "perspective(800px) rotateX(0deg) rotateY(0deg)",
          }}
        >
          {hover && (
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-150"
              style={{
                background: `radial-gradient(500px circle at ${mouse.x}% ${mouse.y}%, rgba(88,166,255,0.05) 0%, transparent 50%)`,
              }}
            />
          )}

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className={`font-semibold text-text group-hover:text-accent transition-colors ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                {p.title}
              </h3>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-dim group-hover:text-accent transition-colors flex-shrink-0 mt-0.5"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17L17 7" />
              </svg>
            </div>

            <p
              className={`text-muted leading-relaxed mb-3 ${
                compact ? "text-[11px] line-clamp-2" : "text-xs line-clamp-2"
              }`}
            >
              {p.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`px-2 py-0.5 text-[10px] font-mono rounded-md border ${levelColors[p.level]}`}
              >
                {levelLabels[p.level]}
              </span>
              {p.tags.slice(0, compact ? 2 : 3).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-[10px] font-mono text-dim bg-elevated rounded-md border border-border"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<ProjectLevel | "all">("all");

  const filtered =
    active === "all"
      ? projectsData
      : projectsData.filter((p) => p.level === active);

  const featured = filtered.filter((p) => featuredTitles.includes(p.title));
  const rest = filtered.filter((p) => !featuredTitles.includes(p.title));

  const counts = {
    all: projectsData.length,
    basico: projectsData.filter((p) => p.level === "basico").length,
    intermedio: projectsData.filter((p) => p.level === "intermedio").length,
    avanzado: projectsData.filter((p) => p.level === "avanzado").length,
    futuro: projectsData.filter((p) => p.level === "futuro").length,
  };

  return (
    <section id="projects" className="section-spacing relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="section-badge inline-flex">PROYECTOS</div>
          <h2 className="section-title">
            Seguridad en{" "}
            <span className="gradient-text">acción</span>
          </h2>
          <p className="section-subtitle mx-auto">
            {projectsData.length} proyectos reales de ciberseguridad,
            automatización y telecomunicaciones
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className="relative px-4 py-2 text-xs font-mono tracking-wider rounded-lg transition-colors"
            >
              {active === f.value && (
                <motion.div
                  layoutId="project-filter"
                  className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {f.label}{" "}
                <span className="text-dim">({counts[f.value]})</span>
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {featured.length > 0 && (
              <div className="mb-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] font-mono tracking-widest text-dim mb-4 uppercase"
                >
                  Destacados
                </motion.p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featured.map((p, i) => (
                    <ProjectCard key={p.title} project={p} index={i} />
                  ))}
                </div>
              </div>
            )}

            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] font-mono tracking-widest text-dim mb-4 uppercase"
                  >
                    Todos los proyectos
                  </motion.p>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rest.map((p, i) => (
                    <ProjectCard key={p.title} project={p} index={i} compact />
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <p className="text-center text-muted text-sm py-12">
                No hay proyectos en esta categoría.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://github.com/lucasmdg/CIBER"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider text-muted border border-border rounded-xl hover:text-text hover:border-border-light transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Ver repositorio completo en GitHub
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7h10v10" />
              <path d="M7 17L17 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
