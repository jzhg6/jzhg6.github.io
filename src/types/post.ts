import type { PostCategory, PostType } from "@/config/taxonomy";

export interface PostImage {
  src: string;
  alt: string;
}

export interface PostFrontmatter {
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  summary: string;
  type: PostType;
  category: PostCategory;
  tags: string[];
  draft: boolean;
  featured: boolean;
  image?: PostImage;
}

export interface Post extends PostFrontmatter {
  content: string;
  readingMinutes: number;
  year: number;
  month: number;
  searchText: string;
}

export interface PostSearchRecord {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  type: PostType;
  category: PostCategory;
  tags: string[];
  readingMinutes: number;
  year: number;
  month: number;
  searchText: string;
}
