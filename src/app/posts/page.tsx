import type { Metadata } from "next";
import { Suspense } from "react";
import { PostExplorer } from "@/components/posts/post-explorer";
import { getPostSearchRecords, getPostTaxonomy } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "文章归档",
  description: "按时间、类型、分类和标签浏览全部文章与项目记录。",
  alternates: { canonical: "/posts" },
};

function ExplorerFallback() {
  return (
    <div className="explorer-fallback" aria-label="正在准备文章筛选器">
      <div />
      <div />
      <div />
    </div>
  );
}

export default async function PostsPage() {
  const [posts, taxonomy] = await Promise.all([getPostSearchRecords(), getPostTaxonomy()]);

  return (
    <main id="main-content" className="archive-page">
      <header className="archive-hero content-shell">
        <p className="eyebrow"><span />文章归档</p>
        <div>
          <h1>沿着时间，找到一条思考的线索。</h1>
          <p>搜索标题、摘要与正文，或使用类型、分类、标签和年份组合筛选。</p>
        </div>
        <span className="archive-count" aria-label={`共 ${posts.length} 篇文章`}>
          {posts.length.toString().padStart(2, "0")}
        </span>
      </header>

      <div className="content-shell archive-content">
        <Suspense fallback={<ExplorerFallback />}>
          <PostExplorer posts={posts} tags={taxonomy.tags} years={taxonomy.years} />
        </Suspense>
      </div>
    </main>
  );
}
