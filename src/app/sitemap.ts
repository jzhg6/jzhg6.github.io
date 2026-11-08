import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getAllPublishedPosts } from "@/lib/content/posts";
import { parseDate } from "@/lib/dates";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts();
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl(), lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/posts"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    lastModified: parseDate(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}
