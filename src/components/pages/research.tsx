import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { t, type Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";

const paper = {
  title: "OpenRDMA: A GPU-Native Multi-Path Reliable RDMA Transport Architecture",
  authors: "Ziheng Ji, Chunyu Liu, Weihao Peng, Mingheng Mi, Pu Wang, Hai Zhang",
};

export function ResearchContent({ locale }: { locale: Locale }) {
  const labels = t(locale);
  return (
    <main id="main-content" className="interior-page site-container">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "ScholarlyArticle",
        headline: paper.title, author: paper.authors.split(", ").map((name) => ({ "@type": "Person", name })),
        url: siteConfig.paper, datePublished: "2026-11-05",
      }} />
      <header className="page-heading">
        <h1>{labels.research.heading}</h1>
        <p>{labels.research.intro}</p>
      </header>
      <section className="content-section" aria-labelledby="research-interests">
        <div className="section-heading"><h2 id="research-interests">{labels.research.topics}</h2></div>
        <ul className="interest-list">{labels.research.interests.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="content-section" aria-labelledby="publications">
        <div className="section-heading"><h2 id="publications">{labels.research.publications}</h2></div>
        <article className="publication">
          <div className="publication-meta">{labels.research.paperLabel}</div>
          <h3>{paper.title}</h3>
          <p className="publication-authors">{paper.authors}</p>
          <p>{labels.research.paperDescription}</p>
          <a href={siteConfig.paper} target="_blank" rel="noopener noreferrer">
            {labels.research.readPaper} <ArrowUpRight aria-hidden="true" />
          </a>
        </article>
      </section>
    </main>
  );
}
