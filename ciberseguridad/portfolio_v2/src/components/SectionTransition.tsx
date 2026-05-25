"use client";

import { motion } from "framer-motion";
import { motionPresets } from "@/lib/motion.config";

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  id?: string;
}

export default function SectionTransition({
  children,
  className = "",
  direction = "up",
  delay = 0,
  id,
}: SectionTransitionProps) {
  const variants =
    direction === "none"
      ? motionPresets.fadeInUp(delay)
      : direction === "left"
        ? motionPresets.fadeInLeft(delay)
        : direction === "right"
          ? motionPresets.fadeInRight(delay)
          : motionPresets.fadeInUp(delay);

  return (
    <motion.div
      id={id}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
