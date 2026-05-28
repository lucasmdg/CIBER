"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { projectsData } from "@/data/projects";

/* ── Command responses ── */
const HELP_TEXT = `Available commands:
  help        Show this help message
  projects    List all system projects
  status      Show current system status
  skills      Display active skill modules
  contact     Show contact endpoints
  about       System operator information
  clear       Clear terminal output
  whoami      Current user identity
  ping        Test connection latency`;

const STATUS_TEXT = `┌─────────────────────────────────────┐
│  SYSTEM STATUS REPORT               │
├─────────────────────────────────────┤
│  Network:     ONLINE [200 OK]       │
│  TLS:         v1.3 ACTIVE           │
│  Uptime:      99.97%                │
│  Projects:    ${String(projectsData.length).padStart(2, " ")} loaded             │
│  Firewall:    ENABLED               │
│  DNS:         RESOLVING             │
│  Last scan:   0 threats detected    │
└─────────────────────────────────────┘`;

const ABOUT_TEXT = `Operator: Lucas Méndez Díez
Role:     Telecommunications & Systems Student
Track:    FP Superior — STI (Sistemas de Telecomunicaciones e Informáticos)
Focus:    Cybersecurity · Networking · Fiber Optics · Infrastructure
Location: Spain
State:    Still learning. Always building.`;

const SKILLS_TEXT = `[ACTIVE MODULES]
  ├── Languages
  │   ├── Python .............. [■■■■■■■■░░] ADVANCED
  │   ├── C / C++ ............. [■■■■■■░░░░] INTERMEDIATE
  │   ├── JavaScript .......... [■■■■■■■░░░] ADVANCED
  │   └── Java ................ [■■■■■░░░░░] INTERMEDIATE
  ├── Networking
  │   ├── TCP/IP .............. [■■■■■■■■░░] ADVANCED
  │   ├── GPON / Fiber ........ [■■■■■■■░░░] ADVANCED
  │   ├── Routing (BGP/OSPF) .. [■■■■■░░░░░] LEARNING
  │   └── Wireless ............ [■■■■■■░░░░] INTERMEDIATE
  ├── Security
  │   ├── Pentesting .......... [■■■■■■■░░░] ADVANCED
  │   ├── IDS/NIDS ............ [■■■■■■░░░░] INTERMEDIATE
  │   ├── Forensics ........... [■■■■■░░░░░] LEARNING
  │   └── Threat Hunting ...... [■■■■■■░░░░] INTERMEDIATE
  └── Systems
      ├── Linux Admin ......... [■■■■■■■░░░] ADVANCED
      ├── Raspberry Pi ........ [■■■■■■■■░░] ADVANCED
      └── Docker .............. [■■■■░░░░░░] LEARNING`;

const CONTACT_TEXT = `[CONTACT ENDPOINTS]
  GitHub:   https://github.com/lucasmdg/CIBER
  LinkedIn: https://linkedin.com/in/lucas-méndez-34a0a53a1
  Email:    Available on request
  CV:       /CIBER/cv-lucas-mendez.pdf`;

type OutputLine = {
  type: "input" | "output" | "error" | "system";
  text: string;
};

