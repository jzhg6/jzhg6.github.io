import { describe, expect, it } from "vitest";
import {
  filterPosts,
  normalizeSearchText,
  parseFilterState,
  serializeFilterState,
  type FilterState,
} from "@/lib/content/filter";
import type { PostSearchRecord } from "@/types/post";

const posts: PostSearchRecord[] = [
  {
    slug: "rdma-note",
    title: "RDMA 重传笔记",
    summary: "可靠传输与 ACK",
    publishedAt: "2026-09-24",
    type: "note",
    category: "reading",
    tags: ["RDMA", "Protocol"],
    readingMinutes: 3,
    year: 2026,
    month: 9,
    searchText: normalizeSearchText("RDMA 重传笔记 可靠传输 ACK Protocol"),
  },
  {
    slug: "static-search",
    title: "静态搜索",
    summary: "URL 状态",
    publishedAt: "2025-12-20",
    type: "essay",
    category: "engineering",
    tags: ["Search", "URL"],
    readingMinutes: 4,
    year: 2025,
    month: 12,
    searchText: normalizeSearchText("静态搜索 TypeScript URL 状态"),
  },
];

const empty: FilterState = { query: "", type: null, category: null, tags: [], year: null };

describe("文章筛选", () => {
  it("规范化全角字符、大小写与空白", () => {
    expect(normalizeSearchText("  ＲＤＭＡ   Retry  ")).toBe("rdma retry");
  });

  it("对多个关键词和标签执行 AND 匹配", () => {
    expect(filterPosts(posts, { ...empty, query: "rdma ACK" })).toHaveLength(1);
    expect(filterPosts(posts, { ...empty, tags: ["RDMA", "Protocol"] })[0]?.slug).toBe(
      "rdma-note",
    );
    expect(filterPosts(posts, { ...empty, tags: ["RDMA", "URL"] })).toHaveLength(0);
  });

  it("组合类型、分类和年份", () => {
    const result = filterPosts(posts, {
      ...empty,
      type: "essay",
      category: "engineering",
      year: 2025,
    });
    expect(result.map((post) => post.slug)).toEqual(["static-search"]);
  });

  it("稳定地解析和序列化 URL 状态", () => {
    const params = new URLSearchParams("tag=URL&q=static&type=essay&tag=Search&year=2025");
    const parsed = parseFilterState(params, ["Search", "URL"], [2026, 2025]);
    const serialized = serializeFilterState(parsed);
    expect(serialized.toString()).toBe("q=static&type=essay&tag=Search&tag=URL&year=2025");
  });

  it("忽略未知 taxonomy", () => {
    const parsed = parseFilterState(
      new URLSearchParams("type=video&category=other&tag=Unknown&year=1999"),
      ["RDMA"],
      [2026],
    );
    expect(parsed).toEqual(empty);
  });
});
