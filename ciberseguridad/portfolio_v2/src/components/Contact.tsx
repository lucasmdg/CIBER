"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const links = [
  {
    href: "https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/",
    label: "LINKEDIN_PORT",
    desc: "Conecta profesionalmente con el operador.",
    protocol: "HTTPS // TLS 1.3",
    status: "ESTABLISHED",
    color: "text-cyan/70",
    dotClass: "status-dot-active",
  },
  {
    href: "https://github.com/lucasmdg/CIBER",
    label: "GITHUB_PORT",
    desc: "Explora la infraestructura de código y repositorios.",
    protocol: "HTTPS // SSH",
    status: "LISTENING",
    color: "text-green/70",
    dotClass: "status-dot-online",
  },
  {
    href: "mailto:lucasmdg10@gmail.com",
    label: "MAIL_PORT",
    desc: "Establece una línea directa de comunicación segura.",
    protocol: "SMTP // TLS",
    status: "READY",
    color: "text-amber/70",
    dotClass: "status-dot-warning",
  },
];

export default function Contact() {
  const [latency, setLatency] = useState("0.0ms");

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(`${(Math.random() * 8 + 2).toFixed(1)}ms`);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="contact" className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="status-dot status-dot-active" />
            <span className="text-[10px] tracking-widest text-cyan/60 uppercase font-mono">
              SYSTEM.COMMUNICATION.GATEWAYS
            </span>
          </div>
          <div className="signal-line w-full" />
        </motion.div>

        {/* Network Gateways inventory */}
        <div className="space-y-4 mb-8">
          {links.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="sys-panel rounded-lg p-5 group hover:border-cyan/15 transition-all duration-300"
            >
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <span className="text-xs font-bold text-text/80 group-hover:text-cyan transition-colors">
                      {link.label}
                    </span>
                    <span className="text-[9px] text-dim/50">
                      ({link.protocol})
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    {link.desc}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 shrink-0 sm:self-center">
                  <div className="text-right hidden sm:block">
                    <span className="text-[9px] text-dim/40 block">SECURE_PING</span>
                    <span className="text-cyan/60 text-[10px]">{latency}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] tracking-widest font-bold ${link.color}`}>
                      [{link.status}]
                    </span>
                    <div className={`status-dot shrink-0 ${link.dotClass}`} />
                  </div>
                  
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-dim/40 group-hover:text-cyan transition-colors shrink-0"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17L17 7" />
                  </svg>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Console footer detail */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="sys-panel rounded-lg p-5 text-center font-mono text-[11px]"
        >
          <div className="text-dim/40 mb-1">SECURE ENCRYPTION TUNNEL ACTIVE</div>
          <div className="text-text/60 leading-relaxed max-w-lg mx-auto">
            Todas las conexiones salientes se dirigen a través de puertos cifrados estándar SSL/TLS. 
            El código fuente completo de esta consola y los módulos integrados están auditados y alojados de manera abierta en GitHub.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
