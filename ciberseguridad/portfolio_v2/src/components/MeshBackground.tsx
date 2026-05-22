"use client";

export default function MeshBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            animation: "mesh-shift 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
            animation: "mesh-shift 22s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-1/3 h-1/3 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)",
            animation: "mesh-shift 20s ease-in-out infinite 4s",
          }}
        />
      </div>

      <svg className="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-[0.08]" style={{ mixBlendMode: "overlay" }}>
        <defs>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.08 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-[0.03]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid-dots" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="0.5" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>

        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px"
            style={{
              top: `${20 + i * 14}%`,
              left: 0,
              right: 0,
              background: `linear-gradient(90deg, transparent 0%, rgba(59,130,246,${0.03 + i * 0.01}) 50%, transparent 100%)`,
              animation: "data-flow-x 8s linear infinite",
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}

        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i + 10}
            className="absolute w-px"
            style={{
              left: `${15 + i * 25}%`,
              top: 0,
              bottom: 0,
              background: `linear-gradient(180deg, transparent 0%, rgba(6,182,212,${0.02 + i * 0.008}) 50%, transparent 100%)`,
              animation: "data-flow-x 12s linear infinite",
              animationDelay: `${i * 1.8}s`,
            }}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-48 -z-10 pointer-events-none bg-gradient-to-t from-[#050508] to-transparent" />
    </>
  );
}
