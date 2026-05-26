"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

const links = [
  {
    href: "https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/",
    label: "LinkedIn",
    desc: "Conecta profesionalmente",
    icon: "linkedin",
  },
  {
    href: "https://github.com/lucasmdg/CIBER",
    label: "GitHub",
    desc: "Explora mi código y proyectos",
    icon: "github",
  },
  {
    href: "mailto:lucas@example.com",
    label: "Email",
    desc: "Envíame un mensaje directo",
    icon: "email",
  },
];

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconGithub({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ContactCard({
  link,
  index,
}: {
  link: (typeof links)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const icons = {
    linkedin: IconLinkedin,
    github: IconGithub,
    email: function EmailIcon({ className }: { className?: string }) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    },
  };

  const Icon = icons[link.icon as keyof typeof icons];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <MagneticButton
        href={link.href}
        target={link.href.startsWith("http") ? "_blank" : undefined}
        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
        strength={0.25}
      >
        <div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => {
            setHover(false);
            setMouse({ x: 50, y: 50 });
          }}
          className="glass-panel card-hover rounded-xl p-6 text-center relative overflow-hidden"
          style={{
            transform: hover
              ? `perspective(800px) rotateX(${(mouse.y - 50) * -0.03}deg) rotateY(${(mouse.x - 50) * 0.03}deg)`
              : "perspective(800px) rotateX(0deg) rotateY(0deg)",
          }}
        >
          {hover && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(400px circle at ${mouse.x}% ${mouse.y}%, rgba(0,240,255,0.06) 0%, transparent 50%)`,
              }}
            />
          )}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center group-hover:border-accent/40 transition-all duration-300">
              <Icon className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-0.5">{link.label}</h3>
              <p className="text-[11px] text-muted">{link.desc}</p>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-dim group-hover:text-accent transition-colors"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17L17 7" />
            </svg>
          </div>
        </div>
      </MagneticButton>
    </motion.div>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="section-spacing relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="section-badge inline-flex">CONTACTO</div>
          <h2 className="section-title">
            Conecta{" "}
            <span className="gradient-text">conmigo</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Estoy abierto a oportunidades, colaboraciones y retos técnicos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {links.map((l, i) => (
            <ContactCard key={l.label} link={l} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <footer className="mt-20 border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-dim font-mono">
            <span>&copy; {new Date().getFullYear()} Lucas Méndez Díez</span>
            <span className="tracking-wider">FP SUPERIOR STI · CIBERSEGURIDAD</span>
            <span className="text-[10px] text-dim/60">
              Diseñado y construido por Lucas Méndez Díez
            </span>
          </footer>
        </motion.div>
      </div>
    </section>
  );
}
