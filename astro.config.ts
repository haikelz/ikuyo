// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import compressor from "astro-compressor";
import { defineConfig, envField } from "astro/config";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";
import { remarkReadingTime } from "./remark-reading-time.mjs";

import svelte from "@astrojs/svelte";

import sentry from "@sentry/astro";
import {
  SENTRY_AUTH_TOKEN,
  SENTRY_DSN,
  SENTRY_PROJECT,
} from "./src/lib/utils/constants";

const integrations = [
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
  sentry({
    dsn: SENTRY_DSN,
    sourceMapsUploadOptions: {
      project: SENTRY_PROJECT,
      authToken: SENTRY_AUTH_TOKEN,
      telemetry: false,
    },
  }),
];

const env = {
  schema: {
    PUBLIC_PRODUCTION_URL: envField.string({
      context: "client",
      access: "public",
    }),
    PUBLIC_DEVELOPMENT_URL: envField.string({
      context: "client",
      access: "public",
    }),
    TURSO_DATABASE_URL: envField.string({
      context: "server",
      access: "secret",
    }),
    TURSO_AUTH_TOKEN: envField.string({
      context: "server",
      access: "secret",
    }),
    SENTRY_DSN: envField.string({
      context: "server",
      access: "secret",
    }),
    SENTRY_AUTH_TOKEN: envField.string({
      context: "server",
      access: "secret",
    }),
    SENTRY_PROJECT: envField.string({
      context: "server",
      access: "secret",
    }),
  },
};

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
