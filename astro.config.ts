import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import compressor from "astro-compressor";
import { defineConfig } from "astro/config";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";
import { remarkReadingTime } from "./remark-reading-time.mjs";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://ekel.dev",
  integrations: [
    tailwind(),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "catppuccin-mocha",
      },
      remarkPlugins: [remarkToc, remarkReadingTime],
      rehypePlugins: [rehypePresetMinify, rehypeSlug],
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
    (await import("@playform/compress")).default(),
    svelte(),
  ],
  server: {
    port: 3000,
    host: true,
  },
});
