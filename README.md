# Ziheng Ji — Research, Projects, Blog

以英文为首选语言的中英双语个人主页，包含 Research、Projects、Blog 和 Repository 入口。姓名即主页导航；主页展示具身智能研究方向、精选项目和最近写作。Blog 提供全文搜索与组合筛选。

## 本地运行

需要 Node.js 22.23.1 或更高版本：

```bash
npm ci
npm run dev
```

英文首页为 <http://localhost:3000/>，中文首页为 <http://localhost:3000/zh/>。点击页头的「中文 / EN」切换语言，文章 slug 保持一致。

## 内容结构与个性化

- [site.ts](src/config/site.ts)：真实姓名、邮箱、GitHub、论文和项目链接；更改链接时核实公开来源。
- [i18n.ts](src/config/i18n.ts)：英文与中文的页面文案和导航。
- [taxonomy.ts](src/config/taxonomy.ts)：文章类型及分类的双语名称。
- `content/posts/<slug>.md`：中文正文；`content/posts/en/<slug>.md`：对应的英文译稿。
- Research 中的 OpenRDMA 论文链接为 arXiv 预印本。XR × Embodied AI 暂为「探索中」卡位，不含未经证实的成果或链接。
- GitHub 和 Email 链接可点击；Google Scholar、LinkedIn、ORCID 和 X 标签显示待补状态，不提供假链接。

新增文章时，在两个语言目录里使用相同的 slug、日期、分类、类型和 tags。Frontmatter 示例如下，英文版仅翻译 title、summary 与正文：

```md
---
title: "An English title"
slug: "my-post"
publishedAt: "2026-11-09"
summary: "A summary for archives, search results, and social previews."
type: "essay"
category: "engineering"
tags:
  - TypeScript
draft: false
---

## Start with a second-level heading
```

构建时会校验双语配对，缺少译稿或结构字段不一致会明确报错；`draft: true` 与未来日期文章均不会公开。

## 验证与部署

```bash
npm run check                         # lint + typecheck + unit tests + static build
STATIC_EXPORT_TEST=1 npm run test:e2e # 在 out/ 静态产物上运行浏览器验收
```

首次运行浏览器测试前需执行 `npx playwright install chromium`。`npm run build` 会生成可直接托管的 `out/`；`npm run start` 不适用于静态导出。

推送 `main` 后 GitHub Actions 自动更新 <https://jzhg6.github.io/>。英文 RSS 为 `/feed.xml`，原有中文 RSS 保留 `/rss.xml`。配置与发布步骤见 [DEPLOYMENT.md](DEPLOYMENT.md)。
