import type { Metadata } from "next";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { SiteShell } from "@/components/layout/site-shell";
import { rootMetadata } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = rootMetadata("zh");

export default function ChineseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="zh">{children}</SiteShell>;
}
