import { describe, expect, it } from "vitest";
import { repositories } from "@/config/repositories";

describe("GitHub 仓库数据", () => {
  it("只包含主页固定的 5 个仓库且名称唯一", () => {
    expect(repositories).toHaveLength(5);
    expect(new Set(repositories.map((repo) => repo.name)).size).toBe(repositories.length);
  });

  it("所有链接指向 jzhg6 或 open-rdma 的 GitHub 仓库", () => {
    for (const repo of repositories) {
      expect(repo.url).toMatch(/^https:\/\/github\.com\/(?:jzhg6|open-rdma)\/[\w.-]+$/);
    }
    expect(repositories.map((repo) => repo.url)).toContain("https://github.com/open-rdma/open-rdma");
    expect(repositories.map((repo) => repo.url)).toContain("https://github.com/open-rdma/open-rdma-rtl");
  });

  it("每个仓库都有可展示的中英文描述或明确空状态", () => {
    for (const repo of repositories) {
      for (const locale of ["en", "zh"] as const) {
        const description = repo.description[locale];
        expect(description === null || description.trim().length > 0).toBe(true);
      }
    }
  });
});
