"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

const RING_SEGMENTS = 48;
const RING_COUNT = 60;
const TUNNEL_LENGTH = 80;
const RING_RADIUS = 4;
const PARTICLE_COUNT = 800;

function TunnelRing({ z, index, total }: { z: number; index: number; total: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const t = index / total;
  const radius = RING_RADIUS + Math.sin(t * Math.PI * 3) * 0.3;
  const hue = 0.52 + Math.sin(t * Math.PI * 2) * 0.03;

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += 0.002;
      ref.current.rotation.y += 0.004;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, z]}>
      <torusGeometry args={[radius, 0.025, 8, RING_SEGMENTS]} />
      <meshBasicMaterial
        color={new THREE.Color().setHSL(hue, 0.6, 0.4)}
        transparent
        opacity={0.15 + (1 - Math.abs(z) / TUNNEL_LENGTH) * 0.2}
      />
    </mesh>
  );
}

function TunnelRings({ progress }: { progress: number }) {
  const count = RING_COUNT;
  const cameraZ = progress * TUNNEL_LENGTH - TUNNEL_LENGTH / 2;

  const rings = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / count - 0.5;
      arr.push(t * TUNNEL_LENGTH);
    }
    return arr;
  }, []);

  const visibleRings = rings.filter((z) => {
    const relZ = z - cameraZ;
    return relZ > -12 && relZ < 12;
  });

  return (
    <group>
      <pointLight position={[0, 0, cameraZ + 2]} intensity={2} color="#00f0ff" distance={10} />
      {visibleRings.map((z, i) => (
        <TunnelRing key={i} z={z} index={i} total={count} />
      ))}
    </group>
  );
}

function Particles({ progress }: { progress: number }) {
  const ref = useRef<THREE.Points>(null!);
  const cameraZ = progress * TUNNEL_LENGTH - TUNNEL_LENGTH / 2;

  const [pos, sizes, colors] = useMemo(() => {
    const p = new Float32Array(PARTICLE_COUNT * 3);
    const s = new Float32Array(PARTICLE_COUNT);
    const c = new Float32Array(PARTICLE_COUNT * 3);
    const palette = [
      new THREE.Color("#00f0ff"),
      new THREE.Color("#4d79ff"),
      new THREE.Color("#0066ff"),
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * RING_RADIUS * 0.85;
      const z = (Math.random() - 0.5) * TUNNEL_LENGTH;
      p[i * 3] = Math.cos(angle) * radius;
      p[i * 3 + 1] = Math.sin(angle) * radius;
      p[i * 3 + 2] = z;
      s[i] = 0.02 + Math.random() * 0.06;
      const col = palette[Math.floor(Math.random() * palette.length)];
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return [p, s, c];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = -cameraZ;
      ref.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
}

function ProgressBeam({ progress }: { progress: number }) {
  const beamZ = progress * TUNNEL_LENGTH - TUNNEL_LENGTH / 2;

  return (
    <mesh position={[0, 0, beamZ]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.8, 3.2, 64]} />
      <meshBasicMaterial
        color="#00f0ff"
        transparent
        opacity={0.15 + progress * 0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LoadingScene({ progress }: { progress: number }) {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 6, 14]} />
      <TunnelRings progress={progress} />
      <Particles progress={progress} />
      <ProgressBeam progress={progress} />
      <CameraController progress={progress} />
    </>
  );
}

function CameraController({ progress }: { progress: number }) {
  const { camera } = useThree();
  const targetZ = progress * TUNNEL_LENGTH - TUNNEL_LENGTH / 2;

  useFrame(() => {
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.y += (-0.3 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, targetZ + 2);
  });

  return null;
}

const PHASES = [
  { key: "inicializando", label: "INICIALIZANDO SISTEMA", color: "#8b949e", threshold: 0 },
  { key: "cargando", label: "CARGANDO", color: "#00f0ff", threshold: 0.4 },
  { key: "iniciando", label: "INICIANDO", color: "#4d79ff", threshold: 0.75 },
] as const;

export default function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const duration = 3000;
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      let newPhase = phaseRef.current;
      if (p >= 0.75) newPhase = 2;
      else if (p >= 0.4) newPhase = 1;

      if (newPhase !== phaseRef.current) {
        phaseRef.current = newPhase;
        setPhaseIndex(newPhase);
      }

      if (p >= 1) {
        clearInterval(interval);
        setTimeout(() => onFinish(), 400);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onFinish]);

  const currentPhase = PHASES[phaseIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] bg-[#000000]"
      >
        <Canvas
          camera={{ position: [0, -0.3, -12], fov: 55 }}
          gl={{ antialias: false, alpha: false }}
          dpr={[1, 1.5]}
        >
          <LoadingScene progress={progress} />
        </Canvas>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-baseline gap-[3px] mb-10"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: "#00f0ff" }}
                animate={{
                  opacity: [0.15, 0.8, 0.15],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentPhase.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="text-xs font-mono tracking-[0.25em]"
              style={{ color: currentPhase.color }}
            >
              {currentPhase.label}
            </motion.p>
          </AnimatePresence>

          <div
            className="mt-6 w-32 h-[1px] overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, #00f0ff, #4d79ff)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
