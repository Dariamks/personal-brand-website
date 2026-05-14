import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const siteEntries = await getCollection("site");
  const site = siteEntries[0]?.data;

  const entries = (await getCollection("journal", (j) => !j.data.draft))
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    )
    .slice(0, 20);

  return rss({
    title: site?.name ? `${site.name} 的日志` : "日志",
    description: "日常短心得与技术碎片",
    site: context.site,
    items: entries.map((entry) => ({
      title: entry.data.date,
      pubDate: new Date(entry.data.date),
      description: entry.body?.slice(0, 200) || "",
      link: `/journal#${entry.slug}`,
      author: site?.email || "",
      categories: entry.data.tags || [],
    })),
    customData: `<language>zh-CN</language>`,
  });
}
