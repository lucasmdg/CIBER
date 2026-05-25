"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  IconSchool,
  IconCode,
  IconShield,
  IconTerminal2,
  IconRadar,
  IconRocket,
} from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    year: "2025",
    title: "Inicio FP Superior STI",
    desc: "Comienzo de la formación oficial en Sistemas de Telecomunicaciones e Informáticos. Primer contacto con redes, fibra óptica, ciberseguridad y administración de sistemas.",
    icon: IconSchool,
  },
  {
    year: "2025",
    title: "Primeros proyectos de ciberseguridad",
    desc: "Password locker, port scanner, hash cracker, Caesar cipher. Python como lenguaje principal para herramientas de seguridad ofensiva y defensiva básica.",
    icon: IconCode,
  },
  {
    year: "2026",
    title: "Ciberseguridad intermedia",
    desc: "Sistemas IDS, detección de ARP spoofing, network sniffers avanzados. Automatización de tareas de seguridad con scripts multihilo y análisis de tráfico.",
    icon: IconShield,
  },
  {
    year: "2026",
    title: "Integración de IA en el workflow",
    desc: "Adopción masiva de herramientas de IA: Cursor, Claude AI, Copilot. Flujo de trabajo AI-native con asistentes de código y automatización inteligente.",
    icon: IconTerminal2,
  },
  {
    year: "2027",
    title: "Finalización FP + Proyectos avanzados",
    desc: "Culminación del FP Superior STI. Simulador C2, framework de explotación, threat hunting lab, ransomware simulator. Técnicas ofensivas en entorno controlado.",
    icon: IconRadar,
  },
  {
    year: "2027",
    title: "Especialización en Ciberseguridad",
    desc: "Continuación en el mismo ciclo con especialización en ciberseguridad ofensiva y defensiva. IA aplicada a seguridad, infraestructura cloud-native y herramientas Red Team.",
    icon: IconRocket,
    future: false,
  },
];

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        if (lineRef.current) gsap.set(lineRef.current, { scaleY: 1 });
        return;
      }
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" ref={sectionRef} className="section-spacing relative overflow-hidden">
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
            Mi recorrido de <span className="gradient-text">aprendizaje</span>
          </h2>
          <p className="section-subtitle mx-auto">
            De los primeros scripts de seguridad a la especialización en Red Team
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div
            ref={lineRef}
            className="absolute left-[40px] md:left-1/2 top-0 w-px h-full -translate-x-1/2 origin-top"
            style={{
              background: "linear-gradient(to bottom, rgba(88,166,255,0.3), rgba(34,211,238,0.1))",
            }}
          />

          {milestones.map((m, i) => {
            const isLeft = i % 2 === 0;
            const Icon = m.icon;
            const isFuture = m.future;

            return (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-start gap-4 mb-10 md:mb-14 last:mb-0"
              >
                <div className="w-8 shrink-0 relative z-10 order-1 md:order-2 flex justify-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 relative ${
                      isFuture ? "border-accent-cyan" : "border-accent"
                    }`}
                    style={{ backgroundColor: "#06080f" }}
                  >
                    <div
                      className={`absolute inset-0.5 rounded-full ${
                        isFuture ? "bg-accent-cyan/40" : "bg-accent/40"
                      }`}
                    />
                  </div>
                </div>

                <div
                  className={`flex-1 min-w-0 order-2 ${
                    isLeft
                      ? "md:order-1 md:text-right md:pr-10"
                      : "md:order-3 md:pl-10"
                  }`}
                >
                  <div
                    className={`glass-panel rounded-xl p-4 md:p-5 ${
                      isFuture ? "border-accent-cyan/20" : ""
                    }`}
                    style={isFuture ? { borderStyle: "dashed" } : undefined}
                  >
                    <div
                      className={`flex items-start gap-3 md:gap-4 ${
                        isLeft ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`hidden md:flex w-9 h-9 rounded-lg items-center justify-center shrink-0 ${
                          isFuture
                            ? "bg-accent-cyan-dim border border-accent-cyan/20"
                            : "bg-accent-dim border border-accent/20"
                        }`}
                      >
                        <Icon size={16} className={isFuture ? "text-accent-cyan" : "text-accent"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <div
                            className={`md:hidden w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isFuture
                                ? "bg-accent-cyan-dim border border-accent-cyan/20"
                                : "bg-accent-dim border border-accent/20"
                            }`}
                          >
                            <Icon size={14} className={isFuture ? "text-accent-cyan" : "text-accent"} />
                          </div>
                          <span
                            className={`text-[11px] font-mono tracking-wider ${
                              isFuture ? "text-accent-cyan" : "text-accent"
                            }`}
                          >
                            {m.year}
                          </span>
                          {isFuture && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 tracking-wider">
                              SIGUIENTE
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold mb-1">{m.title}</h3>
                        <p className="text-xs text-muted leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`hidden md:block flex-1 ${
                    isLeft ? "md:order-3" : "md:order-1"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
