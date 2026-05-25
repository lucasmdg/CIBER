"use client";

import { ReactLenis } from "lenis/react";
import dynamic from "next/dynamic";
import Navigation from "./Navigation";

const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const AudioToggle = dynamic(() => import("./AudioToggle"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 1.1 }}>
      <Cursor />
      <Navigation />
      {children}
      <AudioToggle />
    </ReactLenis>
  );
}
