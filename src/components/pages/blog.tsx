import { Suspense } from "react";
import { PostExplorer } from "@/components/posts/post-explorer";
import { t, type Locale } from "@/config/i18n";
import { getPostSearchRecords, getPostTaxonomy } from "@/lib/content/posts";

export async function BlogContent({ locale }: { locale: Locale }) {
  const [posts, taxonomy] = await Promise.all([getPostSearchRecords(locale), getPostTaxonomy(locale)]);
  const labels = t(locale).blog;
  return (
    <main id="main-content" className="interior-page blog-page site-container">
      <header className="page-heading">
        <h1>{labels.title}</h1>
        <p>{labels.intro}</p>
      </header>
      <div className="blog-archive">
        <Suspense fallback={<div className="explorer-fallback" aria-label={labels.title}><div /><div /></div>}>
          <PostExplorer posts={posts} tags={taxonomy.tags} years={taxonomy.years} locale={locale} />
        </Suspense>
      </div>
    </main>
  );
}
