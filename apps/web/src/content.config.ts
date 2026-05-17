import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const notesCollection = defineCollection({
  loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    author: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    created_at: z.date(),
    tags: z.array(z.string().min(1)),
  }),
});

const worksCollection = defineCollection({
  loader: glob({ base: "./src/content/works", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    id: z.number(),
    author: z.string().min(1),
    thumbnail: z.string().min(1).includes("https"),
    title: z.string().min(1),
    stack: z.array(z.string()),
    repo: z.string().optional(),
    preview: z.string().optional(),
    description: z.string().min(1),
  }),
});

export const collections = {
  notes: notesCollection,
  works: worksCollection,
};
