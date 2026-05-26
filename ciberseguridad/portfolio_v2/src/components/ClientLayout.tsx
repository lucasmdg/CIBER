"use client";

import { ReactLenis } from "lenis/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import Navigation from "./Navigation";
import LoadingScreen from "./LoadingScreen";

const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const PersistentCorridor = dynamic(() => import("./PersistentCorridor"), { ssr: false });
const ScrollDistortion = dynamic(() => import("./ScrollDistortion"), { ssr: false });
const AudioToggle = dynamic(() => import("./AudioToggle"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <LoadingScreen onFinish={() => setLoading(false)} />
      ) : (
        <>
          <PersistentCorridor />
          <ScrollDistortion />
          <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 1.1 }}>
            <Cursor />
            <Navigation />
            {children}
            <AudioToggle />
          </ReactLenis>
        </>
      )}
    </>
  );
}
