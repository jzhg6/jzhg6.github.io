import { ArrowRight, ArrowUpRight, Boxes, Network } from "lucide-react";
import Link from "next/link";
import { SocialLinks } from "@/components/layout/social-links";
import { JsonLd } from "@/components/seo/json-ld";
import { localizedPath, t, type Locale } from "@/config/i18n";
import { localeUrl, siteConfig } from "@/config/site";
import { getLatestPosts } from "@/lib/content/posts";
import { formatDate } from "@/lib/dates";

export async function HomeContent({ locale }: { locale: Locale }) {
  const labels = t(locale);
  const recent = await getLatestPosts(2, locale);
  return (
    <main id="main-content" className="home-page site-container">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Person",
        name: siteConfig.author.name, alternateName: siteConfig.author.nameZh,
        url: localeUrl(locale), email: siteConfig.author.email,
        knowsAbout: ["Embodied intelligence", "RDMA", "Intelligent systems"],
      }} />

      <section className="intro-section" aria-labelledby="intro-title">
        <h1 id="intro-title">{labels.home.greeting}</h1>
        <p className="intro-field">{labels.home.field}</p>
        <p className="intro-copy">{labels.home.bio}</p>
        <SocialLinks locale={locale} />
      </section>

      <section className="home-section" aria-labelledby="selected-projects">
        <div className="section-heading">
          <h2 id="selected-projects">{labels.home.projects}</h2>
          <Link href={localizedPath(locale, "/projects")} className="section-more">
            {labels.home.viewProjects} <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="project-grid">
          <article className="project-card project-placeholder">
            <div className="project-visual" aria-hidden="true"><Boxes /></div>
            <div className="project-details">
              <h3>XR × Embodied AI</h3>
              <span>{labels.projects.xrStatus}</span>
              <p>{labels.projects.xrDescription}</p>
            </div>
          </article>
          <article className="project-card" id="openrdma-preview">
            <Link href={localizedPath(locale, "/projects#openrdma")}>
              <div className="project-visual" aria-hidden="true"><Network /></div>
              <div className="project-details">
                <h3>OpenRDMA <ArrowUpRight aria-hidden="true" /></h3>
                <span>RDMA · FPGA · Networking</span>
                <p>{labels.projects.rdmaDescription}</p>
              </div>
            </Link>
          </article>
        </div>
      </section>

      <section className="home-section writing-section" aria-labelledby="latest-writing">
        <div className="section-heading">
          <h2 id="latest-writing">{labels.home.writing}</h2>
          <Link href={localizedPath(locale, "/posts")} className="section-more">
            {labels.home.viewWriting} <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="writing-list">
          {recent.map((post) => (
            <Link key={post.slug} href={localizedPath(locale, `/posts/${post.slug}`)} className="writing-row">
              <span>{post.title}</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
