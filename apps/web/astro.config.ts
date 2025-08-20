import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import compressor from "astro-compressor";
import { defineConfig, envField } from "astro/config";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeSlug from "rehype-slug";
import remarkSectionize from "remark-sectionize";
import remarkToc from "remark-toc";
import { remarkReadingTime } from "./remark-reading-time.mjs";
import { SENTRY_AUTH_TOKEN, SENTRY_DSN, SENTRY_PROJECT } from "./src/utils/env";

export default defineConfig({
  output: "static",
  site: "https://ekel.dev",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      conditions: ["browser"],
    },
  },
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-dark-default",
      },
      remarkPlugins: [
        [remarkToc, { heading: "toc" }],
        remarkReadingTime,
        remarkSectionize,
      ],
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
    AstroPWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 1024 * 1024 * 5,
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "ekel.dev",
        short_name: "ekel.dev",
        description: "Software Developer",
        theme_color: "#000000",
        background_color: "#000000",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "48x48",
            type: "image/x-icon",
          },
        ],
        id: "/?source=pwa",
        start_url: "/?source=pwa",
        display: "standalone",
        orientation: "portrait",
        lang: "en-US",
        scope: "/",
        categories: [
          "blog",
          "portfolio",
          "personal",
          "software",
          "developer",
          "frontend",
          "backend",
          "fullstack",
          "web",
          "automation",
          "devops",
          "cloud",
          "kubernetes",
          "docker",
          "database",
          "human resources",
        ],
        shortcuts: [
          {
            name: "Home",
            url: "/",
          },
        ],
        screenshots: [
          {
            src: "/opengraph.png",
            sizes: "1024x1024",
            type: "image/png",
          },
        ],
        iarc_rating_id: "E",
        display_override: ["window-controls-overlay"],
        prefer_related_applications: false,
        related_applications: [],
        share_target: {
          action: "/",
          method: "GET",
          params: {
            title: "title",
          },
        },
      },
    }),
  ],

  server: {
    port: 3000,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  compressHTML: true,
  env: {
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
  },
});
