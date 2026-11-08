import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { PostRow } from "@/components/posts/post-row";
import { absoluteUrl, siteConfig } from "@/config/site";
import { postTypeKeys, postTypes } from "@/config/taxonomy";
import { getPostSearchRecords } from "@/lib/content/posts";

export default async function HomePage() {
  const posts = await getPostSearchRecords();
  const latestPosts = posts.slice(0, 5);

  return (
    <main id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: absoluteUrl(),
          description: siteConfig.description,
          inLanguage: "zh-CN",
          author: { "@type": "Person", name: siteConfig.author.name },
        }}
      />

      <section className="hero">
        <div className="hero-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="content-shell hero-content">
          <p className="eyebrow"><span />{siteConfig.home.eyebrow}</p>
          <h1>
            {siteConfig.home.headline.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero-intro">{siteConfig.home.introduction}</p>
          <div className="hero-actions">
            <Link className="primary-link" href="/posts">
              浏览全部文章 <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="text-link" href="/about">了解这本手记</Link>
          </div>
          <dl className="hero-stats">
            <div><dt>公开记录</dt><dd>{posts.length.toString().padStart(2, "0")}</dd></div>
            <div><dt>内容类型</dt><dd>{postTypeKeys.length.toString().padStart(2, "0")}</dd></div>
            <div><dt>最近更新</dt><dd>{posts[0]?.publishedAt.slice(5).replace("-", ".") ?? "—"}</dd></div>
          </dl>
        </div>
      </section>

      <section className="content-shell type-section" aria-labelledby="browse-by-type">
        <div className="section-heading">
          <div><p className="section-index">01 / 路径</p><h2 id="browse-by-type">从哪里开始</h2></div>
          <p>按内容成熟度选择一种阅读节奏。</p>
        </div>
        <div className="type-grid">
          {postTypeKeys.map((type, index) => (
            <Link key={type} href={`/posts?type=${type}`}>
              <span className="type-number">0{index + 1}</span>
              <h3>{postTypes[type].label}</h3>
              <p>{postTypes[type].description}</p>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="content-shell latest-section" aria-labelledby="latest-posts">
        <div className="section-heading">
          <div><p className="section-index">02 / 时间线</p><h2 id="latest-posts">最近更新</h2></div>
          <Link className="text-link arrow-link" href="/posts">查看完整归档 <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="latest-list">
          {latestPosts.map((post) => <PostRow key={post.slug} post={post} />)}
        </div>
        <Link className="archive-cta" href="/posts">
          <span>继续浏览全部 {posts.length} 篇记录</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
