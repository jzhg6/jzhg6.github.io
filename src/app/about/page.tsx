import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "关于",
  description: "关于作者、这本数字手记，以及当前关注的方向。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="about-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: siteConfig.author.name,
          jobTitle: siteConfig.author.role,
          email: siteConfig.author.email,
          url: absoluteUrl("/about"),
        }}
      />

      <div className="content-shell about-layout">
        <aside className="about-identity" aria-label="作者信息">
          <div className="identity-mark" aria-hidden="true">
            <span>{siteConfig.shortName}</span>
          </div>
          <p>{siteConfig.author.name}</p>
          <span>{siteConfig.author.role}</span>
        </aside>

        <article className="about-content">
          <p className="eyebrow"><span />关于</p>
          <h1>{siteConfig.about.heading}</h1>
          {siteConfig.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

          <section aria-labelledby="now-heading">
            <p className="section-index">NOW / 现在</p>
            <h2 id="now-heading">当前关注</h2>
            <ul>
              {siteConfig.about.now.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section aria-labelledby="contact-heading">
            <p className="section-index">LINKS / 联系</p>
            <h2 id="contact-heading">保持连接</h2>
            <div className="about-links">
              {siteConfig.links.map((link) => (
                <a key={link.href} href={link.href}>
                  <span>{link.label}</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
