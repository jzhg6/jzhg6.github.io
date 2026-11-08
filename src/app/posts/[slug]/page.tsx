import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteConfig } from "@/config/site";
import { postCategories, postTypes } from "@/config/taxonomy";
import { getAdjacentPosts, getAllPostSlugs, getPostBySlug } from "@/lib/content/posts";
import { renderMarkdown } from "@/lib/content/markdown";
import { formatDate, parseDate } from "@/lib/dates";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/posts/${post.slug}`,
      title: post.title,
      description: post.summary,
      publishedTime: parseDate(post.publishedAt).toISOString(),
      modifiedTime: parseDate(post.updatedAt ?? post.publishedAt).toISOString(),
      tags: post.tags,
      authors: [siteConfig.author.name],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [html, adjacent] = await Promise.all([
    renderMarkdown(post.content),
    getAdjacentPosts(post.slug),
  ]);

  return (
    <main id="main-content" className="article-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: parseDate(post.publishedAt).toISOString(),
          dateModified: parseDate(post.updatedAt ?? post.publishedAt).toISOString(),
          inLanguage: "zh-CN",
          mainEntityOfPage: absoluteUrl(`/posts/${post.slug}`),
          author: { "@type": "Person", name: siteConfig.author.name },
          publisher: { "@type": "Person", name: siteConfig.author.name },
          keywords: post.tags.join(", "),
        }}
      />

      <article>
        <header className="article-header content-shell">
          <Link className="back-link" href="/posts"><ArrowLeft aria-hidden="true" />返回文章归档</Link>
          <div className="article-kicker">
            <span className={`type-badge type-${post.type}`}>{postTypes[post.type].label}</span>
            <span>{postCategories[post.category]}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="article-summary">{post.summary}</p>
          <div className="article-meta">
            <span><CalendarDays aria-hidden="true" />发布于 <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></span>
            {post.updatedAt ? <span>更新于 <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></span> : null}
            <span><Clock3 aria-hidden="true" />{post.readingMinutes} 分钟阅读</span>
          </div>
          <div className="article-tags" aria-label="文章标签">
            {post.tags.map((tag) => <Link key={tag} href={`/posts?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}
          </div>
        </header>

        <div className="article-rule content-shell" aria-hidden="true"><span /></div>
        <div className="prose-shell">
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>

      <nav className="content-shell adjacent-posts" aria-label="相邻文章">
        {adjacent.newer ? (
          <Link href={`/posts/${adjacent.newer.slug}`}>
            <span><ArrowLeft aria-hidden="true" />更新一篇</span>
            <strong>{adjacent.newer.title}</strong>
          </Link>
        ) : <span />}
        {adjacent.older ? (
          <Link href={`/posts/${adjacent.older.slug}`}>
            <span>更早一篇<ArrowRight aria-hidden="true" /></span>
            <strong>{adjacent.older.title}</strong>
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
