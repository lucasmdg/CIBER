"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "a";
  href?: string;
}

export default function GlowCard({ children, className = "", as = "div", href }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const card = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setMouse({ x: 50, y: 50 }); }}
      className={`glass-panel card-hover rounded-2xl overflow-hidden relative ${
        hover ? "shadow-xl shadow-accent/5" : ""
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {hover && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-150"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, rgba(59,130,246,0.06) 0%, transparent 50%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  if (as === "a" && href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
      >
        {card}
      </a>
    );
  }

  return card;
}
