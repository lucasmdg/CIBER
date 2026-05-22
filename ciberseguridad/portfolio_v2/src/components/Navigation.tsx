"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LinkedinIcon } from "@/lib/icons";

const sections = [
  { id: "hero", label: "Inicio" },
  { id: "telecom", label: "Infraestructura" },
  { id: "projects", label: "Proyectos" },
  { id: "roadmap", label: "Roadmap" },
  { id: "contact", label: "Contacto" },
];

export default function Navigation() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const offsets = sections.map((s) => {
        const el = document.getElementById(s.id);
        return { id: s.id, top: el?.offsetTop ?? 0 };
      });
      const scrollY = window.scrollY + 200;
      for (let i = offsets.length - 1; i >= 0; i--) {
        if (scrollY >= offsets[i].top) {
          setActive(offsets[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(5,5,8,0.75)] backdrop-blur-xl border-b border-white/[0.04]"
          : "bg-transparent"
      }`}
    >
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        <a href="#hero" className="text-sm font-mono tracking-widest text-muted hover:text-text transition-colors">
          LUCAS MÉNDEZ
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`relative px-4 py-2 text-xs tracking-wider transition-colors ${
                active === s.id ? "text-text" : "text-muted hover:text-text"
              }`}
            >
              {active === s.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-accent-dim rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{s.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wider text-white bg-accent/10 border border-accent/20 rounded-lg hover:bg-accent/20 transition-colors"
          >
            <LinkedinIcon style={{ width: 14, height: 14 }} />
            LinkedIn
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-muted hover:text-text transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/[0.04] bg-[rgba(5,5,8,0.95)] backdrop-blur-xl"
          >
            <div className="section-container py-4 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-muted hover:text-text hover:bg-accent-dim rounded-lg transition-colors"
                >
                  {s.label}
                </a>
              ))}
              <a
                href="https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-sm text-accent hover:bg-accent-dim rounded-lg transition-colors"
              >
                <LinkedinIcon style={{ width: 16, height: 16 }} /> LinkedIn
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
