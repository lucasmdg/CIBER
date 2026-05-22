"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "ghost";
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const dist = Math.sqrt(x * x + y * y);
    const maxDist = 120;
    const strength = Math.min(dist / maxDist, 1);
    setPosition({ x: x * 0.2 * strength, y: y * 0.2 * strength });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const base =
    variant === "primary"
      ? "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20"
      : "border border-border text-muted hover:text-text hover:border-border-light";

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.1 }}
      className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-wider rounded-xl transition-colors cursor-pointer ${base} ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <button onClick={onClick}>{content}</button>;
}
