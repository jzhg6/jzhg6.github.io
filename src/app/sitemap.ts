import type { MetadataRoute } from "next";
import { localizedPath, type Locale } from "@/config/i18n";
import { absoluteUrl } from "@/config/site";
import { getAllPublishedPosts } from "@/lib/content/posts";
import { parseDate } from "@/lib/dates";

export const dynamic = "force-static";

function entry(locale: Locale, path: string, lastModified: Date, priority: number): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(localizedPath(locale, path)), lastModified,
    changeFrequency: "monthly", priority,
    alternates: { languages: {
      en: absoluteUrl(localizedPath("en", path)),
      "zh-CN": absoluteUrl(localizedPath("zh", path)),
    } },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts("en");
  const routes = ["/", "/research", "/projects", "/repositories", "/posts", "/about"];
  const entries: MetadataRoute.Sitemap = [];
  for (const path of routes) {
    for (const locale of ["en", "zh"] as const) {
      entries.push(entry(locale, path, new Date(), path === "/" ? 1 : 0.8));
    }
  }
  for (const post of posts) {
    for (const locale of ["en", "zh"] as const) {
      entries.push(entry(locale, `/posts/${post.slug}`, parseDate(post.updatedAt ?? post.publishedAt), 0.7));
    }
  }
  return entries;
}
