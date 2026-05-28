"use client";

import { ReactLenis } from "lenis/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import HUDOverlay from "./HUDOverlay";

const CanvasBackground = dynamic(() => import("./CanvasBackground"), { ssr: false });
const LoadingScreen = dynamic(() => import("./LoadingScreen"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <LoadingScreen onFinish={() => setLoading(false)} />
      ) : (
        <>
          <CanvasBackground />
          <div className="wallace-beam wallace-beam-1" />
          <div className="wallace-beam wallace-beam-2" />
          <HUDOverlay />
          <div className="scanline-overlay" />
          <ReactLenis root options={{ lerp: 0.06, wheelMultiplier: 0.9 }}>
            {children}
          </ReactLenis>
        </>
      )}
    </>
  );
}
