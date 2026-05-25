"use client";

import { motion } from "framer-motion";

const goals = [
  {
    title: "Red Team",
    desc: "Especialización en ciberseguridad ofensiva: simulación de amenazas avanzadas, post-explotación y evasión de defensas.",
    number: "01",
  },
  {
    title: "AI Security",
    desc: "Intersección entre inteligencia artificial y ciberseguridad: detección de amenazas con ML, análisis predictivo y automatización defensiva.",
    number: "02",
  },
  {
    title: "Cloud Infra",
    desc: "Infraestructura cloud-native segura: despliegue automatizado, hardening de entornos cloud y DevSecOps práctico.",
    number: "03",
  },
  {
    title: "Liderazgo",
    desc: "Crecimiento hacia roles técnicos de responsabilidad: mentoría, liderazgo de equipos de seguridad y dirección técnica de proyectos.",
    number: "04",
  },
];

export default function Goals() {
  return (
    <section id="goals" className="section-spacing relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="section-badge inline-flex">VISIÓN</div>
          <h2 className="section-title">
            Próximos{" "}
            <span className="gradient-text-purple">objetivos</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Áreas de enfoque para los próximos años en mi carrera técnica
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {goals.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card-hover glass-panel rounded-xl p-6 group relative overflow-hidden"
            >
              <span className="text-4xl font-bold absolute -top-1 -right-2 opacity-[0.04] text-accent select-none">
                {g.number}
              </span>
              <h3 className="text-base font-semibold mb-2 group-hover:text-accent transition-colors">
                {g.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
