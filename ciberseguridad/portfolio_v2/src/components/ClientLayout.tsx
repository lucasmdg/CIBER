"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import Navigation from "./Navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 1.1 }}>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      <Navigation />
      {children}
    </ReactLenis>
  );
}
