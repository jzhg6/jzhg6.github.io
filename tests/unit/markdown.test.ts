import { describe, expect, it } from "vitest";
import { renderMarkdown, stripMarkdown } from "@/lib/content/markdown";

describe("Markdown 渲染", () => {
  it("渲染 GFM 表格、标题锚点和代码高亮", async () => {
    const html = await renderMarkdown(`## 标题\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n\`\`\`ts\nconst ok = true;\n\`\`\``);
    expect(html).toContain('<h2 id="标题">');
    expect(html).toContain("<table>");
    expect(html).toContain("language-ts");
    expect(html).toContain("hljs");
    expect(html).toContain('tabindex="0"');
  });

  it("不执行或输出原始 script 标签", async () => {
    const html = await renderMarkdown("正常文字\n\n<script>alert('xss')</script>");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("alert('xss')");
  });

  it("为搜索索引移除 Markdown 装饰", () => {
    expect(stripMarkdown("## 标题\n\n这是 **重点** 和 [链接](https://example.com)。")).toContain(
      "标题 这是 重点 和 链接",
    );
  });
});
