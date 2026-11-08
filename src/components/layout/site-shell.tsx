import type { Locale } from "@/config/i18n";
import { t } from "@/config/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function SiteShell({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <html lang={locale === "en" ? "en" : "zh-CN"} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main-content">{t(locale).skip}</a>
          <SiteHeader locale={locale} />
          {children}
          <SiteFooter locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
