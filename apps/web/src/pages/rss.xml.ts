import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const notes = await getCollection("notes");

  return rss({
    title: "Haikel Ilham Hakim",
    description: "Javascript / Typescript",
    site: context.site as URL,
    items: notes.map((item) => ({
      title: item.data.title,
      pubDate: item.data.created_at,
      description: item.data.description,
      link: `/notes/${item.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
