"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="status-dot status-dot-online" />
            <span className="text-[10px] tracking-widest text-green/60 uppercase font-mono">
              SYSTEM.OPERATOR.REGISTRY
            </span>
          </div>
          <div className="signal-line w-full" />
        </motion.div>

        {/* Bio content block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="sys-panel rounded-lg p-6 md:p-8"
        >
          <div className="flex flex-col gap-6 font-mono text-xs">
            {/* Header info table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-border text-[11px]">
              <div>
                <span className="text-dim/50 block">OPERATOR</span>
                <span className="text-text/90 font-bold">LUCAS MÉNDEZ DÍEZ</span>
              </div>
              <div>
                <span className="text-dim/50 block">CLASSIFICATION</span>
                <span className="text-cyan/80">TELECOMMUNICATIONS & SYSTEMS OPERATOR</span>
              </div>
              <div>
                <span className="text-dim/50 block">TRACK</span>
                <span className="text-text/75">FP Superior — STI (Sistemas de Telecomunicaciones e Informáticos)</span>
              </div>
              <div>
                <span className="text-dim/50 block">STATUS</span>
                <span className="text-green/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  STILL LEARNING. ALWAYS BUILDING.
                </span>
              </div>
            </div>

            {/* Narrative text */}
            <div className="space-y-4 text-text/70 leading-relaxed text-justify">
              <p>
                Soy Lucas Méndez Díez, estudiante de FP Superior en Sistemas de Telecomunicaciones e Informáticos. 
                Mi pasión es la ciberseguridad, las redes y la infraestructura crítica — áreas donde combino 
                conocimientos técnicos con un enfoque práctico y orientado a resultados.
              </p>
              <p>
                He desarrollado más de 30 proyectos de ciberseguridad que abarcan desde hardening básico hasta 
                simulaciones de amenazas avanzadas (APT, Red Team). Mi flujo de trabajo es nativamente AI-driven: 
                uso Cursor, Claude, Copilot y agentes autónomos como Hermes Agent para acelerar el desarrollo, 
                junto con inferencia local via LM Studio y cómputo paralelo con OpenCL.
              </p>
              <p>
                Estoy especialmente interesado en la intersección entre la ciberseguridad y la IA, la infraestructura 
                cloud-native y el desarrollo de herramientas de seguridad automatizadas. Busco oportunidades 
                donde pueda aportar visión técnica, adaptabilidad rápida y una mentalidad AI-native.
              </p>
            </div>

            {/* Active telemetry readouts */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border text-center">
              <div>
                <span className="text-[20px] font-bold text-cyan/90 block">33+</span>
                <span className="text-[9px] text-dim/50 uppercase tracking-widest">DEPLOYED PROJECTS</span>
              </div>
              <div>
                <span className="text-[20px] font-bold text-green/90 block">10+</span>
                <span className="text-[9px] text-dim/50 uppercase tracking-widest">TECH PROTOCOLS</span>
              </div>
              <div>
                <span className="text-[20px] font-bold text-amber/90 block">PYTHON</span>
                <span className="text-[9px] text-dim/50 uppercase tracking-widest">PRIMARY LANGUAGE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
