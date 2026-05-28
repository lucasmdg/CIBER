"use client";

import { motion } from "framer-motion";
import {
  IconBrandPython,
  IconBrandJavascript,
  IconFileTypeCss,
  IconBrandReact,
  IconBrandNextjs,
  IconBrandThreejs,
  IconBrandTailwind,
  IconBrandDocker,
  IconBrandGit,
  IconBrandNodejs,
  IconCloudComputing,
  IconShieldLock,
  IconNetwork,
  IconRouter,
  IconTerminal2,
  IconCpu,
  IconBolt,
  IconGhost,
  IconRobotFace,
} from "@tabler/icons-react";

const categories = [
  {
    title: "LANGUAGES (L_SYS)",
    skills: [
      { name: "Python", status: "ADVANCED", val: "85%", dotClass: "status-dot-active", icon: IconBrandPython },
      { name: "C / C++", status: "INTERMEDIATE", val: "60%", dotClass: "status-dot-warning", icon: IconCpu },
      { name: "JavaScript", status: "ADVANCED", val: "75%", dotClass: "status-dot-active", icon: IconBrandJavascript },
      { name: "Java", status: "INTERMEDIATE", val: "55%", dotClass: "status-dot-warning", icon: IconCpu },
      { name: "CSS/HTML", status: "COMPLETED", val: "90%", dotClass: "status-dot-online", icon: IconFileTypeCss },
    ],
  },
  {
    title: "WEB FRAMEWORKS (WF_SYS)",
    skills: [
      { name: "Next.js", status: "ACTIVE", val: "80%", dotClass: "status-dot-active", icon: IconBrandNextjs },
      { name: "React", status: "ACTIVE", val: "80%", dotClass: "status-dot-active", icon: IconBrandReact },
      { name: "Tailwind CSS", status: "COMPLETED", val: "90%", dotClass: "status-dot-online", icon: IconBrandTailwind },
      { name: "Three.js (R3F)", status: "ACTIVE", val: "70%", dotClass: "status-dot-active", icon: IconBrandThreejs },
      { name: "Node.js", status: "ACTIVE", val: "75%", dotClass: "status-dot-active", icon: IconBrandNodejs },
    ],
  },
  {
    title: "NETWORKS & SYSTEMS (NET_SYS)",
    skills: [
      { name: "Linux Administration", status: "ADVANCED", val: "80%", dotClass: "status-dot-active", icon: IconTerminal2 },
      { name: "Docker Containers", status: "ACTIVE", val: "65%", dotClass: "status-dot-warning", icon: IconBrandDocker },
      { name: "Git / Versioning", status: "COMPLETED", val: "85%", dotClass: "status-dot-online", icon: IconBrandGit },
      { name: "Bash Scripting", status: "COMPLETED", val: "80%", dotClass: "status-dot-online", icon: IconTerminal2 },
      { name: "TCP/IP Networking", status: "ADVANCED", val: "85%", dotClass: "status-dot-active", icon: IconNetwork },
    ],
  },
  {
    title: "CYBERSECURITY MODULES (SEC_SYS)",
    skills: [
      { name: "Offensive Pentesting", status: "ADVANCED", val: "80%", dotClass: "status-dot-active", icon: IconShieldLock },
      { name: "Cloud Security", status: "LEARNING", val: "50%", dotClass: "status-dot-warning", icon: IconCloudComputing },
      { name: "GPON / FTTH Telecoms", status: "ADVANCED", val: "85%", dotClass: "status-dot-active", icon: IconRouter },
      { name: "IoT Hardware (R-Pi)", status: "ADVANCED", val: "80%", dotClass: "status-dot-active", icon: IconCpu },
    ],
  },
  {
    title: "AI & ACCELERATION (AI_SYS)",
    skills: [
      { name: "Cursor Editor", status: "ACTIVE", val: "95%", dotClass: "status-dot-online", icon: IconRobotFace },
      { name: "Claude AI Workflow", status: "ACTIVE", val: "90%", dotClass: "status-dot-online", icon: IconTerminal2 },
      { name: "LM Studio (LLMs)", status: "ACTIVE", val: "80%", dotClass: "status-dot-active", icon: IconBolt },
      { name: "Hermes Agent Framework", status: "ACTIVE", val: "75%", dotClass: "status-dot-active", icon: IconGhost },
      { name: "OpenCL Acceleration", status: "LEARNING", val: "50%", dotClass: "status-dot-warning", icon: IconCpu },
    ],
  },
];

export default function TechStack() {
  return (
    <section id="stack" className="relative py-20 px-6">
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
              SYSTEM.INVENTORY.MODULES
            </span>
          </div>
          <div className="signal-line w-full" />
        </motion.div>

        {/* System inventory layout */}
        <div className="space-y-8">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ci * 0.05 }}
              className="sys-panel rounded-lg p-5"
            >
              <h3 className="text-[10px] font-mono tracking-widest text-dim/60 mb-4 uppercase">
                {cat.title}
              </h3>
              
              <div className="divide-y divide-border">
                {cat.skills.map((skill, si) => {
                  const Icon = skill.icon;
                  return (
                    <div key={skill.name} className="flex items-center gap-4 py-2.5 first:pt-0 last:pb-0 group">
                      <div className="w-6 h-6 rounded border border-border flex items-center justify-center shrink-0 group-hover:border-cyan/20 transition-colors">
                        <Icon size={12} className="text-dim/50 group-hover:text-cyan transition-colors" />
                      </div>
                      
                      <span className="text-xs text-text/80 group-hover:text-cyan transition-colors flex-1 font-mono">
                        {skill.name}
                      </span>
                      
                      <span className={`text-[9px] font-mono tracking-widest hidden sm:inline text-dim/40`}>
                        {skill.val}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-mono tracking-widest ${
                          skill.dotClass === "status-dot-online" ? "text-green/60" :
                          skill.dotClass === "status-dot-active" ? "text-cyan/60" : "text-amber/60"
                        }`}>
                          [{skill.status}]
                        </span>
                        <div className={`status-dot shrink-0 ${skill.dotClass}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
