import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        "base-0": "#0D1117",
        "base-1": "#161B22",
        "base-2": "#21262D",
        "base-3": "#89929B",
        "base-4": "#C6CDD5",
        "base-5": "#ECF2F8",
        "vitesse-white-1": "#ebebeb",
        "vitesse-white-2": "#d7d7d7",
        "vitesse-white-3": "#c3c3c3",
      },
    },
  },
  plugins: [typography],
} satisfies Config;
