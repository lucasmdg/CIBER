"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const highlights = [
  {
    label: "Enfoque",
    value: "Ciberseguridad",
    color: "text-accent",
  },
  {
    label: "Estudios",
    value: "Telecomunicaciones e Informática",
    color: "text-cyan",
  },
  {
    label: "Actitud",
    value: "Aprendizaje continuo",
    color: "text-success",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="section-spacing">
      <div className="section-container">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium text-accent tracking-wide uppercase mb-4 block">
            Sobre mí
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-8 tracking-tight">
            Estudiante, aprendiz constante y apasionado de la seguridad
            informática
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
              Soy estudiante de un ciclo superior en <strong className="text-text">Telecomunicaciones e Informática</strong>, con una clara orientación hacia el mundo de la{" "}
              <strong className="text-text">ciberseguridad</strong>, un campo que no solo me interesa, sino que realmente me apasiona.
            </p>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
              Tengo una base sólida en <strong className="text-text">Python</strong>, lenguaje con el que trabajo con soltura, y actualmente estoy ampliando mis conocimientos en{" "}
              <strong className="text-text">Java</strong> y <strong className="text-text">JavaScript</strong>. Además, cuento con nociones de C y C++.
            </p>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              Me considero una persona en constante aprendizaje; disfruto adquiriendo nuevos conocimientos y enfrentándome a retos que me permitan crecer tanto a nivel técnico como personal. Más allá de lo técnico, soy alguien cercano, comunicativo y muy colaborativo.
            </p>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="card p-6 space-y-5">
              {highlights.map((item) => (
                <div key={item.label}>
                  <span className="text-xs text-text-tertiary uppercase tracking-wide">
                    {item.label}
                  </span>
                  <p className={`text-base font-medium mt-1 ${item.color}`}>
                    {item.value}
                  </p>
                </div>
              ))}
              <div className="pt-3 border-t border-border">
                <span className="text-xs text-text-tertiary uppercase tracking-wide">
                  Cualidades
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Colaborativo", "Comunicativo", "Curioso", "Persistente"].map(
                    (qual) => (
                      <span key={qual} className="tag-soft">
                        {qual}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
