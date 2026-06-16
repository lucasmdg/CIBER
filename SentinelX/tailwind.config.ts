import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1440px" }
    },
    extend: {
      colors: {
        ink: {
          950: "#05070d",
          900: "#0a0f1c",
          800: "#0f1626",
          700: "#142036",
          600: "#1c2a47"
        },
        cyber: {
          50: "#e6fbff",
          100: "#b3f1ff",
          200: "#80e6ff",
          300: "#4ddcff",
          400: "#1ad2ff",
          500: "#00b4e6",
          600: "#008cb4",
          700: "#006583",
          800: "#003e51",
          900: "#00171f"
        },
        threat: {
          low: "#22d3ee",
          medium: "#facc15",
          high: "#fb923c",
          critical: "#ef4444"
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 50, 90, 0.37)",
        neon: "0 0 0 1px rgba(0, 180, 230, 0.35), 0 0 24px rgba(0, 180, 230, 0.25)"
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(rgba(0,180,230,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,230,0.07) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at top, rgba(0,180,230,0.18), transparent 60%)"
      },
      backgroundSize: {
        "grid-32": "32px 32px"
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,180,230,0.55)" },
          "50%": { boxShadow: "0 0 0 8px rgba(0,180,230,0)" }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 1.6s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;
