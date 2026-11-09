import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("英文主页、姓名导航与公开资料", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Hi, I'm Ziheng." })).toBeVisible();
  await expect(page.getByText("XR × Embodied AI")).toBeVisible();
  await expect(page.getByText("OpenRDMA", { exact: true })).toBeVisible();
  await expect(page.locator("#openrdma-preview > a")).toHaveAttribute("href", "https://github.com/open-rdma/open-rdma");
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/jzhg6");
  await expect(page.locator(".social-links").getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:ziheng830@connect.hku.hk");
  await expect(page.getByText("Google Scholar")).toBeVisible();
  if (isMobile) await page.getByRole("button", { name: "Open navigation menu" }).click();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  for (const item of ["Research", "Projects", "Blog", "Repository"]) {
    await expect(nav.getByRole("link", { name: new RegExp(item) })).toBeVisible();
  }
  await expect(nav.getByRole("link", { name: /Repository/ })).toHaveAttribute("href", /\/repositories\/?$/);
  await page.getByRole("link", { name: "Ziheng Ji." }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("语言切换保持页面与文章 slug，正文完整翻译", async ({ page }) => {
  await page.goto("/posts/openrdma-paper-release/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("OpenRDMA Paper Release");
  await page.getByRole("link", { name: "切换到中文" }).click();
  await expect(page).toHaveURL(/\/zh\/posts\/openrdma-paper-release\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("OpenRDMA 论文发布");
  await expect(page.locator(".prose")).toContainText("8 字节 Doorbell");
  await page.getByRole("link", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/posts\/openrdma-paper-release\/$/);
  await expect(page.locator(".prose")).toContainText("8-byte doorbell");
});

test("两种语言的筛选 URL 均可分享并保持独立搜索", async ({ page }) => {
  await page.goto("/posts/");
  const search = page.getByRole("searchbox", { name: /Search titles/ });
  await search.fill("OpenRDMA");
  await expect(page).toHaveURL(/q=OpenRDMA/);
  await expect(page.getByTestId("post-row")).toHaveCount(1);
  await page.reload();
  await expect(search).toHaveValue("OpenRDMA");
  await page.getByRole("link", { name: "切换到中文" }).click();
  await expect(page).toHaveURL(/\/zh\/posts\/\?q=OpenRDMA/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByTestId("post-row")).toHaveCount(1);
  await page.getByRole("button", { name: "清除全部" }).click();
  await expect(page).toHaveURL(/\/zh\/posts\/$/);
  await page.getByRole("searchbox", { name: /搜索文章/ }).fill("门铃");
  await expect(page.getByTestId("post-row")).toHaveCount(1);
});

test("Research 和 Projects 只展示可核实内容", async ({ page }) => {
  await page.goto("/research/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Research");
  await expect(page.getByText("OpenRDMA: A GPU-Native Multi-Path Reliable RDMA Transport Architecture")).toBeVisible();
  await expect(page.getByRole("link", { name: /Read paper/ })).toHaveAttribute("href", "https://arxiv.org/abs/2611.07559");
  await page.goto("/projects/");
  await expect(page.locator("#xr-embodied-ai")).toContainText("in progress");
  await expect(page.locator("#xr-embodied-ai a")).toHaveCount(0);
  await expect(page.locator("#openrdma h2 a")).toHaveAttribute("href", "https://github.com/open-rdma/open-rdma");
  await expect(page.getByRole("link", { name: /Source code/ })).toHaveAttribute("href", "https://github.com/jzhg6/GraphicalHDL");
});

test("Repository 页面列出 GitHub 公开仓库", async ({ page }) => {
  await page.goto("/repositories/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Repositories");
  await expect(page.locator(".repo-card")).toHaveCount(5);
  await expect(page.getByRole("link", { name: "jzhg6.github.io" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "open-rdma", exact: true })).toHaveAttribute("href", "https://github.com/open-rdma/open-rdma");
  await expect(page.getByRole("link", { name: "open-rdma-rtl" })).toHaveAttribute("href", "https://github.com/open-rdma/open-rdma-rtl");
  await page.getByRole("link", { name: /中文/ }).click();
  await expect(page).toHaveURL(/\/zh\/repositories\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("代码仓库");
  await expect(page.locator(".repo-card")).toHaveCount(5);
});

test("OpenRDMA 论文推文在中英文博客中展示且图片可用", async ({ page }) => {
  await page.goto("/posts/");
  await expect(page.getByRole("link", { name: /OpenRDMA Paper Release/ })).toBeVisible();
  await page.goto("/posts/openrdma-paper-release/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("OpenRDMA Paper Release");
  const images = page.locator(".prose img");
  await expect(images).toHaveCount(4);
  for (const src of await images.evaluateAll((elements) => elements.map((element) => element.getAttribute("src")))) {
    expect(src).toBeTruthy();
    expect((await page.request.get(src!)).ok()).toBeTruthy();
  }
  await page.getByRole("link", { name: /中文/ }).click();
  await expect(page).toHaveURL(/\/zh\/posts\/openrdma-paper-release\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("OpenRDMA 论文发布");
  await expect(page.locator(".prose img")).toHaveCount(4);
});

test("主题切换在刷新后保持", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Switch to.*theme/ }).first();
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("移动菜单可用键盘和触控导航", async ({ page, isMobile }) => {
  test.skip(!isMobile, "仅验证移动端菜单");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
});

test("主要页面在 320px 不出现横向溢出", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ["/", "/zh/", "/research/", "/projects/", "/repositories/", "/zh/repositories/", "/posts/", "/posts/openrdma-paper-release/", "/zh/posts/openrdma-paper-release/"]) {
    await page.goto(path);
    const size = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(size.content, `${path} 出现横向溢出`).toBeLessThanOrEqual(size.viewport);
  }
});

test("主要页面无严重可访问性问题", async ({ page }) => {
  for (const path of ["/", "/zh/", "/research/", "/projects/", "/repositories/", "/zh/repositories/", "/posts/", "/zh/posts/", "/posts/openrdma-paper-release/"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical"), `${path} 可访问性问题`).toEqual([]);
  }
});

test("两种语言的 RSS、sitemap 与 SEO 可访问", async ({ request, page }) => {
  for (const path of ["/feed.xml", "/rss.xml", "/sitemap.xml", "/robots.txt", "/opengraph-image.png"]) {
    const response = await request.get(path);
    expect(response.ok(), `${path} 返回错误`).toBeTruthy();
  }
  const en = await (await request.get("/feed.xml")).text();
  const zh = await (await request.get("/rss.xml")).text();
  expect(en).toContain("OpenRDMA Paper Release");
  expect(zh).toContain("OpenRDMA 论文发布");
  await page.goto("/posts/openrdma-paper-release/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://jzhg6.github.io/posts/openrdma-paper-release/");
  await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute("href", "https://jzhg6.github.io/zh/posts/openrdma-paper-release/");
});
