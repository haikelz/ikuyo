import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypePresetMinify from "rehype-preset-minify";
import remarkToc from "remark-toc";
import react from "@astrojs/react";
import rehypeSlug from "rehype-slug";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx({
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "vitesse-dark"
    },
    remarkPlugins: [remarkToc],
    rehypePlugins: [rehypePresetMinify, rehypeSlug],
    remarkRehype: {
      footnoteLabel: "Footnotes"
    },
    gfm: true,
    optimize: true
  }), react(), icon()]
});