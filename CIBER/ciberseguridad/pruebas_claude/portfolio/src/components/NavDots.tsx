"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "hero", label: "" },
  { id: "about", label: "about" },
  { id: "roadmap", label: "roadmap" },
  { id: "exposure", label: "exposure" },
  { id: "projects", label: "projects" },
  { id: "github", label: "github" },
  { id: "contact", label: "contact" },
];

const NavDots = () => {
  const [active, setActive] = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-100 hidden lg:flex flex-col gap-4">
      {sections.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-500",
            i === active.current
              ? "bg-signal-cyan scale-150 shadow-[0_0_8px_rgba(0,212,255,0.5)]"
              : "bg-white/10 hover:bg-white/20"
          )}
        />
      ))}
    </nav>
  );
};

export default NavDots;
