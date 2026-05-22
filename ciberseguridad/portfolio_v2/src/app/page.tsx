import MeshBackground from "@/components/MeshBackground";
import Hero from "@/components/Hero";
import TelecomLab from "@/components/TelecomLab";
import Projects from "@/components/Projects";
import Roadmap from "@/components/Roadmap";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative">
      <MeshBackground />
      <Hero />
      <TelecomLab />
      <Projects />
      <Roadmap />
      <Contact />
    </main>
  );
}
