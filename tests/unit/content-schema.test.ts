import { describe, expect, it } from "vitest";
import { parsePostFrontmatter } from "@/lib/content/schema";

const validFrontmatter = {
  title: "一篇用于测试的文章",
  slug: "test-post",
  publishedAt: "2026-10-01",
  summary: "这是一段长度足够、用于验证文章元数据解析行为的测试摘要。",
  type: "essay",
  category: "engineering",
  tags: ["TypeScript", "Test"],
  draft: false,
};

describe("文章 frontmatter", () => {
  it("解析合法字段并补齐 featured 默认值", () => {
    const result = parsePostFrontmatter(validFrontmatter, "test-post.md");
    expect(result.featured).toBe(false);
    expect(result.tags).toEqual(["TypeScript", "Test"]);
  });

  it("拒绝不存在的日期", () => {
    expect(() =>
      parsePostFrontmatter({ ...validFrontmatter, publishedAt: "2026-02-30" }, "bad.md"),
    ).toThrow(/publishedAt/);
  });

  it("拒绝早于发布日期的更新时间", () => {
    expect(() =>
      parsePostFrontmatter(
        { ...validFrontmatter, updatedAt: "2026-09-30" },
        "bad-update.md",
      ),
    ).toThrow(/updatedAt/);
  });

  it("拒绝重复标签和未知字段", () => {
    expect(() =>
      parsePostFrontmatter({ ...validFrontmatter, tags: ["Test", "Test"] }, "tags.md"),
    ).toThrow(/不能重复/);
    expect(() =>
      parsePostFrontmatter({ ...validFrontmatter, extra: true }, "extra.md"),
    ).toThrow(/Unrecognized key/);
  });
});
