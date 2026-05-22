"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Globe, CodeXml, ExternalLink } from "lucide-react";

const links = [
  {
    href: "https://www.linkedin.com/in/lucas-m%C3%A9ndez-34a0a53a1/",
    label: "LinkedIn",
    icon: Globe,
    description: "Conecta conmigo profesionalmente",
  },
  {
    href: "https://github.com/lucasmdg/CIBER",
    label: "GitHub",
    icon: CodeXml,
    description: "Explora mis proyectos y código",
  },
  {
    href: "mailto:lucas@example.com",
    label: "Email",
    icon: Mail,
    description: "Envíame un mensaje directo",
  },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="contact" ref={ref} className="section-spacing bg-gray-50/50">
      <div className="section-container">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium text-accent tracking-wide uppercase mb-4 block">
            Contacto
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight mb-4">
            Hablemos
          </h2>
          <p className="text-text-secondary">
            Siempre abierto a nuevas oportunidades, retos y conexiones.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto grid sm:grid-cols-3 gap-4">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="card-hover p-6 flex flex-col items-center text-center gap-3 group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Icon
                  size={24}
                  className="text-text-secondary group-hover:text-accent transition-colors duration-200"
                />
                <div>
                  <span className="text-sm font-medium text-text group-hover:text-accent transition-colors duration-200 inline-flex items-center gap-1">
                    {link.label}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <p className="text-xs text-text-tertiary mt-1">
                    {link.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} Lucas Méndez Díez
          </p>
        </motion.div>
      </div>
    </section>
  );
}
