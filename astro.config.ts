import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import swup from "@swup/astro";
import compressor from "astro-compressor";
import { defineConfig } from "astro/config";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";
import { remarkReadingTime } from "./remark-reading-time.mjs";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://ekel.dev",
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
  integrations: [
    tailwind(),
    swup({
      theme: false,
      animationClass: false,
      containers: ["body"],
      smoothScrolling: true,
      cache: true,
      preload: { hover: true, visible: true },
      accessibility: true,
      updateHead: true,
      updateBodyClass: true,
      reloadScripts: false,
      loadOnIdle: true,
      morph: [".reading-progress"],
      globalInstance: true,
    }),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-dark-default",
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
  devToolbar: {
    enabled: false,
  },
});
