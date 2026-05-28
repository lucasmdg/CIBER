"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { IconCpu, IconBolt, IconGhost, IconArrowRight, IconRobotFace, IconTerminal2 } from "@tabler/icons-react";

const tools = [
  {
    name: "Cursor",
    role: "AI_EDITOR",
    desc: "Entorno de desarrollo con IA integrada. Edición contextual, generación de código y refactorización asistida.",
    color: "cyan",
    icon: IconRobotFace,
  },
  {
    name: "Claude",
    role: "AI_ASSISTANT",
    desc: "Modelo de Anthropic para análisis de código, documentación técnica y resolución de problemas complejos.",
    color: "green",
    icon: IconTerminal2,
  },
  {
    name: "Copilot",
    role: "AUTOCOMPLETE",
    desc: "Sugerencias de código en tiempo real. Automatización de patrones repetitivos y generación de tests.",
    color: "cyan",
    icon: IconCpu,
  },
  {
    name: "LM Studio",
    role: "LOCAL_INFERENCE",
    desc: "Ejecución de modelos de lenguaje locales (LLaMA, Mistral, Phi). Prototipado rápido sin dependencia de APIs externas.",
    color: "amber",
    icon: IconBolt,
  },
  {
    name: "Hermes Agent",
    role: "AUTONOMOUS_AGENT",
    desc: "Framework de agentes de IA para automatización de tareas complejas. Ejecución de workflows autónomos con decisión contextual.",
    color: "cyan",
    icon: IconGhost,
  },
  {
    name: "OpenCL Acceleration",
    role: "PARALLEL_COMPUTE",
    desc: "Programación heterogénea para acelerar tareas de IA y procesamiento de datos. Optimización de kernels en GPU/CPU.",
    color: "amber",
    icon: IconCpu,
  },
];

const pipelineStages = [
  { name: "Idea", desc: "Concepto" },
  { name: "Prompt", desc: "Ingeniería" },
  { name: "Code", desc: "Generación" },
  { name: "Review", desc: "Revisión" },
  { name: "Test", desc: "Validación" },
  { name: "Deploy", desc: "Despliegue" },
];

const workflowItems = [
  {
    title: "AI-Assisted Development",
    desc: "Codificación asistida con generación de boilerplate, refactorización inteligente y debugging automatizado.",
  },
  {
    title: "Prompt Engineering",
    desc: "Diseño de prompts efectivos para obtener código de calidad, documentación precisa y soluciones optimizadas.",
  },
  {
    title: "AI Code Review",
    desc: "Revisiones de código automatizadas que detectan vulnerabilidades, code smells y oportunidades de mejora.",
  },
  {
    title: "Automated Debugging",
    desc: "Análisis de errores y logs asistido por IA para identificar causas raíz y sugerir correcciones.",
  },
];

export default function AIWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="ai-workflow" className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto" ref={containerRef}>
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
              SYSTEM.INTELLIGENCE.INTEGRATION
            </span>
          </div>
          <div className="signal-line w-full" />
        </motion.div>

        {/* Tools grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {tools.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="sys-panel rounded-lg p-5 group hover:border-cyan/15 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded border border-border flex items-center justify-center shrink-0 group-hover:border-cyan/20 transition-colors">
                    <Icon size={14} className={`
                      ${t.color === "cyan" ? "text-cyan/60" : 
                        t.color === "green" ? "text-green/60" : "text-amber/60"}
                    `} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono font-bold text-text/80 group-hover:text-cyan transition-colors">
                        {t.name}
                      </span>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 border rounded-sm tracking-widest uppercase
                        ${t.color === "cyan" ? "text-cyan/50 border-cyan/10 bg-cyan-dim" : 
                          t.color === "green" ? "text-green/50 border-green/10 bg-green-dim" : 
                          "text-amber/50 border-amber/10 bg-amber-dim"}`}
                      >
                        {t.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed font-mono">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pipeline block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="sys-panel rounded-lg p-5 mb-8"
        >
          <h3 className="text-[10px] font-mono tracking-widest text-dim/60 mb-4 uppercase">
            AI WORKFLOW PIPELINE (PIPELINE_SYS)
          </h3>
          <div className="flex items-center justify-start gap-0 overflow-x-auto pb-2 scrollbar-none">
            {pipelineStages.map((stage, i) => (
              <div key={stage.name} className="flex items-center shrink-0">
                <div className="border border-border rounded px-3 py-2 text-center min-w-[90px]">
                  <div className="text-[9px] font-mono text-cyan/70">
                    STAGE_{String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-xs font-mono text-text/80 mt-0.5">
                    {stage.name}
                  </div>
                  <div className="text-[9px] text-dim/50 font-mono mt-0.5">
                    {stage.desc}
                  </div>
                </div>
                {i < pipelineStages.length - 1 && (
                  <div className="flex items-center mx-2">
                    <IconArrowRight size={12} className="text-dim/30 shrink-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Workflow capabilities */}
        <div className="grid sm:grid-cols-2 gap-4">
          {workflowItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="p-4 rounded border border-border bg-surface/40 hover:border-cyan/10 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan/50 status-dot-active" />
                <h4 className="text-[10px] font-mono text-cyan/70 tracking-widest uppercase">
                  {item.title}
                </h4>
              </div>
              <p className="text-[11px] font-mono text-text/60 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
