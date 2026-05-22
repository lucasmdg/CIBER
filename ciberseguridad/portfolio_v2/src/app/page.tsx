"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import TelecomLab from "@/components/TelecomLab";
import Projects from "@/components/Projects";
import Roadmap from "@/components/Roadmap";
import Contact from "@/components/Contact";

const CyberAsset = dynamic(() => import("@/components/CyberAsset"), { ssr: false });

export default function Home() {
  return (
    <main className="relative">
      <CyberAsset />
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(10,15,26,0.3) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(10,15,26,0.2) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative z-10">
        <Hero />
        <TelecomLab />
        <Projects />
        <Roadmap />
        <Contact />
      </div>
    </main>
  );
}
