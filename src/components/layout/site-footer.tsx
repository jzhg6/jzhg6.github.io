import Link from "next/link";
import { localizedPath, t, type Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const labels = t(locale);
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <p>© {new Date().getUTCFullYear()} {locale === "en" ? siteConfig.author.name : siteConfig.author.nameZh}
          <span className="footer-separator">·</span>{labels.footer}
        </p>
        <div className="footer-links">
          <Link href={localizedPath(locale, "/about")}>{labels.nav.about}</Link>
          <a href={locale === "en" ? "/feed.xml" : "/rss.xml"}>RSS</a>
          <a href={`mailto:${siteConfig.author.email}`}>{labels.social.email}</a>
        </div>
      </div>
    </footer>
  );
}
