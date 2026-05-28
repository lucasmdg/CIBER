"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import SystemTerminal from "@/components/SystemTerminal";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Journey from "@/components/Journey";
import SystemProjects from "@/components/SystemProjects";
import LearningRoadmap from "@/components/LearningRoadmap";
import Contact from "@/components/Contact";
import SystemFooter from "@/components/SystemFooter";

const Navigation = dynamic(() => import("@/components/Navigation"), { ssr: false });

export default function Home() {
  return (
    <main className="relative z-10">
      <Navigation />
      <Hero />
      <SystemTerminal />
      <About />
      <TechStack />
      <Journey />
      <SystemProjects />
      <LearningRoadmap />
      <Contact />
      <SystemFooter />
    </main>
  );
}
