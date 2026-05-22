"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { Download } from "lucide-react";
import { LinkedinIcon } from "@/lib/icons";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoParallax = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const photoRef = useRef<HTMLDivElement>(null);

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
      className="relative min-h-screen flex items-center pt-28 pb-16 section-container"
      onMouseMove={handleMouseMove}
    >
      <motion.div style={{ opacity }} className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-dim/80 border border-accent/20 rounded-full text-xs font-mono text-accent tracking-wider mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              FP SUPERIOR · STI
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-5">
              Lucas{" "}
              <span className="gradient-text">Méndez Díez</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl mb-2">
              Sistemas de Telecomunicaciones e Informáticos
            </p>
            <p className="text-sm text-dim font-mono tracking-wide mb-8">
              Ciberseguridad · Redes · Infraestructura Crítica
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
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
            </div>

            <div className="flex flex-wrap gap-4">
              <MagneticButton href="/cv-lucas-mendez.pdf">
                <Download size={16} />
                Descargar CV
              </MagneticButton>
              <MagneticButton
                href="https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/"
                variant="ghost"
              >
                <LinkedinIcon style={{ width: 16, height: 16 }} />
                LinkedIn
              </MagneticButton>
            </div>
          </div>

          <motion.div
            ref={photoRef}
            style={{ y: photoParallax }}
            className="flex-shrink-0"
          >
            <div className="photo-frame w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              <div
                className="w-full h-full transition-transform duration-300 ease-out"
                style={{
                  transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px) scale(1.02)`,
                }}
              >
                <img
                  src="/CIBER/foto-lucas.jpg"
                  alt="Lucas Méndez Díez"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(59,130,246,0.05),rgba(34,211,238,0.05));gap:8px;"><div style="width:64px;height:64px;border-radius:50%;background:rgba(59,130,246,0.1);display:flex;align-items:center;justify-content:center;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><span style="font-size:11px;font-family:monospace;color:#6b7280;letter-spacing:0.1em;">FOTO</span></div>`;
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-dim/50">Scroll</span>
        <div className="w-px h-8 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
          <motion.div
            className="w-full h-1/2 rounded-full"
            style={{ background: "linear-gradient(to bottom, #3b82f6, transparent)" }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
