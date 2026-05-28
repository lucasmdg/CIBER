"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "hero", label: "CORE", num: "00" },
  { id: "terminal", label: "TERMINAL", num: "01" },
  { id: "about", label: "ABOUT", num: "02" },
  { id: "stack", label: "STACK", num: "03" },
  { id: "ai-workflow", label: "AI_FLOW", num: "04" },
  { id: "journey", label: "JOURNEY", num: "05" },
  { id: "projects", label: "PROJECTS", num: "06" },
  { id: "roadmap", label: "ROADMAP", num: "07" },
  { id: "contact", label: "CONTACT", num: "08" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.getBoundingClientRect().top <= window.innerHeight / 3) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop: HUD edge nav — right side vertical */}
      <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="group flex items-center gap-2 text-right"
          >
            <span className={`text-[8px] font-mono tracking-widest transition-all duration-300 ${
              activeSection === item.id ? "text-cyan/70 translate-x-0" : "text-dim/20 translate-x-2 group-hover:translate-x-0 group-hover:text-dim/50"
            }`}>
              {item.num}
            </span>
            <span className={`text-[9px] font-mono tracking-widest transition-all duration-300 ${
              activeSection === item.id ? "text-cyan" : "text-dim/30 group-hover:text-dim/60"
            }`}>
              {item.label}
            </span>
            <div className={`w-4 h-px transition-all duration-300 ${
              activeSection === item.id ? "bg-cyan" : "bg-dim/10 group-hover:bg-dim/30"
            }`} />
          </button>
        ))}
      </nav>

      {/* Mobile: Top bar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-500 ${
          scrolled ? "sys-panel" : ""
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
            <div className="status-dot status-dot-online" style={{ width: 4, height: 4 }} />
            <span className="text-[9px] font-mono tracking-widest text-green/60">LUCAS_SYS</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[9px] font-mono tracking-widest text-dim/50 hover:text-cyan transition-colors"
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="px-5 py-4 space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex items-center gap-3 w-full text-left ${
                      activeSection === item.id ? "text-cyan" : "text-dim/50"
                    }`}
                  >
                    <span className="text-[8px] font-mono text-dim/30">{item.num}</span>
                    <span className="text-[10px] font-mono tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
