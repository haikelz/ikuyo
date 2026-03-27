import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import compressor from "astro-compressor";
import { defineConfig } from "astro/config";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeSlug from "rehype-slug";
import remarkSectionize from "remark-sectionize";
import remarkToc from "remark-toc";
import { SENTRY_AUTH_TOKEN, SENTRY_DSN, SENTRY_PROJECT } from "./src/utils/env";
import { rehypeCodeBlockWrapper } from "./src/utils/rehype";
import { remarkCodeFilename, remarkReadingTime } from "./src/utils/remark";

export default defineConfig({
  output: "static",
  site: "https://ekel.dev",
  vite: {
    plugins: [tailwindcss() as any],
    resolve: {
      conditions: ["browser"],
    },
    optimizeDeps: {
      include: ["chart.js"],
    },
  },
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-dark-default",
        transformers: [(await import("./src/utils/shiki.ts")).transformerMetaFilename()],
      },
      remarkPlugins: [
        [remarkToc, { heading: "toc" }],
        remarkReadingTime,
        remarkSectionize,
        remarkCodeFilename,
      ],
      rehypePlugins: [rehypeCodeBlockWrapper, rehypePresetMinify, rehypeSlug],
      remarkRehype: {
        footnoteLabel: "Footnotes",
      },
      gfm: true,
      optimize: true,
    }),
    sitemap({
      changefreq: "weekly",
      priority: 1,
    }),
    compressor({
      gzip: true,
      brotli: true,
    }),
    svelte(),
    sentry({
      dsn: SENTRY_DSN,
      sourceMapsUploadOptions: {
        project: SENTRY_PROJECT,
        authToken: SENTRY_AUTH_TOKEN,
        telemetry: false,
      },
    }),
    (await import("@playform/compress")).default(),
  ],
  server: {
    port: 3000,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  compressHTML: true,
});
