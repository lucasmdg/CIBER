"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData, type ProjectLevel } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/lib/icons";

const filters: { label: string; value: ProjectLevel | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Básico", value: "basico" },
  { label: "Intermedio", value: "intermedio" },
  { label: "Avanzado", value: "avanzado" },
  { label: "Futuro", value: "futuro" },
];

const levelColors: Record<ProjectLevel, string> = {
  basico: "text-teal border-teal/20 bg-teal/5",
  intermedio: "text-cyan border-cyan/20 bg-cyan/5",
  avanzado: "text-accent border-accent/20 bg-accent/5",
  futuro: "text-muted border-border bg-surface",
};

const levelLabels: Record<ProjectLevel, string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  futuro: "Futuro",
};

function ProjectCard({ project: p, index }: { project: typeof projectsData[0]; index: number }) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.03 }}
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
          onMouseLeave={() => { setHover(false); setMouse({ x: 50, y: 50 }); }}
          className="glass-panel card-hover rounded-xl p-5 relative overflow-hidden"
        >
          {hover && (
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-200"
              style={{
                background: `radial-gradient(500px circle at ${mouse.x}% ${mouse.y}%, rgba(59,130,246,0.06) 0%, transparent 50%)`,
              }}
            />
          )}

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-sm text-text group-hover:text-accent transition-colors">
                {p.title}
              </h3>
              <ArrowUpRight size={14} className="text-dim group-hover:text-accent transition-colors flex-shrink-0 mt-0.5" />
            </div>

            <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">
              {p.description}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-mono rounded-md border ${levelColors[p.level]}`}>
                {levelLabels[p.level]}
              </span>

              {p.tags.slice(0, 3).map((t) => (
                <span key={t} className="px-2 py-0.5 text-[10px] font-mono text-dim bg-surface rounded-md border border-border">
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

  const filtered = active === "all" ? projectsData : projectsData.filter((p) => p.level === active);

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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-dim border border-accent/20 rounded-full text-xs font-mono text-accent tracking-wider mb-4">
            PROYECTOS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Laboratorio de{" "}
            <span className="gradient-text">Ciberseguridad</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm">
            Proyectos reales de ciberseguridad, automatización y desarrollo
          </p>
        </div>

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
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-10">
          <a
            href="https://github.com/lucasmdg/CIBER"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider text-muted border border-border rounded-xl hover:text-text hover:border-border-light transition-colors"
          >
            <GithubIcon style={{ width: 16, height: 16 }} />
            Ver repositorio completo en GitHub
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
