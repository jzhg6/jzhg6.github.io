import Link from "next/link";
import { localizedPath, t, type Locale } from "@/config/i18n";
import { postCategories, postTypes } from "@/config/taxonomy";
import { formatShortDate } from "@/lib/dates";
import type { PostSearchRecord } from "@/types/post";

interface PostRowProps {
  post: PostSearchRecord;
  locale: Locale;
  onTagClick?: (tag: string) => void;
}

export function PostRow({ post, locale, onTagClick }: PostRowProps) {
  return (
    <article className="post-row" data-testid="post-row">
      <div className="post-row-date">
        <time dateTime={post.publishedAt}>{formatShortDate(post.publishedAt)}</time>
        <span className={`type-badge type-${post.type}`}>{postTypes[locale][post.type].label}</span>
      </div>
      <div className="post-row-body">
        <Link className="post-row-title" href={localizedPath(locale, `/posts/${post.slug}`)}>
          {post.title}<span aria-hidden="true" className="post-arrow">↗</span>
        </Link>
        <p>{post.summary}</p>
        <div className="post-row-meta">
          <span>{postCategories[locale][post.category]}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} {t(locale).blog.reading}</span>
          <span aria-hidden="true">·</span>
          <div className="tag-list" aria-label={t(locale).blog.tags}>
            {post.tags.map((tag) => onTagClick ? (
              <button key={tag} type="button" onClick={() => onTagClick(tag)}>{tag}</button>
            ) : (
              <Link key={tag} href={`${localizedPath(locale, "/posts")}?tag=${encodeURIComponent(tag)}`}>
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
