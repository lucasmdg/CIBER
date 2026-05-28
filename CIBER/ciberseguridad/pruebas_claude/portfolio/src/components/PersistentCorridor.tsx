"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Stars, Torus } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";

// Fiber optics lines
function FiberLines({ count = 60 }: { count?: number }) {
  const points = useMemo(() => {
    const ps: THREE.Vector3[][] = [];
    for (let i = 0; i < count; i++) {
      const pts: THREE.Vector3[] = [];
      const segments = Math.floor(Math.random() * 8) + 4;
      for (let j = 0; j < segments; j++) {
        pts.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 8,
            -Math.random() * 20
          )
        );
      }
      ps.push(pts);
    }
    return ps;
  }, [count]);

  const lines = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 6); // 3 start + 3 end per line
    const colors = new Float32Array(points.length * 6);

    points.forEach((pts, i) => {
      const start = pts[0];
      const end = pts[pts.length - 1];
      positions[i * 6] = start.x;
      positions[i * 6 + 1] = start.y;
      positions[i * 6 + 2] = start.z;
      positions[i * 6 + 3] = end.x;
      positions[i * 6 + 4] = end.y;
      positions[i * 6 + 5] = end.z;

      const type = Math.random();
      if (type < 0.6) {
        colors[i * 6] = 0; colors[i * 6 + 1] = 0.83; colors[i * 6 + 2] = 1;
        colors[i * 6 + 3] = 0; colors[i * 6 + 4] = 0.83; colors[i * 6 + 5] = 1;
      } else if (type < 0.85) {
        colors[i * 6] = 0.2; colors[i * 6 + 1] = 0.78; colors[i * 6 + 2] = 0.35;
        colors[i * 6 + 3] = 0.2; colors[i * 6 + 4] = 0.78; colors[i * 6 + 5] = 0.35;
      } else {
        colors[i * 6] = 1; colors[i * 6 + 1] = 0.7; colors[i * 6 + 2] = 0.28;
        colors[i * 6 + 3] = 1; colors[i * 6 + 4] = 0.7; colors[i * 6 + 5] = 0.28;
      }
    });

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [points]);

  const ref = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const posAttr = ref.current?.geometry?.getAttribute("position");
    if (posAttr) {
      for (let i = 0; i < points.length; i++) {
        const pts = points[i];
        const shift = Math.sin(t * 0.5 + i) * 0.3;
        const sx = pts[0].x + shift;
        const sz = -Math.random() * 0.01;
        posAttr.setXYZ(i * 2, sx, pts[0].y, pts[0].z + sz);
        posAttr.setXYZ(i * 2 + 1, sx, pts[pts.length - 1].y, pts[pts.length - 1].z + sz);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={ref} geometry={lines}>
      <lineBasicMaterial vertexColors transparent opacity={0.4} size={1} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}

// Portal frame in hero
function PortalFrame() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current?.rotation.set(0, Math.sin(t * 0.2) * 0.1, 0);
  });

  return (
    <Torus
      ref={ref}
      radius={2.8}
      tube={0.02}
      radialSegment={64}
      tubularSegment={128}
      rotation={[0, 0, 0]}
    >
      <meshStandardMaterial
        emissive="#00D4FF"
        emissiveIntensity={0.8}
        color="#00D4FF"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </Torus>
  );
}

// Ambient dust particles
function AmbientDust({ count = 2000 }: { count?: number }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.01;
      ref.current.rotation.x = Math.sin(t * 0.005) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00D4FF"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// Camera controller linked to scroll
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();

  useFrame(() => {
    const z = -3 + scrollProgress * 18;
    camera.position.set(
      Math.sin(scrollProgress * Math.PI * 0.5) * 0.5,
      Math.cos(scrollProgress * Math.PI * 0.3) * 0.3,
      Math.max(z, -5)
    );
    camera.lookAt(0, 0, Math.max(z - 10, -20));
  });

  return null;
}

// Main 3D scene
function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={["#060A10"]} />

      {/* Lights */}
      <ambientLight intensity={0.1} />
      <pointLight position={[3, 2, -5]} intensity={2} color="#00D4FF" distance={10} />
      <pointLight position={[-3, -1, -8]} intensity={1} color="#34C759" distance={8} />
      <pointLight position={[0, 0, -15]} intensity={3} color="#00D4FF" distance={15} />

      {/* Stars (deep background) */}
      <Stars radius={30} depth={20} count={3000} factor={4} saturation={0} fade speed={1} />

      {/* Fiber optic lines */}
      <FiberLines count={80} />

      {/* Ambient dust */}
      <AmbientDust count={2000} />

      {/* Hero portal */}
      <PortalFrame />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
          height={300}
          intensity={0.6}
        />
        <Noise opacity={0.02} />
      </EffectComposer>

      {/* Scroll-driven camera */}
      <CameraController scrollProgress={scrollProgress} />
    </>
  );
}

// Main component
interface PersistentCorridorProps {
  scrollProgress: React.RefObject<{ position: number; progress: number }>;
}

const PersistentCorridor = ({ scrollProgress }: PersistentCorridorProps) => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, -3], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress.current?.progress || 0} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PersistentCorridor;
