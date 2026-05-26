"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import { CAMERA_START_Z, CAMERA_END_Z, TUNNEL_DEPTH } from "@/hooks/useScrollCamera";

const RING_COUNT = 60;
const RING_RADIUS = 4;
const RING_TUBE = 0.02;
const PARTICLE_COUNT = 10000;
const TUNNEL_RANGE = TUNNEL_DEPTH + 40;

function getScrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
}

function getScrollVelocity(): number {
  if (typeof window === "undefined") return 0;
  return (window as any).__scrollVelocity ?? 0;
}

const noiseGLSL = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const vertexShader = `
${noiseGLSL}
attribute float aSize;
attribute vec3 aColor;
attribute float aPhase;
uniform float uTime;
uniform float uScroll;
uniform float uVelocity;
uniform vec2 uMouse;
uniform float uDepthRange;
varying vec3 vColor;
varying float vAlpha;
varying float vDepth;

void main() {
  vColor = aColor;
  vec3 pos = position;

  float n = snoise(vec3(pos.x * 0.15 + uTime * 0.04, pos.y * 0.15 + uTime * 0.03, pos.z * 0.08 + aPhase));
  pos.x += n * 0.2;
  pos.y += n * 0.15;
  pos.z += n * 0.1 * (1.0 + uVelocity * 0.5);

  float wave = sin(pos.x * 0.3 + uTime * 0.12 + aPhase) * 0.06;
  wave += cos(pos.y * 0.25 + uTime * 0.1 + aPhase * 1.3) * 0.04;
  pos.x += wave;
  pos.y += wave * 0.5;

  float repel = 0.0;
  vec2 repelDir = vec2(0.0);
  float dist = distance(pos.xy, uMouse * 5.0);
  if (dist > 0.01) {
    repel = 0.15 / (dist * dist + 0.8);
    repelDir = normalize(pos.xy - uMouse * 5.0);
  }
  pos.x += repelDir.x * repel;
  pos.y += repelDir.y * repel;

  float sm = uScroll;
  pos.x += sm * 0.08 * sin(pos.y * 0.35 + aPhase + uTime * 0.05);
  pos.y += sm * 0.06 * cos(pos.x * 0.3 + aPhase * 1.4 + uTime * 0.03);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vDepth = -mv.z / uDepthRange;

  float sizeBase = aSize * (300.0 / -mv.z);
  gl_PointSize = sizeBase * (1.0 + uVelocity * 0.3);

  float fadeEdge = 1.0 - abs(pos.y) / 6.0;
  float fadeZ = 1.0 - abs(pos.z - uScroll * uDepthRange) / (uDepthRange * 0.6);
  vAlpha = max(0.0, fadeEdge) * max(0.0, fadeZ) * 0.6;
  vAlpha += uVelocity * 0.05;

  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec3 vColor;
varying float vAlpha;
varying float vDepth;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  float soft = 1.0 - smoothstep(0.0, 0.5, d);
  float glow = exp(-d * 8.0);

  vec3 depthColor = mix(uColor1, uColor2, vDepth);
  vec3 col = mix(vColor, depthColor, 0.5);
  col += glow * 0.25 * uColor1;

  float alpha = (soft * 0.8 + glow * 0.2) * vAlpha;
  alpha = clamp(alpha, 0.0, 0.8);

  gl_FragColor = vec4(col, alpha);
}
`;

function generateParticles() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const phases = new Float32Array(PARTICLE_COUNT);

  const palette = [
    new THREE.Color("#00f0ff"),
    new THREE.Color("#4d79ff"),
    new THREE.Color("#0066ff"),
    new THREE.Color("#00f0ff"),
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 3.5;
    const z = (Math.random() - 0.5) * TUNNEL_RANGE;

    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = Math.sin(angle) * radius * 0.5;
    pos[i * 3 + 2] = z;

    sizes[i] = 0.04 + Math.random() * 0.12;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    phases[i] = Math.random() * Math.PI * 2;
  }

  return { pos, sizes, colors, phases };
}

function CorridorParticles() {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { pointer } = useThree();

  const data = useMemo(() => generateParticles(), []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uVelocity: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uDepthRange: { value: TUNNEL_RANGE },
    uColor1: { value: new THREE.Color("#00f0ff") },
    uColor2: { value: new THREE.Color("#0066ff") },
  }), []);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta * 0.15;
      const progress = getScrollProgress();
      matRef.current.uniforms.uScroll.value += (progress - matRef.current.uniforms.uScroll.value) * 0.03;
      matRef.current.uniforms.uVelocity.value += (getScrollVelocity() - matRef.current.uniforms.uVelocity.value) * 0.05;
      mouseRef.current.x += (pointer.x - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (pointer.y - mouseRef.current.y) * 0.06;
      matRef.current.uniforms.uMouse.value.x = mouseRef.current.x;
      matRef.current.uniforms.uMouse.value.y = mouseRef.current.y;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function TunnelRings() {
  const groupRef = useRef<THREE.Group>(null!);

  const rings = useMemo(() => {
    const arr: { z: number }[] = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const t = i / RING_COUNT - 0.5;
      arr.push({ z: t * TUNNEL_RANGE });
    }
    return arr;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((r, i) => {
        const t = i / RING_COUNT;
        const radius = RING_RADIUS + Math.sin(t * Math.PI * 3) * 0.2;
        const alpha = 0.06 + (1 - Math.abs(r.z) / (TUNNEL_RANGE * 0.5)) * 0.1;
        const col = new THREE.Color().setHSL(0.5 + Math.sin(t * Math.PI * 2) * 0.02, 0.8, 0.5);
        return (
          <mesh key={i} position={[0, 0, r.z]} rotation={[Math.sin(i * 0.3) * 0.01, Math.cos(i * 0.2) * 0.01, 0]}>
            <torusGeometry args={[radius, RING_TUBE, 6, 48]} />
            <meshBasicMaterial
              color={col}
              transparent
              opacity={alpha}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();

  useFrame(() => {
    const progress = getScrollProgress();
    const targetZ = CAMERA_START_Z + progress * TUNNEL_DEPTH;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.position.y = -0.2;
    camera.lookAt(0, -0.1, camera.position.z + 3);
  });

  return null;
}

function TrackScrollVelocity() {
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const vel = Math.abs(sy - lastScroll.current);
      (window as any).__scrollVelocity = vel / 100;
      lastScroll.current = sy;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}

function ChromaticAberrationController() {
  const chromaRef = useRef<any>(null!);

  useFrame(() => {
    if (chromaRef.current) {
      const vel = getScrollVelocity();
      const offset = 0.0005 + vel * 0.003;
      chromaRef.current.offset.x = Math.min(offset, 0.015);
      chromaRef.current.offset.y = Math.min(offset * 0.5, 0.008);
    }
  });

  return (
    <ChromaticAberration ref={chromaRef} offset={[0.0005, 0.0005]} />
  );
}

export default function PersistentCorridor() {
  return (
    <>
      <TrackScrollVelocity />
      <Canvas
        camera={{ position: [0, -0.2, CAMERA_START_Z], fov: 55 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 8, 25]} />
        <TunnelRings />
        <CorridorParticles />
        <CameraController />
        <EffectComposer>
          <Bloom intensity={0.15} luminanceThreshold={0.6} mipmapBlur />
          <ChromaticAberrationController />
        </EffectComposer>
      </Canvas>
    </>
  );
}
