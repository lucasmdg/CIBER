"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import AIWorkflow from "@/components/AIWorkflow";
import Projects from "@/components/Projects";
import Journey from "@/components/Journey";
import Personality from "@/components/Personality";
import Goals from "@/components/Goals";

const CyberAsset = dynamic(() => import("@/components/CyberAsset"), { ssr: false });

export default function Home() {
  return (
    <main className="relative">
      <CyberAsset />
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,8,15,0.4) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(6,8,15,0.3) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative z-10">
        <Hero />
        <About />
        <TechStack />
        <AIWorkflow />
        <Projects />
        <Journey />
        <Personality />
        <Goals />
        {/* Contact */}
      </div>
    </main>
  );
}
