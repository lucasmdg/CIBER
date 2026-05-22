"use client";

import MagneticButton from "./MagneticButton";
import { Download } from "lucide-react";
import { LinkedinIcon } from "@/lib/icons";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-12 section-container section-spacing"
    >
      <div className="w-full max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-dim/80 border border-accent/20 rounded-full text-xs font-mono text-accent tracking-wider mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          FP SUPERIOR · STI
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-4">
          Lucas{" "}
          <span className="gradient-text">Méndez Díez</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl mb-3">
          Sistemas de Telecomunicaciones e Informáticos
        </p>
        <p className="text-sm text-dim font-mono tracking-wide mb-8">
          Ciberseguridad · Redes · Infraestructura Crítica
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          <span className="px-3 py-1.5 bg-accent/5 border border-accent/10 rounded-lg text-xs font-mono text-accent">
            Python Avanzado
          </span>
          <span className="px-3 py-1.5 bg-cyan/5 border border-cyan/10 rounded-lg text-xs font-mono text-cyan">
            Java · JavaScript
          </span>
          <span className="px-3 py-1.5 bg-teal/5 border border-teal/10 rounded-lg text-xs font-mono text-teal">
            C · C++
          </span>
          <span className="px-3 py-1.5 bg-accent/5 border border-accent/10 rounded-lg text-xs font-mono text-accent">
            Fibra Óptica
          </span>
          <span className="px-3 py-1.5 bg-cyan/5 border border-cyan/10 rounded-lg text-xs font-mono text-cyan">
            Redes · GPON
          </span>
          <span className="px-3 py-1.5 bg-teal/5 border border-teal/10 rounded-lg text-xs font-mono text-teal">
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dim">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-border overflow-hidden">
          <div className="w-full h-1/2 bg-accent/40 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
