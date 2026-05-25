"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "33+", label: "Proyectos" },
  { value: "10+", label: "Tecnologías" },
  { value: "Python", label: "Lenguaje Principal" },
];

export default function About() {
  return (
    <section id="about" className="section-spacing relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="section-badge">SOBRE MÍ</div>
          <h2 className="section-title">
            Estudiante de{" "}
            <span className="gradient-text">Telecomunicaciones</span> y
            Ciberseguridad
          </h2>

          <div className="space-y-4 mt-6">
            <p className="text-muted leading-relaxed">
              Soy Lucas Méndez Díez, estudiante de FP Superior en Sistemas de
              Telecomunicaciones e Informáticos. Mi pasión es la ciberseguridad,
              las redes y la infraestructura crítica — áreas donde combino
              conocimientos técnicos con un enfoque práctico y orientado a
              resultados.
            </p>
            <p className="text-muted leading-relaxed">
              He desarrollado más de 30 proyectos de ciberseguridad que abarcan
              desde hardening básico hasta simulaciones de amenazas avanzadas
              (APT, Red Team). Mi flujo de trabajo es nativamente AI-driven:
              uso Cursor, Claude, Copilot y agentes autónomos como Hermes Agent
              para acelerar el desarrollo, junto con inferencia local via
              LM Studio y cómputo paralelo con OpenCL.
            </p>
            <p className="text-muted leading-relaxed">
              Estoy especialmente interesado en la intersección entre la
              ciberseguridad y la IA, la infraestructura cloud-native y el
              desarrollo de herramientas de seguridad automatizadas. Busco
              oportunidades donde pueda aportar visión técnica, adaptabilidad
              rápida y una mentalidad AI-native.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-muted font-mono tracking-wide">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
