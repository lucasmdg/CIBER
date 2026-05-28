"use client";

import { useRef, useEffect } from "react";
import Lenis from "lenis";
import LoadingScreen from "@/components/LoadingScreen";
import PersistentCorridor from "@/components/PersistentCorridor";
import NavDots from "@/components/NavDots";
import SectionPortal from "@/components/SectionPortal";
import TerminalText from "@/components/TerminalText";
import MagneticButton from "@/components/MagneticButton";
import StatusBadge from "@/components/StatusBadge";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";

// Scroll progress ref
const scrollProgress = { position: 0, progress: 0 };

// Section components
const Hero = () => (
  <SectionPortal id="hero" className="!min-h-screen">
    <div className="threshold-center z-10 relative flex flex-col items-center justify-center gap-10">
      {/* Status badge */}
      <StatusBadge label="active — still learning" variant="learning" />

      {/* Main heading */}
      <div className="text-center space-y-6">
        <h1 className="narrative text-5xl md:text-7xl lg:text-8xl font-medium text-text-primary text-balance tracking-tight">
          Still learning.
          <br />
          <span className="text-gradient-cyan">Building anyway.</span>
        </h1>

        <TerminalText
          text="Telecommunications & Systems"
          speed={40}
          terminalClass="narrative text-lg md:text-xl text-text-secondary"
        />
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8 text-xs terminal text-text-tertiary">
        <span>scroll to explore</span>
        <div className="w-px h-6 bg-white/10" />
        <span>telecom · systems · cybersecurity</span>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-6 h-10 border border-white/10 rounded-full flex justify-center">
        <div className="w-1 h-2 bg-signal-cyan rounded-full mt-2 animate-bounce" style={{ animationDuration: "2s" }} />
      </div>
    </div>
  </SectionPortal>
);

