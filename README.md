# 未命名手记

一个以“个人工作日志”为核心的静态博客。页面借鉴 Changelog 的时间线信息架构，但使用独立的品牌、配色、排版与交互设计。

## 功能

- 首页、文章归档、文章详情与 About 页面
- 本地 Markdown 内容管理与严格 frontmatter 校验
- 中文关键词搜索，以及类型、分类、标签和年份组合筛选
- 可分享、可通过浏览器前进/后退恢复的筛选 URL
- light、dark、system 三种主题策略
- 静态生成、RSS、sitemap、robots、Open Graph 与 JSON-LD
- 响应式布局、键盘快捷键与 reduced-motion 支持
- Vitest、Playwright 和 axe 自动化检查

## 本地运行

要求 Node.js 22.23.1 或更高版本。

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

## 个性化

个人资料统一位于：

- `src/config/site.ts`：站点名、作者、简介、联系链接和 About 文案
- `src/config/taxonomy.ts`：文章类型与分类
- `.env.local`：可选的公开地址覆盖配置，例如：

```bash
NEXT_PUBLIC_SITE_URL=https://jzhg6.github.io
```

默认公开地址已设置为 `https://jzhg6.github.io`，GitHub Actions 构建时也会显式指定这一地址。

## 新增文章

在 `content/posts/` 新建 Markdown 文件，文件名必须与 `slug` 一致：

```md
---
title: "文章标题"
slug: "post-slug"
publishedAt: "2026-11-02"
updatedAt: "2026-11-03"
summary: "用于归档、搜索和社交分享的文章摘要。"
type: "essay"
category: "engineering"
tags:
  - TypeScript
  - Next.js
featured: false
draft: false
---

正文从二级标题开始。
```

公开构建会自动排除 `draft: true` 和发布日期在未来的文章。字段错误、重复 slug、未知 taxonomy 或文件名不一致都会使构建失败，并指出对应文件。

## 常用命令

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run test          # Vitest 单元测试
npm run test:e2e      # Playwright 桌面与移动端验收
npm run build         # Next.js 生产构建
npm run check         # lint + typecheck + test + build
```

首次运行 E2E 测试时安装 Chromium：

```bash
npx playwright install chromium
```

## 部署

项目采用 Next.js 静态导出，`npm run build` 会在 `out/` 生成 GitHub Pages 可托管的 HTML、CSS、JS、RSS 和图片。`npm run start` 不适用于静态导出；本地预览产物可运行：

```bash
npm run build
python3 -m http.server 3000 --directory out
```

推送到 `jzhg6/jzhg6.github.io` 的 `main` 分支后，GitHub Actions 自动构建并部署到 <https://jzhg6.github.io>。首次配置与故障排查见 [DEPLOYMENT.md](DEPLOYMENT.md)。
