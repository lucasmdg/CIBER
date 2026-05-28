"use client";

import { motion } from "framer-motion";

const roadmapData = [
  {
    phase: "PHASE 01",
    title: "Foundations",
    status: "COMPLETE",
    statusColor: "text-green/70",
    dotClass: "status-dot-online",
    items: [
      "Password encryption (Fernet, AES-256)",
      "TCP port scanning & socket programming",
      "Hash cracking (MD5, SHA-256)",
      "Log analysis & pattern detection",
      "File integrity monitoring",
      "Network sniffing (Scapy L3)",
      "Caesar cipher & Base64 encoding",
    ],
  },
  {
    phase: "PHASE 02",
    title: "Intermediate Operations",
    status: "COMPLETE",
    statusColor: "text-green/70",
    dotClass: "status-dot-online",
    items: [
      "Multithreaded scanning (65K ports)",
      "Directory bruteforce & web login cracking",
      "Deep packet inspection & credential detection",
      "ARP poisoning detection",
      "Intrusion Detection System (IDS)",
      "Web vulnerability scanning (XSS, SQLi)",
      "SSH brute-force automation",
      "Real-time log monitoring (SIEM-style)",
    ],
  },
  {
    phase: "PHASE 03",
    title: "Advanced Systems",
    status: "ACTIVE",
    statusColor: "text-cyan/70",
    dotClass: "status-dot-active",
    items: [
      "Command & Control (C2) simulation",
      "Modular exploitation framework",
      "AES-256-GCM password management",
      "Network IDS with threat intelligence",
      "Automated web pentesting",
      "Privilege escalation auditing",
      "Malware analysis (entropy, IOCs)",
      "Ransomware simulation (controlled)",
      "Threat hunting & correlation",
      "Full Red Team simulation (6 phases)",
    ],
  },
  {
    phase: "PHASE 04",
    title: "Future Operations",
    status: "QUEUED",
    statusColor: "text-dim",
    dotClass: "",
    items: [
      "APT agent with sandbox evasion",
      "ML-based malware classification",
      "Complete Red Team framework with C2",
    ],
  },
];

export default function LearningRoadmap() {
  return (
    <section id="roadmap" className="relative py-20 px-6">
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
              LEARNING PROGRESSION — SYSTEM ROADMAP
            </span>
          </div>
          <div className="signal-line w-full" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-green/20 via-cyan/20 to-transparent" />

          <div className="space-y-8">
            {roadmapData.map((phase, phaseIdx) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: phaseIdx * 0.1 }}
                className="relative pl-8"
              >
                {/* Node dot */}
                <div className="absolute left-0 top-1">
                  <div className={`status-dot ${phase.dotClass}`}
                    style={!phase.dotClass ? { background: "#484f58", boxShadow: "none", animation: "none" } : {}}
                  />
                </div>

                {/* Phase header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[9px] tracking-widest text-dim/40 font-mono">
                    {phase.phase}
                  </span>
                  <span className="text-xs text-text/80 font-sans">
                    {phase.title}
                  </span>
                  <span className={`text-[9px] tracking-widest font-mono ${phase.statusColor}`}>
                    [{phase.status}]
                  </span>
                </div>

                {/* Items */}
                <div className="sys-panel rounded-lg p-4">
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                    {phase.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 py-1">
                        <span className={`text-[8px] mt-0.5 ${
                          phase.status === "QUEUED" ? "text-dim/30" :
                          phase.status === "ACTIVE" ? "text-cyan/40" : "text-green/40"
                        }`}>
                          {phase.status === "QUEUED" ? "○" : phase.status === "ACTIVE" ? "◈" : "✓"}
                        </span>
                        <span className={`text-[11px] font-mono leading-relaxed ${
                          phase.status === "QUEUED" ? "text-dim/40" : "text-text/60"
                        }`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
