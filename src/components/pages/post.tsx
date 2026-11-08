import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { localizedPath, t, type Locale } from "@/config/i18n";
import { postCategories, postTypes } from "@/config/taxonomy";
import { localeUrl, siteConfig } from "@/config/site";
import { getAdjacentPosts, getPostBySlug } from "@/lib/content/posts";
import { renderMarkdown } from "@/lib/content/markdown";
import { formatDate, parseDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo";

export async function postPageMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const post = await getPostBySlug(slug, locale);
  if (!post) return {};
  const metadata = pageMetadata(locale, `/posts/${post.slug}`, post.title, post.summary, "article");
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: parseDate(post.publishedAt).toISOString(),
      modifiedTime: parseDate(post.updatedAt ?? post.publishedAt).toISOString(),
      authors: [siteConfig.author.name],
      tags: post.tags,
    },
  };
}

export async function PostContent({ slug, locale }: { slug: string; locale: Locale }) {
  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();
  const [html, adjacent] = await Promise.all([renderMarkdown(post.content), getAdjacentPosts(slug, locale)]);
  const labels = t(locale).blog;
  return (
    <main id="main-content" className="article-page site-container">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BlogPosting",
        headline: post.title, description: post.summary,
        datePublished: parseDate(post.publishedAt).toISOString(),
        dateModified: parseDate(post.updatedAt ?? post.publishedAt).toISOString(),
        inLanguage: locale === "en" ? "en" : "zh-CN",
        mainEntityOfPage: localeUrl(locale, `/posts/${post.slug}`),
        author: { "@type": "Person", name: siteConfig.author.name },
        keywords: post.tags.join(", "),
      }} />
      <article>
        <header className="article-header">
          <Link className="back-link" href={localizedPath(locale, "/posts")}>
            <ArrowLeft aria-hidden="true" />{labels.back}
          </Link>
          <div className="article-kicker">
            <span className={`type-badge type-${post.type}`}>{postTypes[locale][post.type].label}</span>
            <span>{postCategories[locale][post.category]}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="article-summary">{post.summary}</p>
          <div className="article-meta">
            <span><CalendarDays aria-hidden="true" />{labels.published} <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time></span>
            {post.updatedAt && <span>{labels.updated} <time dateTime={post.updatedAt}>{formatDate(post.updatedAt, locale)}</time></span>}
            <span><Clock3 aria-hidden="true" />{post.readingMinutes} {labels.reading}</span>
          </div>
          <div className="article-tags" aria-label={labels.tags}>
            {post.tags.map((tag) => <Link key={tag} href={`${localizedPath(locale, "/posts")}?tag=${encodeURIComponent(tag)}`}>
              {tag}</Link>)}
          </div>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <nav className="adjacent-posts" aria-label={locale === "en" ? "More writing" : "其他文章"}>
        {adjacent.newer ? (
          <Link href={localizedPath(locale, `/posts/${adjacent.newer.slug}`)}>
            <span><ArrowLeft aria-hidden="true" />{labels.newer}</span>
            <strong>{adjacent.newer.title}</strong>
          </Link>
        ) : <span />}
        {adjacent.older ? (
          <Link href={localizedPath(locale, `/posts/${adjacent.older.slug}`)}>
            <span>{labels.older}<ArrowRight aria-hidden="true" /></span>
            <strong>{adjacent.older.title}</strong>
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
