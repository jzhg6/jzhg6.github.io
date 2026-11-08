import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("首页可以进入文章归档和详情", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("正在形成的想法");
  await page.getByRole("link", { name: /浏览全部文章/ }).click();
  await expect(page).toHaveURL(/\/posts\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("沿着时间");
  await page.getByRole("link", { name: /把个人博客做成一份可持续的工作日志/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("个人博客");
});

test("搜索与筛选状态写入 URL 并可恢复", async ({ page }) => {
  await page.goto("/posts");
  const search = page.getByRole("searchbox", { name: /搜索文章/ });
  await search.fill("RDMA ACK");
  await expect(page).toHaveURL(/q=RDMA(?:\+|%20)ACK/);
  await expect(page.getByTestId("post-row")).toHaveCount(1);
  await expect(page.getByRole("link", { name: /RDMA 重传边界/ })).toBeVisible();

  await page.reload();
  await expect(search).toHaveValue("RDMA ACK");
  await expect(page.getByTestId("post-row")).toHaveCount(1);
  await page.getByRole("button", { name: "清除全部" }).click();
  await expect(page).toHaveURL(/\/posts\/?$/);
});

test("深浅主题会在刷新后保留", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /切换到.*主题/ }).first();
  const initialDark = await page.locator("html").evaluate((element) => element.classList.contains("dark"));
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(initialDark ? /light/ : /dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(initialDark ? /light/ : /dark/);
});

test("主要页面没有 serious 或 critical 可访问性问题", async ({ page }) => {
  for (const path of ["/", "/posts", "/posts/shipping-static-search", "/about"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const severe = results.violations.filter((violation) =>
      violation.impact === "serious" || violation.impact === "critical",
    );
    expect(severe, `${path} 存在严重可访问性问题`).toEqual([]);
  }
});

test("移动导航可以打开并完成页面跳转", async ({ page, isMobile }) => {
  test.skip(!isMobile, "仅在移动端项目中验证菜单");
  await page.goto("/");
  await page.getByRole("button", { name: "打开导航菜单" }).click();
  const mobileNav = page.getByRole("navigation", { name: "移动端主导航" });
  await expect(mobileNav).toBeVisible();
  await mobileNav.getByRole("link", { name: /关于/ }).click();
  await expect(page).toHaveURL(/\/about\/?$/);
});

test("320px 宽度下主要页面没有横向溢出", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ["/", "/posts", "/posts/shipping-static-search", "/about"]) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content, `${path} 出现横向溢出`).toBeLessThanOrEqual(dimensions.viewport);
  }
});

test("RSS、sitemap 和 robots 可访问", async ({ request }) => {
  const rss = await request.get("/rss.xml");
  expect(rss.ok()).toBeTruthy();
  expect(rss.headers()["content-type"]).toMatch(/application\/(?:rss\+xml|xml)/);
  expect(await rss.text()).toContain("把个人博客做成一份可持续的工作日志");

  for (const path of ["/sitemap.xml", "/robots.txt"]) {
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
  }
});
