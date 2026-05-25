"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { IconCpu, IconBolt, IconGhost, IconArrowRight } from "@tabler/icons-react";

const tools = [
  {
    name: "Cursor",
    role: "Editor IA",
    desc: "Entorno de desarrollo con IA integrada. Edición contextual, generación de código y refactorización asistida.",
    color: "#58a6ff",
    icon: null,
  },
  {
    name: "Claude",
    role: "Asistente IA",
    desc: "Modelo de Anthropic para análisis de código, documentación técnica y resolución de problemas complejos.",
    color: "#bc8cff",
    icon: null,
  },
  {
    name: "Copilot",
    role: "Autocompletado",
    desc: "Sugerencias de código en tiempo real. Automatización de patrones repetitivos y generación de tests.",
    color: "#79c0ff",
    icon: null,
  },
  {
    name: "ChatGPT",
    role: "Research IA",
    desc: "Investigación técnica, resolución de dudas de arquitectura, generación de scripts y prototipado rápido.",
    color: "#58a6ff",
    icon: null,
  },
  {
    name: "Perplexity",
    role: "Búsqueda IA",
    desc: "Investigación técnica con fuentes verificadas. Ayuda a mantener el stack actualizado y resolver bugs.",
    color: "#79c0ff",
    icon: null,
  },
  {
    name: "Windsurf",
    role: "Flujo IA",
    desc: "Entorno de desarrollo con flujo de trabajo IA nativo. Integración de agentes y automatización de tareas.",
    color: "#3b82f6",
    icon: null,
  },
  {
    name: "LM Studio",
    role: "Inferencia Local",
    desc: "Ejecución de modelos de lenguaje locales (LLaMA, Mistral, Phi). Prototipado rápido sin dependencia de APIs externas.",
    color: "#22d3ee",
    icon: IconCpu,
  },
  {
    name: "OpenCL",
    role: "Cómputo Paralelo",
    desc: "Programación heterogénea para acelerar tareas de IA y procesamiento de datos. Optimización de kernels en GPU/CPU.",
    color: "#3b82f6",
    icon: IconBolt,
  },
  {
    name: "Hermes Agent",
    role: "Agente Autónomo",
    desc: "Framework de agentes de IA para automatización de tareas complejas. Ejecución de workflows autónomos con decisión contextual.",
    color: "#bc8cff",
    icon: IconGhost,
  },
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
  {
    title: "Documentación con IA",
    desc: "Generación de documentación técnica, comentarios de código y READMEs con asistencia contextual.",
  },
  {
    title: "Workflow Automation",
    desc: "Automatización de tareas repetitivas, pipelines de CI/CD y scripts de productividad con IA generativa.",
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

function IconCursor({ size }: { size?: number }) {
  return (
    <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="M13 13l6 6" />
    </svg>
  );
}

function IconClaude({ size }: { size?: number }) {
  return (
    <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconCopilot({ size }: { size?: number }) {
  return (
    <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

const fallbackIcons = [IconCursor, IconClaude, IconCopilot];

function ToolCard({ tool, index }: { tool: typeof tools[0]; index: number }) {
  const Icon = tool.icon || fallbackIcons[index % fallbackIcons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="card-hover glass-panel rounded-xl p-5 group"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
          style={{
            backgroundColor: `${tool.color}10`,
            border: `1px solid ${tool.color}20`,
          }}
        >
          <div style={{ color: tool.color }}>
            <Icon size={18} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-text">{tool.name}</h3>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${tool.color}15`,
                color: tool.color,
              }}
            >
              {tool.role}
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed mt-2 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {tool.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AIWorkflow() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="ai-workflow" className="section-spacing relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="section-badge inline-flex">AI WORKFLOW</div>
          <h2 className="section-title">
            Ecosistema{" "}
            <span className="gradient-text-purple">Inteligente</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Herramientas de IA integradas en mi flujo de trabajo diario para
            desarrollo, investigación y automatización
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t, i) => (
              <ToolCard key={t.name} tool={t} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <div className="glass-panel rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-6 text-center">
                Pipeline de desarrollo con IA
              </h3>
              <div className="flex items-center justify-center gap-0 overflow-x-auto pb-2 scrollbar-none">
                {pipelineStages.map((stage, i) => (
                  <div key={stage.name} className="flex items-center shrink-0">
                    <div className="glass-panel rounded-lg px-3 py-2.5 text-center min-w-[80px] border-accent/10">
                      <div className="text-xs font-semibold text-accent">
                        {i + 1}
                      </div>
                      <div className="text-xs font-semibold text-text mt-0.5">
                        {stage.name}
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">
                        {stage.desc}
                      </div>
                    </div>
                    {i < pipelineStages.length - 1 && (
                      <div className="flex items-center mx-1 md:mx-2">
                        <IconArrowRight size={16} className="text-accent/30 shrink-0" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <div className="glass-panel rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-6 text-center">
                Flujos de trabajo con IA
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflowItems.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.05,
                    }}
                    className="p-4 rounded-xl bg-accent-dim/30 border border-accent/5 hover:border-accent/15 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <h4 className="text-xs font-mono text-accent tracking-wider uppercase">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
