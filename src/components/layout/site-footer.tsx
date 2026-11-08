import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wide-shell footer-grid">
        <div>
          <div className="footer-mark" aria-hidden="true">
            {siteConfig.shortName}
          </div>
          <p>{siteConfig.description}</p>
        </div>

        <div className="footer-links" aria-label="页脚链接">
          <Link href="/posts">全部文章</Link>
          <Link href="/about">关于我</Link>
          <a href="/rss.xml">RSS 订阅</a>
          {siteConfig.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
              {link.href.startsWith("http") ? <ArrowUpRight aria-hidden="true" /> : null}
            </a>
          ))}
        </div>
      </div>
      <div className="wide-shell footer-bottom">
        <span>© {new Date().getUTCFullYear()} {siteConfig.author.name}</span>
        <span>用 Markdown 与好奇心持续构建</span>
      </div>
    </footer>
  );
}
