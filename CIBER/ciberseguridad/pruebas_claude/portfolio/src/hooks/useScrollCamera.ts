import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollCamera(
  scrollData: React.MutableRefObject<{ position: number; progress: number }>,
  sectionProgress: React.MutableRefObject<Map<string, number>>
) {
  useEffect(() => {
    // Register scroll-driven camera Z position
    const sections = [
      "#hero", "#about", "#roadmap", "#exposure",
      "#projects", "#github", "#contact"
    ];

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          sectionProgress.current.set(section, 1);
        },
        onLeave: () => {
          sectionProgress.current.set(section, 0);
        },
        onEnterBack: () => {
          sectionProgress.current.set(section, 1);
        },
        onLeaveBack: () => {
          sectionProgress.current.set(section, 0);
        },
      });
    });

    // Global scroll progress for camera Z
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        scrollData.current.progress = self.progress;
      },
    });
  }, [scrollData, sectionProgress]);
}
