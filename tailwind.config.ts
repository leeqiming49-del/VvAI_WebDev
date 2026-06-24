import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070b",
        panel: "#0b1017",
        line: "rgba(255,255,255,.10)",
        cyan: "#4df4ff",
        violet: "#9c7cff",
      },
      boxShadow: {
        glow: "0 0 36px rgba(77,244,255,.16)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
