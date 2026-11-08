import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type { Locale } from "@/config/i18n";
import { postCategories, postTypes } from "@/config/taxonomy";
import { isFutureDate } from "@/lib/dates";
import type { Post, PostSearchRecord } from "@/types/post";
import { normalizeSearchText } from "./filter";
import { stripMarkdown } from "./markdown";
import { parsePostFrontmatter } from "./schema";

const contentDirectory = path.join(process.cwd(), "content", "posts");

function estimateReadingMinutes(content: string) {
  const plainText = stripMarkdown(content);
  const cjkCount = (plainText.match(/[㐀-鿿豈-﫿]/g) ?? []).length;
  const latinCount = (plainText.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) ?? []).length;
  return Math.max(1, Math.ceil(cjkCount / 500 + latinCount / 220));
}

const loadPosts = cache(async (locale: Locale): Promise<Post[]> => {
  const directory = locale === "en" ? path.join(contentDirectory, "en") : contentDirectory;
  const fileNames = (await readdir(directory)).filter((name) => name.endsWith(".md")).sort();
  const seenSlugs = new Set<string>();

  const posts = await Promise.all(fileNames.map(async (fileName) => {
    const source = locale === "en" ? `en/${fileName}` : fileName;
    const { data, content } = matter(await readFile(path.join(directory, fileName), "utf8"));
    const metadata = parsePostFrontmatter(data, source);

    if (fileName !== `${metadata.slug}.md`) {
      throw new Error(`文章 ${source} 的文件名必须与 slug 一致：${metadata.slug}.md`);
    }
    if (seenSlugs.has(metadata.slug)) {
      throw new Error(`发现重复的文章 slug：${metadata.slug} (${locale})`);
    }
    seenSlugs.add(metadata.slug);

    const [year, month] = metadata.publishedAt.split("-").map(Number);
    const searchText = normalizeSearchText([
      metadata.title,
      metadata.summary,
      postTypes[locale][metadata.type].label,
      postCategories[locale][metadata.category],
      metadata.tags.join(" "),
      stripMarkdown(content),
    ].join(" "));

    return {
      ...metadata,
      content,
      readingMinutes: estimateReadingMinutes(content),
      year,
      month,
      searchText,
    } satisfies Post;
  }));

  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

const getAllTranslations = cache(async () => {
  const [english, chinese] = await Promise.all([loadPosts("en"), loadPosts("zh")]);
  const chineseBySlug = new Map(chinese.map((post) => [post.slug, post]));
  const englishSlugs = new Set(english.map((post) => post.slug));

  for (const post of english) {
    const original = chineseBySlug.get(post.slug);
    if (!original) throw new Error(`英文文章 ${post.slug} 缺少中文原文`);
    for (const field of ["publishedAt", "updatedAt", "type", "category", "draft"] as const) {
      if (post[field] !== original[field]) {
        throw new Error(`文章 ${post.slug} 的 ${field} 在中英文版本中不一致`);
      }
    }
    if (post.tags.join("\0") !== original.tags.join("\0")) {
      throw new Error(`文章 ${post.slug} 的 tags 在中英文版本中不一致`);
    }
  }
  for (const post of chinese) {
    if (!englishSlugs.has(post.slug)) throw new Error(`中文文章 ${post.slug} 缺少英文翻译`);
  }
  return { en: english, zh: chinese };
});

export const getAllPublishedPosts = cache(async (locale: Locale = "zh") => {
  const posts = (await getAllTranslations())[locale];
  return posts.filter((post) => !post.draft && !isFutureDate(post.publishedAt));
});

export const getLatestPosts = cache(async (limit: number, locale: Locale = "zh") => {
  const posts = await getAllPublishedPosts(locale);
  return posts.slice(0, limit);
});

export const getPostBySlug = cache(async (slug: string, locale: Locale = "zh") => {
  const posts = await getAllPublishedPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
});

export const getAllPostSlugs = cache(async (locale: Locale = "zh") => {
  const posts = await getAllPublishedPosts(locale);
  return posts.map((post) => post.slug);
});

export const getPostSearchRecords = cache(async (locale: Locale = "zh"): Promise<PostSearchRecord[]> => {
  const posts = await getAllPublishedPosts(locale);
  return posts.map(({
    slug, title, summary, publishedAt, updatedAt, type, category, tags,
    readingMinutes, year, month, searchText,
  }) => ({
    slug, title, summary, publishedAt, updatedAt, type, category, tags,
    readingMinutes, year, month, searchText,
  }));
});

export const getPostTaxonomy = cache(async (locale: Locale = "zh") => {
  const posts = await getAllPublishedPosts(locale);
  return {
    tags: Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b)),
    years: Array.from(new Set(posts.map((post) => post.year))).sort((a, b) => b - a),
  };
});

export const getAdjacentPosts = cache(async (slug: string, locale: Locale = "zh") => {
  const posts = await getAllPublishedPosts(locale);
  const index = posts.findIndex((post) => post.slug === slug);
  if (index < 0) return { newer: null, older: null };
  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  };
});
