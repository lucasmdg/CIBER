"use client";

import SectionPortal from "@/components/SectionPortal";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import AIWorkflow from "@/components/AIWorkflow";
import Projects from "@/components/Projects";
import Journey from "@/components/Journey";
import Personality from "@/components/Personality";
import Goals from "@/components/Goals";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative z-10">
      <SectionPortal chapter="00">
        <Hero />
      </SectionPortal>
      <SectionPortal id="about" chapter="01">
        <About />
      </SectionPortal>
      <SectionPortal id="tech" chapter="02">
        <TechStack />
      </SectionPortal>
      <SectionPortal id="workflow" chapter="03">
        <AIWorkflow />
      </SectionPortal>
      <SectionPortal id="projects" chapter="04">
        <Projects />
      </SectionPortal>
      <SectionPortal id="journey" chapter="05">
        <Journey />
      </SectionPortal>
      <SectionPortal id="personality" chapter="06">
        <Personality />
      </SectionPortal>
      <SectionPortal id="goals" chapter="07">
        <Goals />
      </SectionPortal>
      <SectionPortal id="contact" chapter="08">
        <Contact />
      </SectionPortal>
    </main>
  );
}
