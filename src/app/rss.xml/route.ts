import { Feed } from "feed";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getAllPublishedPosts } from "@/lib/content/posts";
import { parseDate } from "@/lib/dates";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getAllPublishedPosts();
  const feed = new Feed({
    title: `${siteConfig.name} · ${siteConfig.title}`,
    description: siteConfig.description,
    id: absoluteUrl(),
    link: absoluteUrl(),
    language: "zh-CN",
    favicon: absoluteUrl("/icon.svg"),
    copyright: `© ${new Date().getUTCFullYear()} ${siteConfig.author.name}`,
    updated: posts[0] ? parseDate(posts[0].updatedAt ?? posts[0].publishedAt) : new Date(),
    feedLinks: { rss2: absoluteUrl("/rss.xml") },
    author: { name: siteConfig.author.name, email: siteConfig.author.email },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: absoluteUrl(`/posts/${post.slug}`),
      link: absoluteUrl(`/posts/${post.slug}`),
      description: post.summary,
      date: parseDate(post.publishedAt),
      category: post.tags.map((name) => ({ name })),
      author: [{ name: siteConfig.author.name, email: siteConfig.author.email }],
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
