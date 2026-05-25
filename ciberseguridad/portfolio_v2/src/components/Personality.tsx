"use client";

import { motion } from "framer-motion";
import {
  IconAdjustments,
  IconSearch,
  IconRocket,
  IconUsersGroup,
  IconMessages,
  IconBulb,
} from "@tabler/icons-react";

const skills = [
  {
    title: "Adaptabilidad",
    desc: "Capacidad para aprender nuevas tecnologías y frameworks rápidamente, ajustándome a entornos cambiantes.",
    icon: IconAdjustments,
  },
  {
    title: "Curiosidad técnica",
    desc: "Interés constante por explorar herramientas emergentes, vulnerabilidades y metodologías de seguridad.",
    icon: IconSearch,
  },
  {
    title: "Proactividad",
    desc: "Iniciativa para identificar problemas, proponer soluciones y automatizar procesos sin esperar instrucciones.",
    icon: IconRocket,
  },
  {
    title: "Colaboración",
    desc: "Experiencia trabajando en equipo, compartiendo conocimiento técnico y contribuyendo a objetivos comunes.",
    icon: IconUsersGroup,
  },
  {
    title: "Comunicación",
    desc: "Capacidad para explicar conceptos técnicos complejos de forma clara, tanto oral como escrita.",
    icon: IconMessages,
  },
  {
    title: "Creatividad",
    desc: "Enfoque innovador para resolver problemas de seguridad, combinando técnicas existentes de formas nuevas.",
    icon: IconBulb,
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
          {skills.map((s, i) => {
            const Icon = s.icon;
            return (
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
                className="card-hover glass-panel rounded-xl p-5 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent-dim border border-accent/20 flex items-center justify-center shrink-0 group-hover:border-accent/40 transition-colors">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 group-hover:text-accent transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
