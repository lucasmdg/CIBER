"use client";

import { motion } from "framer-motion";

const skills = [
  {
    title: "Adaptabilidad",
    desc: "Capacidad para aprender nuevas tecnologías y frameworks rápidamente, ajustándome a entornos cambiantes.",
    icon: "⚡",
  },
  {
    title: "Curiosidad técnica",
    desc: "Interés constante por explorar herramientas emergentes, vulnerabilidades y metodologías de seguridad.",
    icon: "🔍",
  },
  {
    title: "Proactividad",
    desc: "Iniciativa para identificar problemas, proponer soluciones y automatizar procesos sin esperar instrucciones.",
    icon: "🚀",
  },
  {
    title: "Colaboración",
    desc: "Experiencia trabajando en equipo, compartiendo conocimiento técnico y contribuyendo a objetivos comunes.",
    icon: "🤝",
  },
  {
    title: "Comunicación",
    desc: "Capacidad para explicar conceptos técnicos complejos de forma clara, tanto oral como escrita.",
    icon: "💬",
  },
  {
    title: "Creatividad",
    desc: "Enfoque innovador para resolver problemas de seguridad, combinando técnicas existentes de formas nuevas.",
    icon: "💡",
  },
];

export default function Personality() {
  return (
    <section id="personality" className="section-spacing relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="section-badge inline-flex">SOFT SKILLS</div>
          <h2 className="section-title">
            Más allá de la{" "}
            <span className="gradient-text">tecnología</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Cualidades que definen mi forma de trabajar y colaborar
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {skills.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card-hover glass-panel rounded-xl p-5"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{s.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{s.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
