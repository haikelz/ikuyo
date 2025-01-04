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
        "monochrome-1": "#E9ECEF",
        "monochrome-2": "#DEE2E6",
        "monochrome-3": "#CED4DA",
        "monochrome-4": "#ADB5BD",
      },
    },
  },
  plugins: [typography],
} satisfies Config;
