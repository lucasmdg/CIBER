"use client";

import { motion } from "framer-motion";
import { Target, Cloud, Shield, GitBranch, Share2, Lock } from "lucide-react";

const goals = [
  {
    area: "Seguridad en la Nube",
    icon: Cloud,
    items: [
      "Auditoría de infraestructuras AWS/Azure",
      "Automatización de compliance con Terraform",
      "Hardening de entornos cloud nativos",
    ],
    timeframe: "Q3 2026",
    color: "accent",
  },
  {
    area: "DevSecOps Pipeline",
    icon: GitBranch,
    items: [
      "Integración de SAST/DAST en CI/CD",
      "Escaneo automatizado de vulnerabilidades",
      "Políticas de seguridad como código",
    ],
    timeframe: "Q4 2026",
    color: "cyan",
  },
  {
    area: "Pentesting Avanzado",
    icon: Target,
    items: [
      "Laboratorio AD con explotación real",
      "Buffer overflow e ingeniería inversa",
      "Red Team completo con evasión EDR",
    ],
    timeframe: "Q1 2027",
    color: "teal",
  },
  {
    area: "Criptografía Aplicada",
    icon: Lock,
    items: [
      "Implementación de protocolos TLS 1.3",
      "Criptografía post-cuántica experimental",
      "Análisis de vulnerabilidades criptográficas",
    ],
    timeframe: "Q2 2027",
    color: "accent",
  },
  {
    area: "IoT Security Lab",
    icon: Share2,
    items: [
      "Pentesting de dispositivos IoT embedded",
      "Análisis de firmware y explotación",
      "Seguridad en redes LoRaWAN / Zigbee",
    ],
    timeframe: "Q3 2027",
    color: "cyan",
  },
  {
    area: "Defensa y Blue Team",
    icon: Shield,
    items: [
      "Despliegue de SIEM open-source (Wazuh)",
      "Automatización de respuesta a incidentes",
      "Honeypots y threat intelligence",
    ],
    timeframe: "Q4 2027",
    color: "teal",
  },
];

const colorMap: Record<string, string> = {
  accent: "border-accent/20 bg-accent/5 text-accent",
  cyan: "border-cyan/20 bg-cyan/5 text-cyan",
  teal: "border-teal/20 bg-teal/5 text-teal",
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="section-spacing relative">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-dim border border-accent/20 rounded-full text-xs font-mono text-accent tracking-wider mb-4">
            ROADMAP
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Hoja de Ruta{" "}
            <span className="gradient-text">Estratégica</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm">
            Próximos objetivos de desarrollo técnico y profesional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g, i) => {
            const Icon = g.icon;
            return (
              <motion.div
                key={g.area}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-panel rounded-2xl p-6 relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[g.color]}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono border ${colorMap[g.color]}`}>
                    {g.timeframe}
                  </span>
                </div>

                <h3 className="font-semibold text-sm mb-3">{g.area}</h3>

                <ul className="space-y-2">
                  {g.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted">
                      <span className="w-1 h-1 rounded-full bg-dim mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
