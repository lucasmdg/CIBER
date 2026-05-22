"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const TOTAL = 3500;
const LAYERS = [
  { count: 1400, speed: 0.12, zRange: [-6, -3], size: [0.08, 0.2], alpha: 0.12 },
  { count: 1300, speed: 0.25, zRange: [-2.5, 2.5], size: [0.12, 0.3], alpha: 0.25 },
  { count: 800, speed: 0.4, zRange: [3, 6], size: [0.2, 0.45], alpha: 0.4 },
];
const CHARS = "01ABEF";

const palette = [
  new THREE.Color("#3b82f6"),
  new THREE.Color("#60a5fa"),
  new THREE.Color("#93c5fd"),
  new THREE.Color("#22d3ee"),
];

function createCharTexture() {
  const c = document.createElement("canvas");
  c.width = 384;
  c.height = 80;
  const ctx = c.getContext("2d")!;
  CHARS.split("").forEach((ch, i) => {
    ctx.clearRect(i * 64, 0, 64, 80);
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 48px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(59,130,246,0.2)";
    ctx.shadowBlur = 6;
    ctx.fillText(ch, i * 64 + 32, 42);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
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
attribute float aLayer;
attribute float aType;
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
uniform vec3 uLayerSpeeds;
varying float vType;
varying vec3 vColor;
varying float vAlpha;
varying float vGlow;

float glowCurve(float x) {
  return exp(-x * 8.0);
}

void main() {
  vType = aType;
  vColor = aColor;
  vec3 pos = position;
  float layerSpeed = uLayerSpeeds[int(aLayer)];
  float t = uTime * layerSpeed;

  float n = snoise(vec3(pos.x * 0.2 + t * 0.1, pos.y * 0.2 + t * 0.08, pos.z * 0.12 + aPhase));
  pos.x += n * 0.35 * layerSpeed;
  pos.y += n * 0.3 * layerSpeed;
  pos.z += n * 0.2 * layerSpeed;

  float wave = sin(pos.x * 0.4 + t * 0.3 + aPhase) * 0.12;
  wave += cos(pos.y * 0.35 + t * 0.2 + aPhase * 1.3) * 0.1;
  pos.x += wave * layerSpeed;
  pos.y += wave * 0.6;

  float dist = distance(pos.xy, uMouse * 4.0);
  float repel = 0.35 / (dist * dist + 0.5);
  vec2 repelDir = normalize(pos.xy - uMouse * 4.0);
  pos.x += repelDir.x * repel;
  pos.y += repelDir.y * repel;

  vGlow = glowCurve(dist) * 0.5;

  float sw = uScroll;
  float morphX = sw * 0.15 * sin(pos.y * 0.5 + aPhase + uTime * 0.08);
  float morphY = sw * 0.12 * cos(pos.x * 0.4 + aPhase * 1.5 + uTime * 0.06);
  pos.x += morphX;
  pos.y += morphY;

  float emerge = 1.0 + 0.1 * sin(uTime * 0.15 + aPhase) * layerSpeed;
  pos.z *= emerge;

  float breathe = 1.0 + 0.03 * sin(uTime * 0.2 + aPhase * 0.5);
  pos *= breathe;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float zDepth = -mv.z / 10.0;
  float sizeBase = aSize * (300.0 / -mv.z);
  float sizePulse = 1.0 + 0.15 * sin(uTime * 0.4 + aPhase * 2.0);
  float depthScale = 1.0 + zDepth * 0.3;
  gl_PointSize = sizeBase * sizePulse * depthScale;

  float layerAlpha = aLayer == 0.0 ? 0.12 : (aLayer == 1.0 ? 0.25 : 0.4);
  float fadeEdge = 1.0 - abs(pos.y) / 6.5;
  vAlpha = layerAlpha * max(0.0, fadeEdge);
  vAlpha += vGlow * 0.3;

  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uColumns;
varying float vType;
varying vec3 vColor;
varying float vAlpha;
varying float vGlow;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  if (vType > 0.5) {
    float col = vType - 1.0;
    vec2 uv = gl_PointCoord / vec2(uColumns, 1.0) + vec2(col / uColumns, 0.0);
    vec4 tex = texture2D(uTexture, uv);
    float alpha = tex.a * (1.0 - d * 1.5) * vAlpha;
    if (alpha < 0.02) discard;
    vec3 mixed = mix(vColor, tex.rgb, 0.4);
    gl_FragColor = vec4(mixed + vGlow * 0.3, alpha);
  } else {
    float soft = 1.0 - smoothstep(0.0, 0.5, d);
    float alpha = soft * vAlpha * 0.85;
    vec3 col = vColor + vGlow * 0.4;
    gl_FragColor = vec4(col, alpha);
  }
}
`;

function generateParticles() {
  const pos = new Float32Array(TOTAL * 3);
  const sizes = new Float32Array(TOTAL);
  const colors = new Float32Array(TOTAL * 3);
  const phases = new Float32Array(TOTAL);
  const layers = new Float32Array(TOTAL);
  const types = new Float32Array(TOTAL);

  let idx = 0;
  for (let l = 0; l < LAYERS.length; l++) {
    const cfg = LAYERS[l];
    for (let i = 0; i < cfg.count && idx < TOTAL; i++) {
      const radius = 2 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[idx * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      pos[idx * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 0.5;
      pos[idx * 3 + 2] = cfg.zRange[0] + Math.random() * (cfg.zRange[1] - cfg.zRange[0]);

      sizes[idx] = cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0]);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[idx * 3] = c.r;
      colors[idx * 3 + 1] = c.g;
      colors[idx * 3 + 2] = c.b;
      phases[idx] = Math.random() * Math.PI * 2;
      layers[idx] = l;
      types[idx] = Math.random() < 0.15 ? 1 + Math.floor(Math.random() * CHARS.length) : 0;
      idx++;
    }
  }

  while (idx < TOTAL) {
    const theta = Math.random() * Math.PI * 2;
    const r = 2.5 + Math.random() * 4.5;
    pos[idx * 3] = Math.cos(theta) * r;
    pos[idx * 3 + 1] = Math.sin(theta) * r * 0.5;
    pos[idx * 3 + 2] = (Math.random() - 0.5) * 8;
    sizes[idx] = 0.12 + Math.random() * 0.3;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[idx * 3] = c.r;
    colors[idx * 3 + 1] = c.g;
    colors[idx * 3 + 2] = c.b;
    phases[idx] = Math.random() * Math.PI * 2;
    layers[idx] = 1;
    types[idx] = 0;
    idx++;
  }

  return { pos, sizes, colors, phases, layers, types };
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { pointer } = useThree();

  const data = useMemo(() => generateParticles(), []);
  const texture = useMemo(() => createCharTexture(), []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = Math.min(window.scrollY / max, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta * 0.2;
      matRef.current.uniforms.uScroll.value += (scrollRef.current - matRef.current.uniforms.uScroll.value) * 0.03;
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
        <bufferAttribute attach="attributes-aLayer" args={[data.layers, 1]} />
        <bufferAttribute attach="attributes-aType" args={[data.types, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uTexture: { value: texture },
          uColumns: { value: CHARS.length },
          uLayerSpeeds: { value: new THREE.Vector3(LAYERS[0].speed, LAYERS[1].speed, LAYERS[2].speed) },
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
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      dpr={[1, 1.5]}
    >
      <ParticleField />
    </Canvas>
  );
}
