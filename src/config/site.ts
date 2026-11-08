import { localizedPath, type Locale } from "./i18n";

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteConfig = {
  name: "Ziheng Ji.",
  nameZh: "姬子珩",
  title: "Research · Projects · Blog",
  description: "Research in embodied intelligence, interactive systems, and the infrastructure behind AI.",
  descriptionZh: "关注具身智能、智能交互，以及支撑 AI 的系统基础设施。",
  url: configuredUrl ?? "https://jzhg6.github.io",
  author: {
    name: "Ji Ziheng",
    nameZh: "姬子珩",
    email: "ziheng830@connect.hku.hk",
  },
  github: "https://github.com/jzhg6",
  paper: "https://arxiv.org/abs/2611.07559",
  graphicalHdl: "https://github.com/jzhg6/GraphicalHDL",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function localeUrl(locale: Locale, path = "/") {
  return absoluteUrl(localizedPath(locale, path));
}
