"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localizedPath, otherLocale, t, type Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const sections = [
  { path: "/research", key: "research" },
  { path: "/projects", key: "projects" },
  { path: "/posts", key: "blog" },
] as const;

function LanguageLink({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const basePath = locale === "zh" ? pathname.replace(/^\/zh(?=\/|$)/, "") || "/" : pathname;
  const target = localizedPath(otherLocale(locale), basePath);

  return (
    <a className="language-link" href={target} lang={locale === "en" ? "zh-CN" : "en"}
      aria-label={locale === "en" ? `中文 · ${t(locale).switchChinese}` : `EN · ${t(locale).switchEnglish}`}
      onClick={(event) => {
        if (basePath.startsWith("/posts") && window.location.search) {
          event.currentTarget.href = `${target}${window.location.search}`;
        }
      }}
    >
      {locale === "en" ? "中文" : "EN"}
    </a>
  );
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [openAtPath, setOpenAtPath] = useState<string | null>(null);
  const mobileOpen = openAtPath === pathname;
  const labels = t(locale);

  const nav = sections.map(({ path, key }) => {
    const href = localizedPath(locale, path);
    return (
      <Link key={key} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}
        onClick={() => setOpenAtPath(null)}
      >{labels.nav[key]}</Link>
    );
  });

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href={localizedPath(locale)} className="brand" aria-current={pathname === localizedPath(locale) ? "page" : undefined}>
          {locale === "en" ? siteConfig.name : siteConfig.nameZh}
        </Link>
        <nav className="desktop-nav" aria-label={labels.navLabel}>
          {nav}
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="external-nav">
            {labels.nav.repository} <ArrowUpRight aria-hidden="true" />
          </a>
          <span className="nav-divider" aria-hidden="true" />
          <LanguageLink locale={locale} />
          <ThemeToggle locale={locale} />
        </nav>
        <div className="mobile-actions">
          <LanguageLink locale={locale} />
          <ThemeToggle locale={locale} />
          <button type="button" className="icon-button" aria-label={mobileOpen ? labels.menuClose : labels.menuOpen}
            aria-expanded={mobileOpen} aria-controls="mobile-navigation"
            onClick={() => setOpenAtPath(mobileOpen ? null : pathname)}
          >{mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label={labels.navLabel}>
          <div className="site-container mobile-nav-inner">
            {nav}
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
              {labels.nav.repository} <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
