import { formatMonth } from "@/lib/dates";
import type { PostSearchRecord } from "@/types/post";
import { PostRow } from "./post-row";

interface PostGroupsProps {
  posts: PostSearchRecord[];
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

export function PostGroups({ posts, onTagClick, openAll = false }: PostGroupsProps) {
  const groups = groupPosts(posts);

  return (
    <div className="post-groups">
      {groups.map((group, index) => {
        const previousYear = groups[index - 1]?.year;
        const showYear = previousYear !== group.year;
        const groupId = `month-${group.year}-${String(group.month).padStart(2, "0")}`;

        return (
          <section key={`${groupId}-${openAll ? "open" : "default"}`} className="archive-block">
            {showYear ? (
              <div className="year-heading" id={`year-${group.year}`}>
                <span>{group.year}</span>
                <span>{groups.filter((item) => item.year === group.year).reduce((total, item) => total + item.posts.length, 0)} 篇</span>
              </div>
            ) : null}
            <details className="month-group" open={openAll || index === 0}>
              <summary id={groupId}>
                <span>{formatMonth(group.month)}</span>
                <span>{group.posts.length} 篇</span>
              </summary>
              <div className="month-posts">
                {group.posts.map((post) => (
                  <PostRow key={post.slug} post={post} onTagClick={onTagClick} />
                ))}
              </div>
            </details>
          </section>
        );
      })}
    </div>
  );
}
