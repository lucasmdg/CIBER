import { type Variants } from "framer-motion";
import { tokens } from "./design-tokens";

let prefersReducedMotion = false;

if (typeof window !== "undefined") {
  prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", (e) => {
      prefersReducedMotion = e.matches;
    });
}

export function getReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return prefersReducedMotion;
}

export function withReducedMotion<T>(normal: T, reduced: T): T {
  return getReducedMotion() ? reduced : normal;
}

export const motionPresets = {
  fadeInUp: (delay = 0): Variants => ({
    hidden: { opacity: 0, y: withReducedMotion(24, 0) },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: tokens.duration.slow,
        ease: tokens.easing.cinematic,
        delay,
      },
    },
  }),

  fadeInLeft: (delay = 0): Variants => ({
    hidden: { opacity: 0, x: withReducedMotion(-24, 0) },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: tokens.duration.slow,
        ease: tokens.easing.cinematic,
        delay,
      },
    },
  }),

  fadeInRight: (delay = 0): Variants => ({
    hidden: { opacity: 0, x: withReducedMotion(24, 0) },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: tokens.duration.slow,
        ease: tokens.easing.cinematic,
        delay,
      },
    },
  }),

  staggerContainer: (staggerDelay = 0.08): Variants => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: withReducedMotion(staggerDelay, 0),
        delayChildren: 0.1,
      },
    },
  }),

  staggerItem: (delay = 0): Variants => ({
    hidden: { opacity: 0, y: withReducedMotion(16, 0) },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: tokens.duration.normal,
        ease: tokens.easing.smooth,
        delay,
      },
    },
  }),

  scaleIn: (delay = 0): Variants => ({
    hidden: { opacity: 0, scale: withReducedMotion(0.95, 1) },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: tokens.duration.normal,
        ease: tokens.easing.smooth,
        delay,
      },
    },
  }),
};

export const gsapPresets = {
  scrollTrigger: {
    start: "top 85%",
    end: "bottom 20%",
    toggleActions: "play none none reverse" as const,
  },
  timelineDefaults: {
    ease: tokens.easing.cinematic,
    duration: 0.8,
  },
};

export const reducedMotionGSAP = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
