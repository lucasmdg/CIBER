"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springConfigRing = { damping: 35, stiffness: 180, mass: 0.8 };

  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const ringSmoothX = useSpring(ringX, springConfigRing);
  const ringSmoothY = useSpring(ringY, springConfigRing);

  const ringRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    },
    [cursorX, cursorY, ringX, ringY]
  );

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const clickable = target.closest(
      "a, button, [role='button'], input, select, textarea, label"
    );
    if (clickable) {
      isHovering.current = true;
      if (ringRef.current) {
        ringRef.current.style.width = "48px";
        ringRef.current.style.height = "48px";
        ringRef.current.style.borderColor = "rgba(88, 166, 255, 0.2)";
        ringRef.current.style.backgroundColor = "rgba(88, 166, 255, 0.04)";
      }
    } else {
      isHovering.current = false;
      if (ringRef.current) {
        ringRef.current.style.width = "32px";
        ringRef.current.style.height = "32px";
        ringRef.current.style.borderColor = "rgba(255, 255, 255, 0.12)";
        ringRef.current.style.backgroundColor = "transparent";
      }
    }
  }, []);

  useEffect(() => {
    if (isTouchDevice()) return;
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [handleMouseMove, handleMouseOver]);

  if (isTouchDevice()) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-normal"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
      </motion.div>
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border transition-colors duration-300"
        style={{
          x: ringSmoothX,
          y: ringSmoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: "32px",
          height: "32px",
          borderColor: "rgba(255, 255, 255, 0.12)",
          backgroundColor: "transparent",
        }}
      />
    </>
  );
}
