export interface Repository {
  name: string;
  url: string;
  description: { en: string | null; zh: string | null };
  language: string | null;
  stars: number;
  forks: number;
  fork: boolean;
}

// Snapshot of https://github.com/jzhg6?tab=repositories, captured 2026-11-09.
export const repositories: Repository[] = [
  {
    name: "jzhg6.github.io",
    url: "https://github.com/jzhg6/jzhg6.github.io",
    description: { en: "Personal worklog and blog.", zh: "个人工作日志与博客。" },
    language: "TypeScript",
    stars: 0,
    forks: 0,
    fork: false,
  },
  {
    name: "GraphicalHDL",
    url: "https://github.com/jzhg6/GraphicalHDL",
    description: {
      en: "A three-layer graphical hardware design compiler that turns architecture JSON into synthesizable SystemVerilog.",
      zh: "三层图形化硬件设计编译器，将架构图 JSON 生成可综合 SystemVerilog。",
    },
    language: "TypeScript",
    stars: 1,
    forks: 0,
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
    name: "ai-website-cloner",
    url: "https://github.com/jzhg6/ai-website-cloner",
    description: { en: null, zh: null },
    language: "TypeScript",
    stars: 1,
    forks: 0,
    fork: false,
  },
  {
    name: "open-rdma",
    url: "https://github.com/jzhg6/open-rdma",
    description: {
      en: "The main Open-RDMA project repository: introduction, getting-started guide, new events, and more.",
      zh: "Open-RDMA 项目主仓库：项目介绍、上手指南、最新活动与更多内容。",
    },
    language: null,
    stars: 1,
    forks: 0,
    fork: true,
  },
  {
    name: "Tutorial_2022",
    url: "https://github.com/jzhg6/Tutorial_2022",
    description: { en: null, zh: null },
    language: null,
    stars: 0,
    forks: 0,
    fork: true,
  },
];
