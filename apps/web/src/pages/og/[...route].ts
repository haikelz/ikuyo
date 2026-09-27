import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const notes = await getCollection("notes");
const works = await getCollection("works");
const experiences = await getCollection("experiences");
const uniqueTags = [...new Set(notes.flatMap((note) => note.data.tags))];

const staticPages: Record<string, { title: string }> = {
  home: { title: "Home" },
  "eid-al-fitr": { title: "Eid Al-Fitr" },
  notes: { title: "Notes" },
  works: { title: "Works" },
  photos: { title: "Photos" },
  experiences: { title: "Experiences" },
  uses: { title: "Uses" },
  wakatime: { title: "Wakatime" },
  guestbook: { title: "Guestbook" },
  now: { title: "Now" },
  tags: { title: "Tags" },
  ihsg: { title: "Stock Market Index" },
};

const notesPages = Object.fromEntries(
  notes.map(({ id, data }) => [`notes/${id}`, { title: data.title }]),
);

const worksPages = Object.fromEntries(
  works.map(({ id, data }) => [`works/${id}`, { title: data.title }]),
);

const experiencesPages = Object.fromEntries(
  experiences
    .filter(({ data }) => data.hasDetail !== false)
    .map(({ id, data }) => [`experiences/${id}`, { title: data.company }]),
);

const tagsPages = Object.fromEntries(
  uniqueTags.map((tag) => [`tags/${tag}`, { title: tag }]),
);

const pages = {
  ...staticPages,
  ...notesPages,
  ...worksPages,
  ...experiencesPages,
  ...tagsPages,
};

const fontRegular =
  "../../node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff";
const fontBold =
  "../../node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff";

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (path, page: (typeof pages)[string]) => {
    const isWorkThumbnail = path.startsWith("works/");

    return {
      title: page.title.toUpperCase(),
      description: isWorkThumbnail ? undefined : "ekel.dev - Product/Devops",
      bgGradient: [[24, 23, 29]],
      ...(!isWorkThumbnail && {
        logo: {
          path: "./public/images/avatar.png",
          size: [180, 180] as [number, number],
          borderRadius: 100,
        },
      }),
      font: {
        title: {
          color: [255, 255, 255],
          size: isWorkThumbnail ? 108 : 60,
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
      padding: isWorkThumbnail ? 48 : 60,
    };
  },
});
