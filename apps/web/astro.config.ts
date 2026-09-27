import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import compressor from "astro-compressor";
import { defineConfig } from "astro/config";
import { unified, type RehypePlugin } from "@astrojs/markdown-remark";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeSlug from "rehype-slug";
import remarkSectionize from "remark-sectionize";
import remarkToc from "remark-toc";
import { SENTRY_AUTH_TOKEN, SENTRY_PROJECT } from "./src/utils/env";
import { rehypeCodeBlockWrapper } from "./src/utils/rehype";
import { remarkCodeFilename, remarkReadingTime } from "./src/utils/remark";

export default defineConfig({
  output: "static",
  site: "https://ekel.dev",
  markdown: {
    processor: unified({
      remarkPlugins: [
        [remarkToc, { heading: "toc" }],
        remarkReadingTime,
        remarkSectionize,
        remarkCodeFilename,
      ],
      rehypePlugins: [
        rehypeCodeBlockWrapper,
        rehypePresetMinify as unknown as RehypePlugin,
        rehypeSlug,
      ],
      remarkRehype: {
        footnoteLabel: "Footnotes",
      },
      gfm: true,
    }),
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      conditions: ["browser"],
      noExternal: ["bits-ui", "runed", "svelte-toolbelt", "@hugeicons/svelte"],
    },
  },
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-dark-default",
        transformers: [(await import("./src/utils/shiki.ts")).transformerMetaFilename()],
      },
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
      project: SENTRY_PROJECT,
      authToken: SENTRY_AUTH_TOKEN,
      telemetry: false,
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
