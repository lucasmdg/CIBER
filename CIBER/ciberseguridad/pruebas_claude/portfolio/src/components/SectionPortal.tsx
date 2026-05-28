"use client";

import { useRef, ReactNode } from "react";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { cn } from "@/lib/utils";

interface SectionPortalProps {
  id: string;
  children: ReactNode;
  className?: string;
  ambientColor?: "cyan" | "green" | "amber" | "none";
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const SectionPortal = ({
  id,
  children,
  className,
  ambientColor = "none",
}: SectionPortalProps) => {
  const { ref } = useIntersectionReveal(0.1);
  const elRef = useRef<HTMLDivElement>(null);

  // Combine refs
  const setRefs = (node: HTMLDivElement) => {
    ref.ref.current = node;
    elRef.current = node;
  };

  const colorMap = {
    cyan: "bg-signal-cyan",
    green: "bg-signal-green",
    amber: "bg-signal-amber",
    none: "",
  };

  return (
    <section
      id={id}
      ref={setRefs}
      className={cn(
        "threshold-center relative overflow-hidden section-reveal",
        className
      )}
      style={{
        background: ambientColor !== "none"
          ? `radial-gradient(ellipse at 50% 50%, ${colorMap[ambientColor]}10 0%, transparent 70%), var(--color-bg)`
          : undefined,
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      {children}
    </section>
  );
};

export default SectionPortal;
