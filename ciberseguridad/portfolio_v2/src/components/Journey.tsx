"use client";

import { motion } from "framer-motion";

const milestones = [
  {
    year: "2023",
    title: "Inicio FP Superior STI",
    desc: "Comienzo de la formación en Sistemas de Telecomunicaciones e Informáticos. Primer contacto con redes, fibra óptica y ciberseguridad.",
  },
  {
    year: "2023",
    title: "Primeros scripts de seguridad",
    desc: "Desarrollo de herramientas básicas: password locker, port scanner, hash cracker. Fundamentos de Python aplicados a ciberseguridad.",
  },
  {
    year: "2024",
    title: "Ciberseguridad intermedia",
    desc: "Sistemas IDS, ARP spoofing detection, sniffers avanzados. Automatización de tareas de seguridad con scripts multihilo.",
  },
  {
    year: "2024",
    title: "Proyectos avanzados",
    desc: "Simulador C2, framework de explotación, threat hunting lab, ransomware simulator controlado. Introducción al Red Team.",
  },
  {
    year: "2025",
    title: "Integración de IA en el workflow",
    desc: "Adopción masiva de herramientas de IA: Cursor, Claude, Copilot. Optimización del flujo de desarrollo con asistentes inteligentes.",
  },
  {
    year: "2026",
    title: "Ciberseguridad + IA + Cloud",
    desc: "Exploración de infraestructura cloud-native, automatización con IA, y preparación para el siguiente nivel en ciberseguridad ofensiva.",
  },
];

export default function Journey() {
  return (
    <section id="journey" className="section-spacing relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="section-badge inline-flex">TRAYECTORIA</div>
          <h2 className="section-title">
            Mi recorrido de{" "}
            <span className="gradient-text">aprendizaje</span>
          </h2>
          <p className="section-subtitle mx-auto">
            De los primeros scripts de seguridad a la integración de IA en el
            flujo de trabajo
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto relative">
          <div
            className="absolute left-[17px] top-2 bottom-2 w-px"
            style={{ background: "rgba(88,166,255,0.15)" }}
          />

          <div className="space-y-8">
            {milestones.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative pl-10"
              >
                <div className="absolute left-[11px] top-[6px] w-3 h-3 rounded-full border-2 border-accent bg-bg z-10" />
                <div className="glass-panel rounded-xl p-4">
                  <span className="text-[11px] font-mono text-accent tracking-wider">
                    {m.year}
                  </span>
                  <h3 className="text-sm font-semibold mt-0.5 mb-1">
                    {m.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
