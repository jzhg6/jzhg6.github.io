import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import { localizedPath, otherLocale, t } from "@/config/i18n";
import { parsePostFrontmatter } from "@/lib/content/schema";
import { formatDate } from "@/lib/dates";

describe("双语站点", () => {
  it("英文使用根路径，中文保留同一文章 slug", () => {
    expect(localizedPath("en", "/posts/openrdma-paper-release")).toBe("/posts/openrdma-paper-release");
    expect(localizedPath("zh", "/posts/openrdma-paper-release")).toBe("/zh/posts/openrdma-paper-release");
    expect(localizedPath("zh")).toBe("/zh/");
    expect(otherLocale("en")).toBe("zh");
    expect(t("en").nav.research).toBe("Research");
  });

  it("日期随语言格式化，不受运行环境时区影响", () => {
    expect(formatDate("2026-11-05", "en")).toBe("November 5, 2026");
    expect(formatDate("2026-11-05", "zh")).toContain("2026");
  });

  it("所有公开文章都有同 slug 的完整英文译稿", () => {
    const directory = join(process.cwd(), "content", "posts");
    const chinese = readdirSync(directory).filter((name) => name.endsWith(".md")).sort();
    const english = readdirSync(join(directory, "en")).filter((name) => name.endsWith(".md")).sort();
    expect(english).toEqual(chinese);
    for (const file of chinese) {
      const zh = matter(readFileSync(join(directory, file), "utf8"));
      const en = matter(readFileSync(join(directory, "en", file), "utf8"));
      const zhInfo = parsePostFrontmatter(zh.data, file);
      const enInfo = parsePostFrontmatter(en.data, `en/${file}`);
      expect(enInfo.slug).toBe(zhInfo.slug);
      expect(enInfo.publishedAt).toBe(zhInfo.publishedAt);
      expect(enInfo.tags).toEqual(zhInfo.tags);
      expect(en.content.length).toBeGreaterThan(450);
      expect(enInfo.title).not.toBe(zhInfo.title);
    }
  });
});