export default function SystemTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<OutputLine[]>([
    { type: "system", text: "LUCAS_SYS Terminal v2.0 — Type 'help' for available commands." },
    { type: "system", text: "─────────────────────────────────────────────────────────" },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: OutputLine[] = [{ type: "input", text: `lucas@sys:~$ ${cmd}` }];

    switch (trimmed) {
      case "help":
        newLines.push({ type: "output", text: HELP_TEXT });
        break;
      case "clear":
        setHistory([]);
        return;
      case "status":
        newLines.push({ type: "output", text: STATUS_TEXT });
        break;
      case "about":
      case "whoami":
        newLines.push({ type: "output", text: trimmed === "whoami" ? "lucas — telecommunications & systems operator" : ABOUT_TEXT });
        break;
      case "skills":
        newLines.push({ type: "output", text: SKILLS_TEXT });
        break;
      case "contact":
        newLines.push({ type: "output", text: CONTACT_TEXT });
        break;
      case "ping":
        newLines.push({ type: "output", text: `PING lucas-sys.net (127.0.0.1): 56 data bytes\n64 bytes: icmp_seq=0 ttl=64 time=${(Math.random() * 5 + 1).toFixed(1)}ms\n64 bytes: icmp_seq=1 ttl=64 time=${(Math.random() * 5 + 1).toFixed(1)}ms\n--- lucas-sys.net ping statistics ---\n2 packets transmitted, 2 packets received, 0.0% packet loss` });
        break;
      case "projects": {
        const grouped: Record<string, typeof projectsData> = {};
        projectsData.forEach((p) => {
          if (!grouped[p.level]) grouped[p.level] = [];
          grouped[p.level].push(p);
        });
        let output = `[PROJECT REGISTRY — ${projectsData.length} entries]\n`;
        const levelOrder = ["basico", "intermedio", "avanzado", "futuro", "varios"];
        const levelLabels: Record<string, string> = {
          basico: "BASIC",
          intermedio: "INTERMEDIATE",
          avanzado: "ADVANCED",
          futuro: "FUTURE",
          varios: "MISC",
        };
        for (const level of levelOrder) {
          const items = grouped[level];
          if (!items) continue;
          output += `\n  ── ${levelLabels[level]} (${items.length}) ──\n`;
          items.forEach((p, i) => {
            output += `  ${String(i + 1).padStart(2, " ")}. ${p.title.padEnd(30)} [${p.tags.join(", ")}]\n`;
          });
        }
        newLines.push({ type: "output", text: output });
        break;
      }
      default:
        if (trimmed) {
          newLines.push({ type: "error", text: `command not found: ${trimmed}` });
        }
    }

    setHistory((prev) => [...prev, ...newLines]);
    setCmdHistory((prev) => [cmd, ...prev]);
    setCmdIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const next = Math.min(cmdIndex + 1, cmdHistory.length - 1);
        setCmdIndex(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIndex > 0) {
        setCmdIndex(cmdIndex - 1);
        setInput(cmdHistory[cmdIndex - 1]);
      } else {
        setCmdIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <section id="terminal" className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="status-dot status-dot-online" />
            <span className="text-[10px] tracking-widest text-green/60 uppercase font-mono">
              INTERACTIVE CONSOLE
            </span>
          </div>
          <div className="signal-line w-full" />
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="sys-panel-active rounded-lg overflow-hidden"
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red/60" />
              <div className="w-2 h-2 rounded-full bg-amber/60" />
              <div className="w-2 h-2 rounded-full bg-green/60" />
            </div>
            <span className="text-[9px] tracking-widest text-dim uppercase">
              lucas@sys — bash — 80×24
            </span>
            <div />
          </div>

          {/* Terminal output */}
          <div
            ref={scrollRef}
            className="p-4 h-80 overflow-y-auto scrollbar-none font-mono text-xs leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((line, i) => (
              <div key={i} className={`whitespace-pre-wrap mb-0.5 ${
                line.type === "input" ? "text-cyan/70" :
                line.type === "error" ? "text-red/80" :
                line.type === "system" ? "text-amber/50" :
                "text-text/70"
              }`}>
                {line.text}
              </div>
            ))}

            {/* Active input line */}
            <div className="flex items-center gap-0 mt-1">
              <span className="text-green/60">lucas@sys</span>
              <span className="text-dim">:</span>
              <span className="text-cyan/60">~</span>
              <span className="text-dim">$ </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-text/90 caret-cyan font-mono text-xs"
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-[9px] text-dim/40 tracking-widest text-center mt-3 uppercase"
        >
          Try: help · projects · status · skills · contact · ping
        </motion.p>
      </div>
    </section>
  );
}
