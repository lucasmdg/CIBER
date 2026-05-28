import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#060A10",
          surface: "#0A1018",
          elevated: "#111A27",
        },
        signal: {
          cyan: "#00D4FF",
          green: "#34C759",
          amber: "#FFB347",
          red: "#FF3B30",
        },
        text: {
          primary: "#E6EDF3",
          secondary: "#8B949E",
          tertiary: "#484F58",
        },
      },
      fontFamily: {
        display: ["Geist", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "fiber-pulse": "fiber-pulse 3s ease-in-out infinite",
        "cursor-blink": "blink 1s step-end infinite",
        "status-pulse": "status-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
