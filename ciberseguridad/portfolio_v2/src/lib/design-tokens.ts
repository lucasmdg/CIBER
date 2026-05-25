export const tokens = {
  color: {
    bg: "#06080f",
    surface: "#0d1117",
    elevated: "#161b22",
    border: "rgba(255, 255, 255, 0.05)",
    borderLight: "rgba(255, 255, 255, 0.1)",
    text: "#e6edf3",
    muted: "#8b949e",
    dim: "#6e7681",
    accent: "#58a6ff",
    accentSoft: "#3b82f6",
    accentDim: "rgba(88, 166, 255, 0.08)",
    accentGlow: "rgba(88, 166, 255, 0.12)",
    accentCyan: "#22d3ee",
    accentCyanDim: "rgba(34, 211, 238, 0.06)",
    cyan: "#79c0ff",
    cyanDim: "rgba(121, 192, 255, 0.06)",
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
    glass: "24px",
    glassStrong: "32px",
  },
  shadow: {
    card: "0 8px 32px rgba(0, 0, 0, 0.3)",
    cardHover:
      "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(88, 166, 255, 0.04)",
    glow: "0 0 20px rgba(88, 166, 255, 0.08)",
  },
  font: {
    sans: "Geist, ui-sans-serif, system-ui, sans-serif",
    mono: "Geist Mono, ui-monospace, monospace",
  },
  easing: {
    cinematic: [0.25, 0.46, 0.45, 0.94] as const,
    smooth: [0.16, 1, 0.3, 1] as const,
  },
  duration: {
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
    cinematic: 0.8,
  },
  loading: {
    duration: 3000,
    fadeOut: 500,
  },
};

export type DesignTokens = typeof tokens;
