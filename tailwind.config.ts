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
          950: "#0a0c11",
          900: "#0e1118",
          800: "#141922",
          700: "#1b222e",
        },
        obsidian: {
          900: "#10141c",
          800: "#161c27",
          700: "#1e2634",
          600: "#2a3446",
        },
        ink: {
          DEFAULT: "#ece7da",
          dim: "#c9c3b4",
        },
        fog: {
          DEFAULT: "#99a1ad",
          faint: "#5f6773",
        },
        gold: {
          300: "#e8cf8f",
          400: "#d9b45c",
          500: "#c39a3b",
          600: "#96722a",
          700: "#6b4f1c",
        },
        steel: {
          300: "#a9b8d0",
          400: "#8fa3c7",
          500: "#5f7191",
        },
        moss: "#7ba88d",
        ember: "#d08a4e",
        blood: "#e0705f",
      },
      fontFamily: {
        display: ["Cinzel", "Georgia", "serif"],
        body: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        rune: "8px",
        sharp: "3px",
      },
      boxShadow: {
        card: "0 12px 32px rgba(0, 0, 0, 0.4)",
        lift: "0 4px 14px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
