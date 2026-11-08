const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteConfig = {
  name: "未命名手记",
  shortName: "YN",
  title: "个人工作日志",
  description: "记录工程实践、阅读思考，以及持续构建过程中的细小发现。",
  url: configuredUrl ?? "https://jzhg6.github.io",
  locale: "zh-CN",
  author: {
    name: "你的名字",
    role: "工程师 / 独立创作者",
    email: "hello@example.com",
  },
  home: {
    eyebrow: "数字手记 · 持续更新",
    headline: "把正在形成的想法，\n整理成可以回看的坐标。",
    introduction:
      "这里收集工程笔记、项目复盘与阅读记录。它不是一份结论清单，而是一条持续生长的工作轨迹。",
  },
  about: {
    heading: "关于这本手记",
    paragraphs: [
      "你好，我是一名关注系统、网络与开发工具的工程师。这个网站用于记录那些值得被保留下来的推理过程，而不只展示最终答案。",
      "这里的内容会随着实践继续修订。你可以把它当作一间开放的数字工作室：有完整文章，也有短笔记和仍在推进的项目。",
    ],
    now: [
      "整理工程实践中的可复用方法",
      "阅读计算机系统与网络方向的论文",
      "构建更安静、可靠的个人知识工作流",
    ],
  },
  links: [
    { label: "代码主页", href: "https://example.com" },
    { label: "联系我", href: "mailto:hello@example.com" },
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}
