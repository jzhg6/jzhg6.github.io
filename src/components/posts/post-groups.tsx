import { postCountLabel, type Locale } from "@/config/i18n";
import { formatMonth } from "@/lib/dates";
import type { PostSearchRecord } from "@/types/post";
import { PostRow } from "./post-row";

interface PostGroupsProps {
  posts: PostSearchRecord[];
  locale: Locale;
  onTagClick?: (tag: string) => void;
  openAll?: boolean;
}

interface MonthGroup {
  year: number;
  month: number;
  posts: PostSearchRecord[];
}

function groupPosts(posts: PostSearchRecord[]) {
  const groups = new Map<string, MonthGroup>();
  for (const post of posts) {
    const key = `${post.year}-${post.month}`;
    const group = groups.get(key) ?? { year: post.year, month: post.month, posts: [] };
    group.posts.push(post);
    groups.set(key, group);
  }
  return Array.from(groups.values());
}

export function PostGroups({ posts, locale, onTagClick, openAll = false }: PostGroupsProps) {
  const groups = groupPosts(posts);
  return (
    <div className="post-groups">
      {groups.map((group, index) => {
        const showYear = groups[index - 1]?.year !== group.year;
        const groupId = `month-${group.year}-${String(group.month).padStart(2, "0")}`;
        return (
          <section key={`${groupId}-${openAll ? "open" : "default"}`} className="archive-block">
            {showYear && (
              <div className="year-heading" id={`year-${group.year}`}>
                <span>{group.year}</span>
                <span>{postCountLabel(groups.filter((item) => item.year === group.year)
                  .reduce((total, item) => total + item.posts.length, 0), locale)}</span>
              </div>
            )}
            <details className="month-group" open={openAll || index === 0}>
              <summary id={groupId}>
                <span>{formatMonth(group.month, locale)}</span>
                <span>{postCountLabel(group.posts.length, locale)}</span>
              </summary>
              <div className="month-posts">
                {group.posts.map((post) => (
                  <PostRow key={post.slug} post={post} locale={locale} onTagClick={onTagClick} />
                ))}
              </div>
            </details>
          </section>
        );
      })}
    </div>
  );
}
