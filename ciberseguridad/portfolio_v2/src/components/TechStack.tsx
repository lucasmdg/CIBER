"use client";

import { motion } from "framer-motion";
import {
  IconBrandPython,
  IconBrandJavascript,
  IconFileTypeCss,
  IconBrandReact,
  IconBrandNextjs,
  IconBrandThreejs,
  IconBrandTailwind,
  IconBrandDocker,
  IconBrandGit,
  IconBrandNodejs,
  IconCloudComputing,
  IconShieldLock,
  IconNetwork,
  IconRouter,
  IconTerminal2,
  IconCpu,
  IconBolt,
  IconGhost,
  IconRobotFace,
} from "@tabler/icons-react";

const categories = [
  {
    title: "Lenguajes",
    skills: [
      { icon: IconBrandPython, name: "Python" },
      { icon: FileTypeC, name: "C" },
      { icon: IconBrandJavascript, name: "JavaScript" },
      { icon: FileTypeJava, name: "Java" },
      { icon: IconFileTypeCss, name: "CSS/HTML" },
    ],
  },
  {
    title: "Frameworks & Herramientas",
    skills: [
      { icon: IconBrandNextjs, name: "Next.js" },
      { icon: IconBrandReact, name: "React" },
      { icon: IconBrandTailwind, name: "Tailwind CSS" },
      { icon: IconBrandThreejs, name: "Three.js" },
      { icon: IconBrandNodejs, name: "Node.js" },
    ],
  },
  {
    title: "Sistemas & Redes",
    skills: [
      { icon: BrandLinux, name: "Linux" },
      { icon: IconBrandDocker, name: "Docker" },
      { icon: IconBrandGit, name: "Git" },
      { icon: IconTerminal2, name: "Bash" },
      { icon: IconNetwork, name: "Redes" },
    ],
  },
  {
    title: "Ciberseguridad",
    skills: [
      { icon: IconShieldLock, name: "Pentesting" },
      { icon: IconCloudComputing, name: "Cloud" },
      { icon: IconRouter, name: "GPON/FTTH" },
      { icon: IconCpu, name: "IoT" },
    ],
  },
  {
    title: "AI & Tools",
    skills: [
      { icon: IconRobotFace, name: "Cursor" },
      { icon: IconTerminal2, name: "Claude AI" },
      { icon: IconBolt, name: "LM Studio" },
      { icon: IconGhost, name: "Hermes Agent" },
      { icon: IconCpu, name: "OpenCL" },
    ],
  },
];

function FileTypeC({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M10 12h4" />
      <path d="M12 10v4" />
    </svg>
  );
}

function FileTypeJava({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M8 11h8" />
      <path d="M10 15h4" />
      <path d="M8 7h8" />
    </svg>
  );
}

function BrandLinux({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2c-1.3 0-2.5.8-3.1 2" />
      <path d="M10 8c0-1.1.9-2 2-2s2 .9 2 2" />
      <path d="M6 14c0-2 1.5-5 3-5" />
      <path d="M18 14c0-2-1.5-5-3-5" />
      <path d="M6 18c0-1.5.7-3 2-4" />
      <path d="M18 18c0-1.5-.7-3-2-4" />
      <path d="M8 18v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function SkillCard({
  skill,
  index,
  categoryIndex,
}: {
  skill: { icon: React.ComponentType<{ size?: number; className?: string }>; name: string };
  index: number;
  categoryIndex: number;
}) {
  const Icon = skill.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.3,
        delay: index * 0.04 + categoryIndex * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="card-hover glass-panel rounded-xl p-3 flex items-center gap-3"
    >
      <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-accent" />
      </div>
      <span className="text-sm text-muted font-mono">{skill.name}</span>
    </motion.div>
  );
}

export default function TechStack() {
  return (
    <section id="stack" className="section-spacing relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="section-badge inline-flex">TECH STACK</div>
          <h2 className="section-title">
            Tecnologías y{" "}
            <span className="gradient-text">herramientas</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Stack moderno para desarrollo, redes y ciberseguridad
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((cat, ci) => (
            <div key={cat.title}>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: ci * 0.1 }}
                className="text-xs font-mono tracking-wider uppercase mb-4"
                style={{ color: "rgba(139,148,158,0.6)" }}
              >
                {cat.title}
              </motion.h3>
              <div className="space-y-2">
                {cat.skills.map((s, i) => (
                  <SkillCard key={s.name} skill={s} index={i} categoryIndex={ci} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
