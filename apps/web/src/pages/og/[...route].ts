import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const notes = await getCollection("notes");
const works = await getCollection("works");

const staticPages: Record<string, { title: string }> = {
  home: { title: "Home" },
  notes: { title: "Notes" },
  works: { title: "Works" },
  photos: { title: "Photos" },
  uses: { title: "Uses" },
  wakatime: { title: "Wakatime" },
  guestbook: { title: "Guestbook" },
};

const notesPages = Object.fromEntries(
  notes.map(({ slug, data }) => [`notes/${slug}`, { title: data.title }]),
);

const worksPages = Object.fromEntries(
  works.map(({ slug, data }) => [`works/${slug}`, { title: data.title }]),
);

const pages = { ...staticPages, ...notesPages, ...worksPages };

const fontRegular =
  "../../node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff";
const fontBold =
  "../../node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff";

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",

  pages,

  getImageOptions: (_path, page: (typeof pages)[string]) => ({
    title: page.title.toUpperCase(),
    description: "ekel.dev - Product Engineer",
    bgGradient: [[13, 17, 23]], // #0d1117 — matches the existing OG
    logo: {
      path: "./public/images/avatar.png",
      size: [180, 180],
      borderRadius: 100,
    },
    font: {
      title: {
        color: [255, 255, 255],
        size: 60,
        weight: "Bold",
        lineHeight: 1.1,
        families: ["Geist Sans"],
      },
      description: {
        color: [160, 160, 160],
        size: 32,
        weight: "Normal",
        families: ["Geist Sans"],
      },
    },
    fonts: [fontRegular, fontBold],
    border: {
      color: [255, 255, 255],
      width: 0,
    },
    padding: 60,
  }),
});
