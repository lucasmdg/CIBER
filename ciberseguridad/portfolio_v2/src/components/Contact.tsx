"use client";

import { motion } from "framer-motion";
import GlowCard from "./GlowCard";
import { Mail, ArrowUpRight, Globe, CodeXml } from "lucide-react";

const links = [
  {
    href: "https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/",
    label: "LinkedIn",
    icon: Globe,
    desc: "Conecta profesionalmente",
  },
  {
    href: "https://github.com/lucasmdg/CIBER",
    label: "GitHub",
    icon: CodeXml,
    desc: "Explora mi código y proyectos",
  },
  {
    href: "mailto:lucas@example.com",
    label: "Email",
    icon: Mail,
    desc: "Envíame un mensaje directo",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section-spacing relative">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-dim border border-accent/20 rounded-full text-xs font-mono text-accent tracking-wider mb-4">
            CONTACTO
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Conecta{" "}
            <span className="gradient-text">conmigo</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm">
            Estoy abierto a oportunidades, colaboraciones y retos técnicos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <GlowCard key={l.label} as="a" href={l.href} className="p-6 text-center group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center group-hover:border-accent/40 transition-colors">
                    <Icon size={22} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5">{l.label}</h3>
                    <p className="text-[11px] text-muted">{l.desc}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-dim group-hover:text-accent transition-colors" />
                </div>
              </GlowCard>
            );
          })}
        </div>
      </div>

      <footer className="mt-20 border-t border-white/[0.04]">
        <div className="section-container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-dim font-mono">
          <span>&copy; {new Date().getFullYear()} Lucas Méndez Díez</span>
          <span className="tracking-wider">FP SUPERIOR STI · CIBERSEGURIDAD</span>
        </div>
      </footer>
    </section>
  );
}
