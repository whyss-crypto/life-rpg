import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#06070d",
          900: "#0a0d18",
          800: "#101527",
          700: "#182036",
        },
        obsidian: {
          900: "#0d1222",
          800: "#141b31",
          700: "#1d2642",
          600: "#2a365a",
        },
        gold: {
          300: "#ffe9a8",
          400: "#ffd970",
          500: "#f5b942",
          600: "#d99a26",
          700: "#a86f14",
        },
        arcane: {
          300: "#9db8ff",
          400: "#6e8fff",
          500: "#4a63e7",
          600: "#3549b8",
        },
        mana: "#5eead4",
        blood: "#f87171",
        parchment: "#f3e9d2",
        muted: {
          400: "#8b93b0",
          500: "#6b7390",
        },
      },
      fontFamily: {
        display: ["Cinzel", "Georgia", "serif"],
        body: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        rune: "14px",
      },
      boxShadow: {
        "gold-glow": "0 0 24px rgba(245,185,66,0.35), 0 0 64px rgba(245,185,66,0.12)",
        "arcane-glow": "0 0 24px rgba(110,143,255,0.35)",
        card: "0 18px 50px rgba(0,0,0,0.45)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
