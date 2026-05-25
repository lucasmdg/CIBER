"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navigation from "./Navigation";
import LoadingScreen from "./LoadingScreen";

const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const AudioToggle = dynamic(() => import("./AudioToggle"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  // LoadingScreen manages its own lifecycle and calls onFinish when ready

  if (loading) {
    return <LoadingScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 1.1 }}>
      <Cursor />
      <Navigation />
      {children}
      <AudioToggle />
    </ReactLenis>
  );
}
