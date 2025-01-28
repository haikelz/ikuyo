import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import { env, integrations } from "./src/lib/utils/astro";

export default defineConfig({
  output: "static",
  site: "https://ekel.dev",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations,
  server: {
    port: 3000,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  compressHTML: true,
  env,
});
