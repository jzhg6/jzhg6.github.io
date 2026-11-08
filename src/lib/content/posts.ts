import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { postCategories, postTypes } from "@/config/taxonomy";
import { isFutureDate } from "@/lib/dates";
import type { Post, PostSearchRecord } from "@/types/post";
import { normalizeSearchText } from "./filter";
import { stripMarkdown } from "./markdown";
import { parsePostFrontmatter } from "./schema";

const postsDirectory = path.join(process.cwd(), "content", "posts");

function estimateReadingMinutes(content: string) {
  const plainText = stripMarkdown(content);
  const cjkCount = (plainText.match(/[㐀-鿿豈-﫿]/g) ?? []).length;
  const latinCount = (plainText.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) ?? []).length;
  return Math.max(1, Math.ceil(cjkCount / 500 + latinCount / 220));
}

const loadPosts = cache(async (): Promise<Post[]> => {
  const fileNames = (await readdir(postsDirectory))
    .filter((fileName) => fileName.endsWith(".md"))
    .sort();
  const seenSlugs = new Set<string>();

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const sourcePath = path.join(postsDirectory, fileName);
      const file = await readFile(sourcePath, "utf8");
      const { data, content } = matter(file);
      const metadata = parsePostFrontmatter(data, fileName);
      const expectedFileName = `${metadata.slug}.md`;

      if (fileName !== expectedFileName) {
        throw new Error(`文章 ${fileName} 的文件名必须与 slug 一致：${expectedFileName}`);
      }
      if (seenSlugs.has(metadata.slug)) {
        throw new Error(`发现重复的文章 slug：${metadata.slug}`);
      }
      seenSlugs.add(metadata.slug);

      const [year, month] = metadata.publishedAt.split("-").map(Number);
      const searchableBody = stripMarkdown(content);
      const searchText = normalizeSearchText(
        [
          metadata.title,
          metadata.summary,
          postTypes[metadata.type].label,
          postCategories[metadata.category],
          metadata.tags.join(" "),
          searchableBody,
        ].join(" "),
      );

      return {
        ...metadata,
        content,
        readingMinutes: estimateReadingMinutes(content),
        year,
        month,
        searchText,
      } satisfies Post;
    }),
  );

  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export const getAllPublishedPosts = cache(async () => {
  const posts = await loadPosts();
  return posts.filter((post) => !post.draft && !isFutureDate(post.publishedAt));
});

export const getLatestPosts = cache(async (limit: number) => {
  const posts = await getAllPublishedPosts();
  return posts.slice(0, limit);
});

export const getPostBySlug = cache(async (slug: string) => {
  const posts = await getAllPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
});

export const getAllPostSlugs = cache(async () => {
  const posts = await getAllPublishedPosts();
  return posts.map((post) => post.slug);
});

export const getPostSearchRecords = cache(async (): Promise<PostSearchRecord[]> => {
  const posts = await getAllPublishedPosts();
  return posts.map(
    ({
      slug,
      title,
      summary,
      publishedAt,
      updatedAt,
      type,
      category,
      tags,
      readingMinutes,
      year,
      month,
      searchText,
    }) => ({
      slug,
      title,
      summary,
      publishedAt,
      updatedAt,
      type,
      category,
      tags,
      readingMinutes,
      year,
      month,
      searchText,
    }),
  );
});

export const getPostTaxonomy = cache(async () => {
  const posts = await getAllPublishedPosts();
  return {
    tags: Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) =>
      a.localeCompare(b, "zh-CN"),
    ),
    years: Array.from(new Set(posts.map((post) => post.year))).sort((a, b) => b - a),
  };
});

export const getAdjacentPosts = cache(async (slug: string) => {
  const posts = await getAllPublishedPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index < 0) return { newer: null, older: null };
  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  };
});
