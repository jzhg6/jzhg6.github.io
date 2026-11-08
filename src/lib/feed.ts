import { Feed } from "feed";
import { localizedPath, type Locale } from "@/config/i18n";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getAllPublishedPosts } from "@/lib/content/posts";
import { parseDate } from "@/lib/dates";

export async function createFeed(locale: Locale) {
  const posts = await getAllPublishedPosts(locale);
  const feedPath = locale === "en" ? "/feed.xml" : "/rss.xml";
  const title = locale === "en" ? siteConfig.name : siteConfig.nameZh;
  const feed = new Feed({
    title: `${title} · ${locale === "en" ? "Blog" : "博客"}`,
    description: locale === "en" ? siteConfig.description : siteConfig.descriptionZh,
    id: absoluteUrl(localizedPath(locale)),
    link: absoluteUrl(localizedPath(locale)),
    language: locale === "en" ? "en" : "zh-CN",
    favicon: absoluteUrl("/icon.svg"),
    copyright: `© ${new Date().getUTCFullYear()} ${siteConfig.author.name}`,
    updated: posts[0] ? parseDate(posts[0].updatedAt ?? posts[0].publishedAt) : new Date(),
    feedLinks: { rss2: absoluteUrl(feedPath) },
    author: { name: siteConfig.author.name, email: siteConfig.author.email },
  });
  for (const post of posts) {
    const url = absoluteUrl(localizedPath(locale, `/posts/${post.slug}/`));
    feed.addItem({
      title: post.title, id: url, link: url, description: post.summary,
      date: parseDate(post.publishedAt),
      category: post.tags.map((name) => ({ name })),
      author: [{ name: siteConfig.author.name, email: siteConfig.author.email }],
    });
  }
  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
