"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Fiber Optic Particle Field ── */
function FiberParticles({ count = 120 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 22;
      pos[i3 + 1] = (Math.random() - 0.5) * 16;
      pos[i3 + 2] = (Math.random() - 0.5) * 8;

      vel[i3] = (Math.random() - 0.5) * 0.0008;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.0005;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.0005;

      // Cyan-dominant with occasional green and amber signals
      const r = Math.random();
      if (r < 0.75) {
        // Muted Cyan fiber signal
        col[i3] = 0;
        col[i3 + 1] = 0.5 + Math.random() * 0.15;
        col[i3 + 2] = 0.7;
      } else if (r < 0.9) {
        // Muted Green system truth
        col[i3] = 0;
        col[i3 + 1] = 0.7;
        col[i3 + 2] = 0.35;
      } else {
        // Muted Amber spike
        col[i3] = 0.7;
        col[i3 + 1] = 0.45;
        col[i3 + 2] = 0;
      }
    }
    return [pos, vel, col];
  }, [count]);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = clock.getElapsedTime();

    mouseRef.current.x += (pointer.x * viewport.width * 0.5 - mouseRef.current.x) * 0.015;
    mouseRef.current.y += (pointer.y * viewport.height * 0.5 - mouseRef.current.y) * 0.015;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Extremely slow base drift
      arr[i3] += velocities[i3] + Math.sin(t * 0.15 + i * 0.025) * 0.0008;
      arr[i3 + 1] += velocities[i3 + 1] + Math.cos(t * 0.1 + i * 0.03) * 0.0005;
      arr[i3 + 2] += velocities[i3 + 2];

      // Subtle mouse repulsion
      const dx = arr[i3] - mouseRef.current.x;
      const dy = arr[i3 + 1] - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 4) {
        const force = (4 - dist) * 0.0008;
        arr[i3] += dx * force;
        arr[i3 + 1] += dy * force;
      }

      // Boundary wrap
      if (arr[i3] > 11) arr[i3] = -11;
      if (arr[i3] < -11) arr[i3] = 11;
      if (arr[i3 + 1] > 8) arr[i3 + 1] = -8;
      if (arr[i3 + 1] < -8) arr[i3 + 1] = 8;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.65}
        vertexColors
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Signal Lines (fiber connections) ── */
function SignalLines({ count = 12 }: { count?: number }) {
  const linesRef = useRef<THREE.LineSegments>(null!);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 6); // 2 points per line
    for (let i = 0; i < count; i++) {
      const i6 = i * 6;
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 6;
      const len = 0.4 + Math.random() * 1.0;
      const angle = Math.random() * Math.PI * 2;

      pos[i6] = x;
      pos[i6 + 1] = y;
      pos[i6 + 2] = z;
      pos[i6 + 3] = x + Math.cos(angle) * len;
      pos[i6 + 4] = y + Math.sin(angle) * len * 0.3;
      pos[i6 + 5] = z;
    }
    return [pos];
  }, [count]);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const mat = linesRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.02 + Math.sin(clock.getElapsedTime() * 0.3) * 0.01;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count * 2} />
      </bufferGeometry>
      <lineBasicMaterial color="#00a0cc" transparent opacity={0.03} depthWrite={false} />
    </lineSegments>
  );
}

/* ── Main Canvas ── */
export default function CanvasBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[#050505]" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: false }}
        style={{ pointerEvents: "auto" }}
      >
        <color attach="background" args={["#030303"]} />
        <FiberParticles count={150} />
        <SignalLines count={15} />
      </Canvas>
    </div>
  );
}

