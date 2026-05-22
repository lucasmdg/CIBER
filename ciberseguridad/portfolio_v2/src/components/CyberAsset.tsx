"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 1200;
const BELL_COUNT = 500;
const DIGITS = "01ABEF";

function createDigitTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 80;
  const ctx = canvas.getContext("2d")!;
  DIGITS.split("").forEach((d, i) => {
    ctx.clearRect(i * 64, 0, 64, 80);
    ctx.fillStyle = d === "0" || d === "1" ? "#3b82f6" : "#06b6d4";
    ctx.font = "bold 56px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = d === "0" || d === "1" ? "rgba(59,130,246,0.4)" : "rgba(6,182,212,0.4)";
    ctx.shadowBlur = 8;
    ctx.fillText(d, i * 64 + 32, 42);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const vertexShader = `
  attribute float aDigit;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  varying float vDigit;
  void main() {
    vDigit = aDigit;
    vec3 pos = position;
    float dist = distance(pos.xy, uMouse * 3.0);
    float repel = 0.15 / (dist + 0.5);
    pos.x += (pos.x - uMouse.x * 3.0) * repel * 0.3;
    pos.y += (pos.y - uMouse.y * 3.0) * repel * 0.3;
    float pulse = 1.0 + 0.04 * sin(pos.y * 2.0 + uTime * 0.6);
    pos *= pulse;
    float morph = 0.3 * uScroll;
    pos.y += morph * sin(pos.x * 1.5 + uTime * 0.3) * 0.2;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (250.0 / -mv.z) * (1.0 + 0.2 * sin(pos.y * 3.0 + uTime));
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uColumns;
  varying float vDigit;
  void main() {
    float col = mod(vDigit, uColumns);
    vec2 uv = gl_PointCoord / vec2(uColumns, 1.0) + vec2(col / uColumns, 0.0);
    vec4 tex = texture2D(uTexture, uv);
    float alpha = tex.a * (1.0 - length(gl_PointCoord - 0.5) * 1.2);
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(tex.rgb, alpha * 0.9);
  }
`;

function generateJellyfishPositions(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const digits = new Float32Array(PARTICLE_COUNT);
  let idx = 0;

  for (let i = 0; i < BELL_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.48;
    const r = Math.sin(phi) * 2.2;
    const y = Math.cos(phi) * 1.6 + 1.2;
    positions[idx * 3] = Math.cos(theta) * r * (0.6 + 0.4 * Math.random());
    positions[idx * 3 + 1] = y * (0.7 + 0.3 * Math.random());
    positions[idx * 3 + 2] = Math.sin(theta) * r * (0.6 + 0.4 * Math.random());
    digits[idx] = Math.floor(Math.random() * DIGITS.length);
    idx++;
  }

  const tentacles = 12;
  const perTentacle = Math.floor((PARTICLE_COUNT - BELL_COUNT) / tentacles);
  for (let t = 0; t < tentacles; t++) {
    const theta = (t / tentacles) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
    const baseR = 1.3 + Math.random() * 0.8;
    for (let p = 0; p < perTentacle && idx < PARTICLE_COUNT; p++) {
      const progress = p / perTentacle;
      const y = -progress * 4.5;
      const wave = Math.sin(progress * Math.PI * 5 + Math.random() * 2) * 0.35 * (1 - progress * 0.3);
      const r = (baseR + wave) * (1 - progress * 0.15);
      positions[idx * 3] = Math.cos(theta + wave * 0.15) * r;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = Math.sin(theta + wave * 0.15) * r;
      digits[idx] = Math.floor(Math.random() * DIGITS.length);
      idx++;
    }
  }

  while (idx < PARTICLE_COUNT) {
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 2.5;
    const y = -Math.random() * 4;
    positions[idx * 3] = Math.cos(theta) * r;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(theta) * r;
    digits[idx] = Math.floor(Math.random() * DIGITS.length);
    idx++;
  }

  return positions;
}

function JellyfishParticles() {
  const ref = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { pointer, viewport } = useThree();

  const [positions, digits] = useMemo(() => {
    const pos = generateJellyfishPositions();
    const dig = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dig[i] = pos[i * 3 + 1] > 0 ? Math.floor(Math.random() * 4) : 4 + Math.floor(Math.random() * 2);
    }
    return [pos, dig];
  }, []);

  const texture = useMemo(() => createDigitTexture(), []);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = Math.min(window.scrollY / max, 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta * 0.4;
      materialRef.current.uniforms.uScroll.value += (scrollRef.current - materialRef.current.uniforms.uScroll.value) * 0.05;
      mouseRef.current.x += (pointer.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (pointer.y - mouseRef.current.y) * 0.08;
      materialRef.current.uniforms.uMouse.value.x = mouseRef.current.x;
      materialRef.current.uniforms.uMouse.value.y = mouseRef.current.y;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aDigit"
          args={[digits, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uTexture: { value: texture },
          uColumns: { value: DIGITS.length },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function CyberAsset() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 6], fov: 50 }}
      gl={{ antialias: false, alpha: true }}
      style={{ width: "100%", height: "100%", minHeight: 400 }}
      dpr={[1, 1.5]}
    >
      <JellyfishParticles />
    </Canvas>
  );
}
