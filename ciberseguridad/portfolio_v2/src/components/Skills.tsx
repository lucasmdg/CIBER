"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const skills = [
  {
    name: "Python",
    level: "Sólido",
    levelClass: "text-accent",
    barWidth: "w-4/5",
    barColor: "bg-accent",
  },
  {
    name: "Java",
    level: "En aprendizaje",
    levelClass: "text-cyan",
    barWidth: "w-2/5",
    barColor: "bg-cyan",
  },
  {
    name: "JavaScript",
    level: "En aprendizaje",
    levelClass: "text-cyan",
    barWidth: "w-2/5",
    barColor: "bg-cyan",
  },
  {
    name: "C / C++",
    level: "Nociones",
    levelClass: "text-text-tertiary",
    barWidth: "w-1/4",
    barColor: "bg-gray-300",
  },
];

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" ref={ref} className="section-spacing bg-gray-50/50">
      <div className="section-container">
        <motion.div
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium text-accent tracking-wide uppercase mb-4 block">
            Conocimientos técnicos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight">
            Tecnologías con las que trabajo
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="card p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-text">{skill.name}</span>
                <span className={`text-xs font-medium ${skill.levelClass}`}>
                  {skill.level}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${skill.barColor}`}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: skill.barWidth } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-8 text-sm text-text-tertiary max-w-xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Aprendizaje continuo en lenguajes de programación — siempre ampliando mi stack técnico.
        </motion.p>
      </div>
    </section>
  );
}
