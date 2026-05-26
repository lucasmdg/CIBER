"use client";

import { useEffect, useRef } from "react";

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9998,
  pointerEvents: "none",
  opacity: 0,
  willChange: "backdrop-filter",
};

export default function ScrollDistortion() {
  const ref = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(0);
  const smoothVel = useRef(0);

  useEffect(() => {
    let rafId: number;

    const onScroll = () => {
      const sy = window.scrollY;
      const vel = Math.abs(sy - lastScroll.current);
      lastScroll.current = sy;
      const el = ref.current;
      if (!el) return;

      smoothVel.current += (vel - smoothVel.current) * 0.06;

      const intensity = Math.min(smoothVel.current / 60, 1);

      if (intensity > 0.02) {
        const blur = intensity * 0.4;
        const hue = intensity * 1.5;
        const filter = `blur(${blur}px) hue-rotate(${hue}deg)`;
        el.style.backdropFilter = filter;
        (el.style as any).webkitBackdropFilter = filter;
        el.style.opacity = "1";
      } else if (smoothVel.current < 5) {
        el.style.backdropFilter = "blur(0px) hue-rotate(0deg)";
        (el.style as any).webkitBackdropFilter = "blur(0px) hue-rotate(0deg)";
        el.style.opacity = "0";
      }

      rafId = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} style={overlayStyle} />;
}