const About = () => {
  const { ref } = useIntersectionReveal(0.15);
  return (
    <SectionPortal id="about">
      <div className="threshold-center z-10 relative flex flex-col items-center gap-12 max-w-3xl">
        <div ref={ref} className="section-reveal space-y-8 text-center">
          <div className="space-y-4">
            <p className="narrative text-2xl md:text-3xl text-text-primary text-balance leading-tight">
              <span className="text-signal-cyan">Junior telecommunications student.</span>
              <br />
              Focused on systems infrastructure,
              <br />
              network engineering, and cybersecurity fundamentals.
            </p>
          </div>

          <div className="terminal text-sm md:text-base text-text-secondary max-w-2xl mx-auto space-y-3">
            <p className="flex items-start gap-3 text-left">
              <span className="text-signal-cyan mt-1">▸</span>
              <span>Studying telecommunications & systems at university</span>
            </p>
            <p className="flex items-start gap-3 text-left">
              <span className="text-signal-green mt-1">▸</span>
              <span>Building lab environments and practicing networking</span>
            </p>
            <p className="flex items-start gap-3 text-left">
              <span className="text-signal-amber mt-1">▸</span>
              <span>Documenting learning in public — projects, configs, notes</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <MagneticButton onClick={() => document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" })}>
              <span>See the progression</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </SectionPortal>
  );
};

const Roadmap = () => {
  const { ref } = useIntersectionReveal(0.15);

  const milestones = [
    {
      phase: "Phase 0",
      title: "Foundation",
      terminal: "Basics of networking, Linux, and systems fundamentals",
      status: "complete" as const,
      color: "green",
    },
    {
      phase: "Phase 1",
      title: "Telecommunications",
      terminal: "Fiber optics, networking protocols, telecommunications infrastructure",
      status: "active" as const,
      color: "cyan",
    },
    {
      phase: "Phase 2",
      title: "Systems & Maintenance",
      terminal: "IT operations, hardware maintenance, system configuration",
      status: "active" as const,
      color: "cyan",
    },
    {
      phase: "Phase 3",
      title: "Cybersecurity",
      terminal: "Security labs, network defense, vulnerability assessment",
      status: "learning" as const,
      color: "amber",
    },
    {
      phase: "Phase 4",
      title: "Enterprise Path",
      terminal: "Aiming toward large-scale tech environments",
      status: "learning" as const,
      color: "cyan",
    },
  ];

  const statusMap = {
    complete: "text-signal-green" as const,
    active: "text-signal-cyan" as const,
    learning: "text-signal-amber" as const,
  };

  return (
    <SectionPortal id="roadmap" className="!min-h-screen">
      <div className="threshold-center z-10 relative flex flex-col items-center gap-16 max-w-4xl">
        <div ref={ref} className="section-reveal text-center space-y-4">
          <p className="terminal text-xs text-text-tertiary tracking-widest uppercase">Learning Progression</p>
          <h2 className="narrative text-3xl md:text-5xl text-text-primary text-balance">
            Step by step, not all at once
          </h2>
        </div>

        <div className="w-full max-w-2xl space-y-0">
          {milestones.map((m, i) => (
            <div key={m.phase} className="section-reveal" style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="flex items-start gap-4 md:gap-6 group">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${statusMap[m.status]} shadow-lg`}
                    style={{ boxShadow: `0 0 12px var(--color-signal-${m.color})` }}
                  />
                  {i < milestones.length - 1 && <div className="w-px h-full bg-white/5 mt-2" />}
                </div>

                {/* Content */}
                <div className="flex-1 pb-12">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="terminal text-xs text-text-tertiary">{m.phase}</span>
                    <StatusBadge label={m.status} variant={m.status === "complete" ? "active" : m.status === "learning" ? "learning" : "active"} />
                  </div>
                  <h3 className="narrative text-lg md:text-xl text-text-primary mb-2">{m.title}</h3>
                  <TerminalText
                    text={m.terminal}
                    speed={25}
                    terminalClass="terminal text-xs md:text-sm text-text-secondary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionPortal>
  );
};

const Exposure = () => {
  const { ref } = useIntersectionReveal(0.15);

  const areas = [
    {
      title: "Telecom & Networking",
      terminal: "Fiber optics, network protocols, telecommunications infrastructure, routing & switching",
      icon: "◎",
      color: "cyan",
    },
    {
      title: "Systems & Maintenance",
      terminal: "IT operations, hardware maintenance, system configuration, server administration",
      icon: "▣",
      color: "green",
    },
    {
      title: "Cybersecurity Labs",
      terminal: "Network defense, vulnerability assessment, security tools, penetration testing fundamentals",
      icon: "◈",
      color: "amber",
    },
    {
      title: "AI & Tooling",
      terminal: "Prompt engineering, automation, GitHub Copilot, AI-assisted development workflows",
      icon: "◉",
      color: "cyan",
    },
  ];

  return (
    <SectionPortal id="exposure">
      <div className="threshold-center z-10 relative flex flex-col items-center gap-16 max-w-5xl">
        <div ref={ref} className="section-reveal text-center space-y-4">
          <p className="terminal text-xs text-text-tertiary tracking-widest uppercase">Technical Exposure</p>
          <h2 className="narrative text-3xl md:text-5xl text-text-primary text-balance">
            Working inside systems, not just reading about them
          </h2>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {areas.map((a, i) => (
            <div
              key={a.title}
              ref={ref}
              className="section-reveal glass-panel p-8 flex flex-col gap-4 hover:border-signal-cyan/20 transition-all duration-500"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl text-signal-${a.color}`}>{a.icon}</span>
                <h3 className="narrative text-lg text-text-primary">{a.title}</h3>
              </div>
              <TerminalText
                text={a.terminal}
                speed={30}
                terminalClass="terminal text-xs md:text-sm text-text-secondary"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionPortal>
  );
};

const Projects = () => {
  const { ref } = useIntersectionReveal(0.15);

  const projects = [
    {
      name: "Fiber Optic Lab Setup",
      terminal: "Physical fiber splicing, OTDR testing, signal loss measurement",
      context: "Hands-on fiber optic testing and splicing in a lab environment. Practical exposure to physical layer telecom infrastructure.",
      link: "#",
    },
    {
      name: "Network Configuration Lab",
      terminal: "VLANs, routing protocols, network segmentation via simulation tools",
      context: "Configuring and troubleshooting network topologies in a controlled lab environment. Focus on real-world networking scenarios.",
      link: "#",
    },
    {
      name: "IT Maintenance Log",
      terminal: "Hardware inventory, preventive maintenance procedures, system documentation",
      context: "Documenting IT operations: server maintenance, hardware diagnostics, and systematic troubleshooting approaches.",
      link: "#",
    },
    {
      name: "GitHub Projects",
      terminal: "Configuration files, scripts, networking notes, cybersecurity exercises",
      context: "Open documentation of learning. Scripts, configs, and exercises that show technical progression over time.",
      link: "#",
    },
  ];

  return (
    <SectionPortal id="projects">
      <div className="threshold-center z-10 relative flex flex-col items-center gap-16 max-w-4xl">
        <div ref={ref} className="section-reveal text-center space-y-4">
          <p className="terminal text-xs text-text-tertiary tracking-widest uppercase">Selected Work</p>
          <h2 className="narrative text-3xl md:text-5xl text-text-primary text-balance">
            Real exposure, not theoretical exercises
          </h2>
        </div>

        <div className="w-full space-y-4">
          {projects.map((p, i) => (
            <div
              key={p.name}
              ref={ref}
              className="section-reveal glass-panel-elevated p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 hover:border-signal-cyan/15 transition-all duration-500"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex-1 space-y-3">
                <h3 className="narrative text-lg text-text-primary">{p.name}</h3>
                <TerminalText
                  text={p.terminal}
                  speed={25}
                  terminalClass="terminal text-xs text-text-secondary"
                />
                <p className="narrative text-sm text-text-secondary">{p.context}</p>
              </div>
              <a href={p.link} className="shrink-0">
                <MagneticButton>
                  <span>View</span>
                </MagneticButton>
              </a>
            </div>
          ))}
        </div>
      </div>
    </SectionPortal>
  );
};

const GitHub = () => {
  const { ref } = useIntersectionReveal(0.15);

  const repos = [
    { name: "fiber-optic-lab", lang: "Python", desc: "Fiber splicing calculations, OTDR data analysis" },
    { name: "network-configs", lang: "Shell", desc: "VLAN configs, routing tables, network documentation" },
    { name: "security-labs", lang: "Bash", desc: "Penetration testing exercises, vulnerability assessments" },
    { name: "it-maintenance", lang: "Markdown", desc: "Hardware inventory, maintenance procedures, logs" },
    { name: "ai-tools", lang: "Python", desc: "Prompt engineering experiments, automation scripts" },
  ];

  return (
    <SectionPortal id="github">
      <div className="threshold-center z-10 relative flex flex-col items-center gap-16 max-w-4xl">
        <div ref={ref} className="section-reveal text-center space-y-4">
          <p className="terminal text-xs text-text-tertiary tracking-widest uppercase">Proof Layer</p>
          <h2 className="narrative text-3xl md:text-5xl text-text-primary text-balance">
            GitHub as the system log
          </h2>
          <p className="narrative text-lg text-text-secondary max-w-xl mx-auto">
            Not decoration. Not a portfolio of polished demos. Active work that shows progression over time.
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-3">
          {repos.map((r, i) => (
            <div
              key={r.name}
              ref={ref}
              className="section-reveal glass-panel p-5 flex items-center gap-5 hover:border-signal-cyan/15 transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-3 h-3 rounded-full bg-signal-cyan/60" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="narrative text-sm text-text-primary font-medium">{r.name}</span>
                  <span className="terminal text-xs text-text-tertiary">·</span>
                  <span className="terminal text-xs text-text-tertiary">{r.lang}</span>
                </div>
                <p className="terminal text-xs text-text-secondary">{r.desc}</p>
              </div>
              <a href="#" className="text-signal-cyan hover:text-signal-green transition-colors">
                ↗
              </a>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <MagneticButton onClick={() => window.open("https://github.com/lucasmendez-dev", "_blank")}>
            <span>View all on GitHub</span>
          </MagneticButton>
        </div>
      </div>
    </SectionPortal>
  );
};

const Contact = () => (
  <SectionPortal id="contact" className="!min-h-screen">
    <div className="threshold-center z-10 relative flex flex-col items-center gap-10">
      <div className="text-center space-y-6">
        <p className="terminal text-xs text-text-tertiary tracking-widest uppercase">Get in Touch</p>
        <h2 className="narrative text-3xl md:text-5xl text-text-primary text-balance">
          Interested in seeing what I'm building?
        </h2>
        <p className="narrative text-lg text-text-secondary max-w-lg mx-auto">
          Open to opportunities in telecommunications, systems infrastructure, and cybersecurity.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <MagneticButton onClick={() => window.open("mailto:contact@lucasmendez.dev")}>
          <span>Send email</span>
        </MagneticButton>
        <MagneticButton onClick={() => window.open("https://linkedin.com/in/lucasmendez", "_blank")}>
          <span>LinkedIn</span>
        </MagneticButton>
      </div>

      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className="terminal text-xs text-text-tertiary">
          © 2025 Lucas Méndez · Built with intention
        </p>
      </div>
    </div>
  </SectionPortal>
);

// Main page
export default function Home() {
  const scrollRef = useRef(scrollProgress);

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <main className="relative">
      {/* Loading screen */}
      <LoadingScreen />

      {/* 3D persistent environment */}
      <PersistentCorridor scrollProgress={scrollRef} />

      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-px bg-gradient-to-r from-signal-cyan to-signal-green z-[200] transition-all duration-150"
        style={{ width: `${scrollProgress.progress * 100}%` }}
      />

      {/* Navigation dots */}
      <NavDots />

      {/* Sections */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Roadmap />
        <Exposure />
        <Projects />
        <GitHub />
        <Contact />
      </div>
    </main>
  );
}
