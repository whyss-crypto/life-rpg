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
        ink: "#ece7da",
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
        sharp: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
