import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const siteEntries = await getCollection("site");
  const site = siteEntries[0]?.data;

  const posts = (
    await getCollection("blog", (p: CollectionEntry<"blog">) => !p.data.draft)
  )
    .sort(
      (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    )
    .slice(0, 20);

  return rss({
    title: site?.name ? `${site.name} 的博客` : "博客",
    description: site?.tagline || "",
    site: context.site!,
    items: posts.map((post: CollectionEntry<"blog">) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.summary,
      link: `/blog/${post.slug}`,
      author: site?.email || "",
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>zh-CN</language>`,
  });
}
