import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  prefix: "",
  theme: {
    extend: {
      boxShadow: {
        light: "8px 8px 0px -3px #0D1117",
        dark: "8px 8px 0px -3px #FFFFFF",
        progress: "0 0 10px #29d, 0 0 5px #29d",
      },
      colors: {
        "base-0": "#0D1117",
        "base-1": "#161B22",
        "base-2": "#21262D",
        "base-3": "#89929B",
        "base-4": "#C6CDD5",
        "base-5": "#ECF2F8",
      },
    },
  },
  plugins: [typography],
};
