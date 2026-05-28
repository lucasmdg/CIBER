"use client";

import { motion } from "framer-motion";
import {
  IconSchool,
  IconCode,
  IconShield,
  IconTerminal2,
  IconRadar,
  IconRocket,
} from "@tabler/icons-react";

const milestones = [
  {
    year: "2025",
    title: "Inicio FP Superior STI",
    desc: "Comienzo de la formación oficial en Sistemas de Telecomunicaciones e Informáticos. Primer contacto con redes, fibra óptica, ciberseguridad y administración de sistemas.",
    status: "SYSTEM_INITIALIZED",
    dotClass: "status-dot-online",
    icon: IconSchool,
  },
  {
    year: "2025",
    title: "Primeros proyectos de ciberseguridad",
    desc: "Password locker, port scanner, hash cracker, Caesar cipher. Python como lenguaje principal para herramientas de seguridad ofensiva y defensiva básica.",
    status: "CODE_BASE_COMPILED",
    dotClass: "status-dot-online",
    icon: IconCode,
  },
  {
    year: "2026",
    title: "Ciberseguridad intermedia",
    desc: "Sistemas IDS, detección de ARP spoofing, network sniffers avanzados. Detección de intrusiones en tiempo real y análisis de tráfico de red.",
    status: "FIREWALL_ARMED",
    dotClass: "status-dot-online",
    icon: IconShield,
  },
  {
    year: "2026",
    title: "Integración de IA en el workflow",
    desc: "Adopción masiva de herramientas de IA: Cursor, Claude AI, Copilot. Flujo de trabajo AI-native con asistentes de código y automatización inteligente.",
    status: "AI_COGNITION_ONLINE",
    dotClass: "status-dot-active",
    icon: IconTerminal2,
  },
  {
    year: "2027",
    title: "Finalización FP + Proyectos avanzados",
    desc: "Culminación del FP Superior STI. Simulador C2, framework de explotación modular, threat hunting lab, ransomware simulator. Técnicas ofensivas avanzadas en entorno controlado.",
    status: "THREAT_INTEL_ACTIVE",
    dotClass: "status-dot-active",
    icon: IconRadar,
  },
  {
    year: "2027 → 2028",
    title: "Especialización en Ciberseguridad",
    desc: "Continuación en el mismo ciclo con especialización en ciberseguridad ofensiva y defensiva. IA aplicada a seguridad, infraestructura cloud-native y herramientas Red Team.",
    status: "RED_TEAM_QUEUED",
    dotClass: "status-dot-warning",
    icon: IconRocket,
    future: true,
  },
];

export default function Journey() {
  return (
    <section id="journey" className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="status-dot status-dot-active" />
            <span className="text-[10px] tracking-widest text-cyan/60 uppercase font-mono">
              SYSTEM.JOURNEY.AUDIT_LOGS
            </span>
          </div>
          <div className="signal-line w-full" />
        </motion.div>

        {/* Audit timeline */}
        <div className="relative">
          {/* Vertical conduit line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-green/20 via-cyan/20 to-transparent" />

          <div className="space-y-6">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="relative pl-8 flex gap-4 items-start"
                >
                  {/* Node dot */}
                  <div className="absolute left-0 top-1">
                    <div className={`status-dot ${m.dotClass}`} />
                  </div>

                  {/* Audit details */}
                  <div className="sys-panel rounded-lg p-5 flex-1 group hover:border-cyan/15 transition-all duration-300">
                    <div className="flex flex-col gap-2 font-mono">
                      {/* Entry header telemetry */}
                      <div className="flex items-center justify-between border-b border-border pb-2 mb-2 text-[9px] text-dim/60">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan/60 font-bold">[{m.year}]</span>
                          <span className="hidden sm:inline">|</span>
                          <span className="hidden sm:inline">EVENT_ID: 0x{String(4096 + i * 256).toUpperCase()}</span>
                        </div>
                        <span className={`font-bold ${
                          m.future ? "text-amber/70" : "text-green/70"
                        }`}>
                          {m.status}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex items-start gap-4">
                        <div className="w-7 h-7 rounded border border-border flex items-center justify-center shrink-0">
                          <Icon size={12} className="text-dim/50 group-hover:text-cyan transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-text/80 group-hover:text-cyan transition-colors">
                            {m.title}
                          </h4>
                          <p className="text-[11px] text-muted leading-relaxed mt-1">
                            {m.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
