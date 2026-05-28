"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const MagneticButton = ({ children, onClick, className }: MagneticButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleMouse = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      setPos({ x: dx * 0.3, y: dy * 0.3 });
    };

    btn.addEventListener("mousemove", handleMouse);
    btn.addEventListener("mouseleave", () => {
      setPos({ x: 0, y: 0 });
      setIsHovering(false);
    });
    btn.addEventListener("mouseenter", () => setIsHovering(true));

    return () => {
      btn.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={cn("magnetic-btn", className)}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.4s var(--ease-spring), border-color 0.4s var(--ease-out-circ), background 0.4s var(--ease-out-circ), color 0.4s var(--ease-out-circ)",
      }}
    >
      <div className="btn-bg" />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default MagneticButton;
