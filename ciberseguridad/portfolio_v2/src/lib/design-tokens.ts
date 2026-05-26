export const tokens = {
  color: {
    bg: "#000000",
    surface: "#0a0a0a",
    elevated: "#1a1a1a",
    border: "rgba(255, 255, 255, 0.04)",
    borderLight: "rgba(255, 255, 255, 0.08)",
    text: "#e6edf3",
    muted: "#8b949e",
    dim: "#6e7681",
    accent: "#00f0ff",
    accentSoft: "#0066ff",
    accentDim: "rgba(0, 240, 255, 0.08)",
    accentGlow: "rgba(0, 240, 255, 0.12)",
    accentCyan: "#00f0ff",
    accentCyanDim: "rgba(0, 240, 255, 0.06)",
    cyan: "#4d79ff",
    cyanDim: "rgba(77, 121, 255, 0.06)",
    purple: "#bc8cff",
    purpleDim: "rgba(188, 140, 255, 0.06)",
  },
  space: {
    section: "7rem",
    sectionSm: "5rem",
    cardGap: "1.25rem",
    gridGap: "1rem",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  blur: {
    glass: "40px",
    glassStrong: "48px",
  },
  shadow: {
    card: "0 8px 32px rgba(0, 0, 0, 0.5)",
    cardHover:
      "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 240, 255, 0.06)",
    glow: "0 0 24px rgba(0, 240, 255, 0.08)",
  },
  font: {
    sans: "Geist, ui-sans-serif, system-ui, sans-serif",
    mono: "Geist Mono, ui-monospace, monospace",
  },
  easing: {
    cinematic: [0.25, 0.46, 0.45, 0.94] as const,
    smooth: [0.16, 1, 0.3, 1] as const,
    expo: [0.16, 1, 0.3, 1] as const,
    inOutCirc: [0.85, 0, 0.15, 1] as const,
    spring: [0.34, 1.56, 0.64, 1] as const,
  },
  duration: {
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
    cinematic: 0.8,
    entrance: 1.5,
  },
  loading: {
    duration: 3000,
    fadeOut: 500,
  },
};

export type DesignTokens = typeof tokens;
