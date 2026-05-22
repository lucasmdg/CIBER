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
