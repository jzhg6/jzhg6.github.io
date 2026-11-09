export interface Repository {
  name: string;
  url: string;
  description: { en: string | null; zh: string | null };
  language: string | null;
  stars: number;
  forks: number;
  fork: boolean;
}

// Snapshot of the pinned repositories on https://github.com/jzhg6, captured 2026-11-09.
export const repositories: Repository[] = [
  {
    name: "open-rdma",
    url: "https://github.com/open-rdma/open-rdma",
    description: {
      en: "The main Open-RDMA project repository: introduction, getting-started guide, new events, and more.",
      zh: "Open-RDMA 项目主仓库：项目介绍、上手指南、最新活动与更多内容。",
    },
    language: "HTML",
    stars: 396,
    forks: 54,
    fork: false,
  },
  {
    name: "jev-embodied-media-agent",
    url: "https://github.com/jzhg6/jev-embodied-media-agent",
    description: {
      en: "A Jev-based, local-first gesture and gaze media-control agent with guarded page-close intent.",
      zh: "基于 Jev、本地优先的手势与凝视媒体控制 agent，带受保护的页面关闭意图。",
    },
    language: "TypeScript",
    stars: 3,
    forks: 0,
    fork: false,
  },
  {
    name: "ai-website-cloner",
    url: "https://github.com/jzhg6/ai-website-cloner",
    description: { en: null, zh: null },
    language: "TypeScript",
    stars: 1,
    forks: 0,
    fork: false,
  },
  {
    name: "claude-remote-notifier",
    url: "https://github.com/jzhg6/claude-remote-notifier",
    description: {
      en: "Reliable native Windows notifications for Claude Code over VS Code Remote-SSH, using a port-free workspace event spool.",
      zh: "通过 VS Code Remote-SSH 为 Claude Code 提供可靠的 Windows 原生通知，使用无端口的工作区事件暂存。",
    },
    language: "TypeScript",
    stars: 1,
    forks: 0,
    fork: false,
  },
  {
    name: "open-rdma-rtl",
    url: "https://github.com/open-rdma/open-rdma-rtl",
    description: { en: null, zh: null },
    language: "Python",
    stars: 25,
    forks: 10,
    fork: false,
  },
];
