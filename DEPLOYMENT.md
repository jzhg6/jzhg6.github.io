# GitHub Pages 部署

- **公开地址**：<https://jzhg6.github.io>
- **仓库**：<https://github.com/jzhg6/jzhg6.github.io>
- **分支**：`main`
- **自动部署**：每次推送 `main`，或从 Actions 页面手动运行部署工作流

## 构建与托管

[deploy.yml](.github/workflows/deploy.yml) 使用 Node.js 22.23.1 执行 `npm ci` 和 `npm run check`（ESLint、TypeScript、Vitest、Next.js 构建），再将 `out/` 作为 Pages artifact 发布。`next.config.ts` 使用 `output: "export"` 和 `trailingSlash: true`。英文首选页面在 `/`、`/research/`、`/projects/`、`/posts/`，中文对应页面在 `/zh/` 下；现有文章均有同 slug 的英文译稿。搜索与筛选在浏览器内运行，不依赖后端。

工作流把 `NEXT_PUBLIC_SITE_URL` 设为 `https://jzhg6.github.io`，用于 canonical、Open Graph、RSS 和 sitemap。无需域名、服务器、Cloudflare 或部署密钥。首次部署需在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**；如果已经由 API 启用，则无需再次操作。部署状态见仓库 **Actions** 页或 **Settings → Pages**。

## 发布或修改文章

1. 同步修改 `content/posts/<slug>.md`（中文）与 `content/posts/en/<slug>.md`（英文）。两个文件的 slug、发布日期、类型、分类、标签及草稿状态必须一致；详情见 [README.md](README.md)。
2. 本地运行 `npm run check`；需要用浏览器检查静态产物时，运行 `STATIC_EXPORT_TEST=1 npm run test:e2e`（先安装 Playwright Chromium）。
3. 提交改动并推送到 `main`：

   ```bash
   git add content/posts
   git commit -m "更新博客文章"
   git push origin main
   ```

4. GitHub Actions 构建、部署成功后，访问正式地址检查更新。正文、RSS 和 sitemap 都会随构建自动刷新。

## 本地预览静态站点

```bash
npm ci
npm run build
python3 -m http.server 3000 --directory out
```

浏览器打开 <http://localhost:3000>。静态导出模式下不要运行 `npm run start`；开发时继续使用 `npm run dev`。

## 维护说明

- `out/`、`.next/`、`node_modules/` 和 `.env.local` 已在 `.gitignore` 中，不上传到仓库。
- 首页现在使用 Ji Ziheng / 姬子珩的姓名和公开邮箱。GitHub 链接可用，其余社交平台仍为待补状态；新增主页与研究成果前应在 `src/config/site.ts` 和 `src/config/i18n.ts` 更新真实资料。
- `/feed.xml` 提供英文 RSS，`/rss.xml` 保留中文 RSS；英文页面为默认入口，旧 `/posts/<slug>/` 的 slug 不变，但内容现为英文，原中文对应 `/zh/posts/<slug>/`。
- 若 GitHub Actions 未触发：确认本地推送的是 `main`，并检查仓库 Actions 权限及工作流日志。
- 若 Pages 未发布：确认 Source 为 GitHub Actions，以及 `deploy` job 成功完成；首次启用可能需要数分钟生效。
- 若页面 CSS/JS 缺失：检查 Pages artifact 中的 `out/_next/static/` 和线上对应资源的 HTTP 状态码。
