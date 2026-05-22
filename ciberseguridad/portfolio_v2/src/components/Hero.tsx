"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center section-container pt-24"
    >
      <div className="w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-text-secondary tracking-wide uppercase">
                Estudiante de Ciberseguridad
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-text">Lucas</span>{" "}
            <span className="gradient-text">Méndez Díez</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Estudiante de Telecomunicaciones e Informática con orientación hacia
            la ciberseguridad. Apasionado por la tecnología, el aprendizaje
            continuo y los retos técnicos.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-all duration-200 shadow-[0_2px_8px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
            >
              Conoce más sobre mí
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L12 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 7H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-border text-text-secondary text-sm font-medium hover:border-accent/30 hover:text-accent transition-all duration-200"
            >
              Contactar
            </a>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-text-tertiary tracking-wide">Scroll</span>
            <div className="w-[1px] h-8 bg-border" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
