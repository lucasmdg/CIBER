"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, BookOpen, Target, Users } from "lucide-react";

const goals = [
  {
    icon: Shield,
    title: "Especialización en Ciberseguridad",
    description:
      "Mi objetivo es profundizar en seguridad ofensiva y defensiva, convirtiéndome en un profesional de referencia en el sector.",
  },
  {
    icon: Target,
    title: "Crecimiento Profesional",
    description:
      "Busco oportunidades donde pueda aportar valor real, asumir responsabilidades y seguir desarrollándome como profesional.",
  },
  {
    icon: BookOpen,
    title: "Aprendizaje Continuo",
    description:
      "Cada proyecto es una oportunidad de aprender. Me comprometo a mejorar mis habilidades técnicas y blandas constantemente.",
  },
  {
    icon: Users,
    title: "Participación en Proyectos",
    description:
      "Quiero formar parte de equipos donde pueda colaborar, compartir conocimientos y construir soluciones juntos.",
  },
];

export default function Goals() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="goals" ref={ref} className="section-spacing">
      <div className="section-container">
        <motion.div
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium text-accent tracking-wide uppercase mb-4 block">
            Objetivos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight">
            Mis metas profesionales
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {goals.map((goal, i) => {
            const Icon = goal.icon;
            return (
              <motion.div
                key={goal.title}
                className="card-hover p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                  <Icon size={20} className="text-accent" />
                </div>
                <h3 className="text-base font-semibold text-text mb-2">
                  {goal.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {goal.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
