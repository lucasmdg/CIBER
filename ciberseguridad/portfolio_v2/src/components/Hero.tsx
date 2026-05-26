"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

const nameText = "Lucas Méndez Díez";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.2 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoParallax = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-16 section-container overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div style={{ opacity }} className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
          <div className="flex-1 max-w-2xl lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-dim/80 border border-accent/20 rounded-full text-xs font-mono text-accent tracking-wider mb-6 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              FP SUPERIOR · STI
            </motion.div>

            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-5"
            >
              {nameText.split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  className={char === " " ? "" : "inline-block"}
                  style={
                    i >= 6 && i <= 16
                      ? {
                          background:
                            "linear-gradient(135deg, #00f0ff, #4d79ff)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : undefined
                  }
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl mb-2"
            >
              Sistemas de Telecomunicaciones e Informáticos
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="text-sm text-dim font-mono tracking-wide mb-8"
            >
              Ciberseguridad · Redes · Infraestructura Crítica
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              <span className="px-3 py-1.5 bg-accent/5 border border-accent/10 rounded-lg text-xs font-mono text-accent">
                Python Avanzado
              </span>
              <span className="px-3 py-1.5 bg-cyan/5 border border-cyan/10 rounded-lg text-xs font-mono text-cyan">
                Java · JavaScript
              </span>
              <span className="px-3 py-1.5 bg-accent/5 border border-accent/10 rounded-lg text-xs font-mono text-accent">
                C · C++
              </span>
              <span className="px-3 py-1.5 bg-cyan/5 border border-cyan/10 rounded-lg text-xs font-mono text-cyan">
                Fibra Óptica
              </span>
              <span className="px-3 py-1.5 bg-accent/5 border border-accent/10 rounded-lg text-xs font-mono text-accent">
                Redes · GPON
              </span>
              <span className="px-3 py-1.5 bg-cyan/5 border border-cyan/10 rounded-lg text-xs font-mono text-cyan">
                Raspberry Pi
              </span>
              <span className="px-3 py-1.5 bg-purple-dim border border-purple/20 rounded-lg text-xs font-mono text-purple">
                OpenCL
              </span>
              <span className="px-3 py-1.5 bg-accent-cyan-dim border border-accent-cyan/20 rounded-lg text-xs font-mono text-accent-cyan">
                LM Studio
              </span>
              <span className="px-3 py-1.5 bg-accent-dim border border-accent/20 rounded-lg text-xs font-mono text-accent">
                Hermes Agent
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton
                href="/CIBER/cv-lucas-mendez.pdf"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider text-white rounded-lg overflow-hidden"
                strength={0.3}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 rounded-lg" />
                <span className="relative z-10 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar CV
                </span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </motion.span>
              </MagneticButton>
              <MagneticButton
                href="https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider text-muted border border-border rounded-lg hover:text-text hover:border-border-light"
                strength={0.3}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div
            ref={photoRef}
            style={{ y: photoParallax }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 mx-auto lg:mx-0 lg:order-1"
          >
            <div className="photo-frame w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96">
              <div
                className="w-full h-full transition-transform duration-200 ease-out"
                style={{
                  transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px) scale(1.02)`,
                }}
              >
                <img
                  src="/CIBER/foto-lucas.jpg"
                  alt="Lucas Méndez Díez"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="reflection" />
              <div className="vignette" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: "rgba(139,148,158,0.4)" }}>
          Scroll
        </span>
        <div className="w-px h-8 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
          <motion.div
            className="w-full h-1/2 rounded-full"
            style={{ background: "linear-gradient(to bottom, #00f0ff, transparent)" }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
