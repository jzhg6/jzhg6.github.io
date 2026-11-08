---
title: "用静态数据构建可分享的站内搜索"
slug: "shipping-static-search"
publishedAt: "2026-10-12"
summary: "在没有后端搜索服务的前提下，让中文关键词、组合筛选和浏览器历史记录协同工作。"
type: "essay"
category: "engineering"
tags:
  - Search
  - TypeScript
  - URL
featured: true
draft: false
---

## 搜索不一定需要服务端

当文章数量只有几十或几百篇时，引入专门的搜索服务通常会增加更多问题：索引如何同步、服务何时休眠、隐私策略如何说明。静态博客已经在构建阶段掌握全部公开内容，因此可以直接生成一份轻量搜索记录。

记录只包含标题、摘要、分类、标签和规范化后的纯文本，不把 Markdown 原文或渲染后的 HTML 发送到浏览器。

## 先规范化，再匹配

搜索前需要把用户输入和文章文本放到相同的比较空间：

```ts
export function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("zh-CN")
    .replace(/\s+/g, " ")
    .trim();
}
```

NFKC 会统一一部分全角与兼容字符；多个关键词使用 AND 匹配，使“RDMA retry”只返回同时包含两部分语义的文章。首版不做模糊排序，结果始终按发布日期倒序，保留工作日志的时间线含义。

## URL 才是筛选状态的归宿

搜索框、类型、分类、标签和年份都会写入查询参数。例如：

```text
/posts?q=rdma&type=note&tag=Protocol&year=2026
```

这让一个筛选结果可以被复制、收藏和分享，也让刷新及浏览器前进/后退自然恢复状态。输入文字时使用 `replaceState`，避免每个字符都产生一条历史记录；点击筛选项时使用 `pushState`，因为它代表一次明确的导航决定。

真正好用的静态搜索，不是算法复杂，而是状态清楚、行为可预测。
