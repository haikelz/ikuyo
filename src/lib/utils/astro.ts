// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import { envField } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";
import { remarkReadingTime } from "../../../remark-reading-time.mjs";

import svelte from "@astrojs/svelte";

import type { HeadingNodeTocProps, HeadingTocProps } from "@/types";
import sentry from "@sentry/astro";
import { SENTRY_AUTH_TOKEN, SENTRY_DSN, SENTRY_PROJECT } from "./constants";

export const integrations = [
  mdx({
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-dark-default",
    },
    remarkPlugins: [[remarkToc, { heading: "toc" }], remarkReadingTime],
    rehypePlugins: [
      rehypePresetMinify,
      rehypeSlug,
      [rehypeExternalLinks, { content: { type: "text", value: "" } }],
    ],
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

export const env = {
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

/**
 * Builds a hierarchical structure from a flat array of headings
 * @param headings - Array of heading objects containing depth, text, and id
 * @param rootDepth - The depth level that should be considered as root (default: 2)
 * @returns Array of heading nodes with their nested subheadings
 */
export function buildHierarchy(
  headings: HeadingTocProps[],
  rootDepth: number = 2
): HeadingNodeTocProps[] {
  if (!headings?.length) {
    return [];
  }

  // Use a more specific type for the map
  const parentHeadings = new Map<number, HeadingNodeTocProps>();
  const tableOfContents: HeadingNodeTocProps[] = [];

  // Pre-allocate the array size for better performance
  tableOfContents.length = headings.filter((h) => h.depth === rootDepth).length;
  let tocIndex = 0;

  for (const heading of headings) {
    const headingNode: HeadingNodeTocProps = {
      ...heading,
      subheadings: [],
    };

    parentHeadings.set(heading.depth, headingNode);

    if (heading.depth === rootDepth) {
      tableOfContents[tocIndex++] = headingNode;
    } else {
      const parent = parentHeadings.get(heading.depth - 1);
      if (parent) {
        parent.subheadings.push(headingNode);
      }
    }
  }

  return tableOfContents;
}
