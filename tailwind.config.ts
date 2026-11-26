import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: "#D71918", // primarna crvena (grb)
          bright: "#BA1010", // sekundarna crvena
          dark: "#850C0C", // tamnocrvena
          deep: "#5E0808",
        },
        light: "#F5F5F5",
        charcoal: "#141414", // crna – detalji i obrubi
      },
      fontFamily: {
        cond: ['"Barlow Condensed"', "Arial Narrow", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "1320px" },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "none" } },
      },
      animation: { fadeUp: "fadeUp .6s ease-out both" },
    },
  },
  plugins: [],
} satisfies Config;
