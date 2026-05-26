"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const TUNNEL_DEPTH = 100;
export const CAMERA_START_Z = -10;
export const CAMERA_END_Z = TUNNEL_DEPTH - 10;

export interface SectionZRange {
  z: number;
  halfWidth: number;
}

export function useScrollCamera() {
  const cameraZ = useRef(CAMERA_START_Z);
  const scrollVelocity = useRef(0);
  const cameraRef = useRef<{ z: number }>({ z: CAMERA_START_Z });
  const velocityRef = useRef(0);
  const activeSection = useRef<string | null>(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          const z = CAMERA_START_Z + progress * TUNNEL_DEPTH;
          cameraRef.current.z = z;
          cameraZ.current = z;

          const vel = (progress - lastProgressRef.current) * 100;
          scrollVelocity.current = Math.abs(vel);
          velocityRef.current = Math.abs(vel);
          lastProgressRef.current = progress;
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const getSectionOpacity = useCallback((sectionZ: SectionZRange) => {
    const camZ = cameraZ.current;
    const dist = Math.abs(camZ - sectionZ.z);
    if (dist < sectionZ.halfWidth * 0.5) return 1;
    if (dist < sectionZ.halfWidth * 1.5) {
      return 1 - (dist - sectionZ.halfWidth * 0.5) / sectionZ.halfWidth;
    }
    return 0;
  }, []);

  return {
    getCameraZ: () => cameraZ.current,
    getScrollVelocity: () => velocityRef.current,
    getSectionOpacity,
    activeSection,
  };
}
