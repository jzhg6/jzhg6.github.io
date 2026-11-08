import { SocialLinks } from "@/components/layout/social-links";
import { JsonLd } from "@/components/seo/json-ld";
import { t, type Locale } from "@/config/i18n";
import { localeUrl, siteConfig } from "@/config/site";

export function AboutContent({ locale }: { locale: Locale }) {
  const labels = t(locale);
  return (
    <main id="main-content" className="interior-page site-container about-page">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Person",
        name: siteConfig.author.name, alternateName: siteConfig.author.nameZh,
        email: siteConfig.author.email, url: localeUrl(locale, "/about"),
      }} />
      <header className="page-heading">
        <h1>{labels.about.heading}</h1>
        <p>{labels.about.intro}</p>
        <p>{labels.about.second}</p>
      </header>
      <section className="content-section" aria-labelledby="focus-heading">
        <div className="section-heading"><h2 id="focus-heading">{labels.about.focus}</h2></div>
        <ul className="interest-list">{labels.about.focusItems.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="content-section" aria-labelledby="contact-heading">
        <div className="section-heading"><h2 id="contact-heading">{labels.about.contact}</h2></div>
        <SocialLinks locale={locale} />
      </section>
    </main>
  );
}
