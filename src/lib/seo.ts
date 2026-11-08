import type { Metadata } from "next";
import { localizedPath, type Locale } from "@/config/i18n";
import { absoluteUrl, siteConfig } from "@/config/site";

export function pageAlternates(locale: Locale, path = "/") {
  return {
    canonical: absoluteUrl(localizedPath(locale, path)),
    languages: {
      en: absoluteUrl(localizedPath("en", path)),
      "zh-CN": absoluteUrl(localizedPath("zh", path)),
      "x-default": absoluteUrl(localizedPath("en", path)),
    },
  };
}

export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  type: "website" | "article" = "website",
): Metadata {
  const url = absoluteUrl(localizedPath(locale, path));
  return {
    title,
    description,
    alternates: {
      ...pageAlternates(locale, path),
      types: { "application/rss+xml": locale === "en" ? "/feed.xml" : "/rss.xml" },
    },
    openGraph: {
      type,
      locale: locale === "en" ? "en_US" : "zh_CN",
      siteName: siteConfig.name,
      title,
      description,
      url,
      images: [absoluteUrl("/opengraph-image.png")],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl("/opengraph-image.png")] },
  };
}

export function rootMetadata(locale: Locale): Metadata {
  const title = locale === "en" ? siteConfig.name : siteConfig.nameZh;
  const description = locale === "en" ? siteConfig.description : siteConfig.descriptionZh;
  return {
    ...pageMetadata(locale, "/", title, description),
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s · ${title}` },
    authors: [{ name: locale === "en" ? siteConfig.author.name : siteConfig.author.nameZh }],
    creator: siteConfig.author.name,
    alternates: {
      ...pageAlternates(locale),
      types: { "application/rss+xml": locale === "en" ? "/feed.xml" : "/rss.xml" },
    },
  };
}
