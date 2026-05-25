"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "33+", label: "Proyectos", num: 33 },
  { value: "10+", label: "Tecnologías", num: 10 },
  { value: "Python", label: "Lenguaje Principal", num: 1 },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      statsRef.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.num,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            el.textContent = stat.label === "Lenguaje Principal"
              ? "Python"
              : `${Math.floor(obj.val)}+`;
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section-spacing relative">
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
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  ref={(el) => { statsRef.current[i] = el; }}
                  className="text-2xl sm:text-3xl font-bold text-accent mb-1"
                >
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
