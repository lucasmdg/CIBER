"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionPortalProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  chapter?: string;
  reducedMotion?: boolean;
}

export default function SectionPortal({
  children,
  id,
  className = "",
  chapter,
}: SectionPortalProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = portalRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(el, { opacity: 1, scale: 1, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.92, filter: "blur(8px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`relative ${className}`}
    >
      {chapter && (
        <div className="chapter-number" aria-hidden="true">
          {chapter}
        </div>
      )}
      <div ref={portalRef} className="relative z-10">
        {children}
      </div>
    </div>
  );
}
