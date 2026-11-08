"use client";

import { Menu, Rss, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "文章" },
  { href: "/about", label: "关于" },
] as const;

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [openAtPath, setOpenAtPath] = useState<string | null>(null);
  const mobileOpen = openAtPath === pathname;

  return (
    <header className="site-header">
      <div className="wide-shell header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            {siteConfig.shortName}
          </span>
          <span className="brand-copy">
            <strong>{siteConfig.name}</strong>
            <small>{siteConfig.title}</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <a href="/rss.xml" className="rss-link" aria-label="订阅 RSS">
            <Rss aria-hidden="true" />
            <span>RSS</span>
          </a>
          <ThemeToggle />
        </nav>

        <div className="mobile-actions">
          <ThemeToggle />
          <button
            type="button"
            className="icon-button"
            aria-label={mobileOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setOpenAtPath(mobileOpen ? null : pathname)}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="移动端主导航">
          <div className="wide-shell mobile-nav-inner">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
              >
                <span>{item.label}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
            <a href="/rss.xml">
              <span>订阅 RSS</span>
              <Rss aria-hidden="true" />
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
