import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { t, type Locale } from "@/config/i18n";
import { repositories } from "@/config/repositories";
import { siteConfig } from "@/config/site";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
};

export function RepositoriesContent({ locale }: { locale: Locale }) {
  const labels = t(locale);
  return (
    <main id="main-content" className="interior-page site-container">
      <header className="page-heading repositories-heading">
        <div className="page-heading-row">
          <div>
            <h1>{labels.repositories.heading}</h1>
            <p>{labels.repositories.intro}</p>
          </div>
          <a className="profile-link" href={siteConfig.github} target="_blank" rel="noopener noreferrer">
            {labels.repositories.profile} <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </header>
      <section className="repo-grid" aria-label={labels.repositories.heading}>
        {repositories.map((repo) => (
          <article className="repo-card" key={repo.name}>
            <div className="repo-header">
              <h2>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  {repo.name} <ArrowUpRight aria-hidden="true" />
                </a>
              </h2>
              {repo.fork ? <span className="repo-fork">{labels.repositories.fork}</span> : null}
            </div>
            <p>{repo.description[locale] ?? labels.repositories.noDescription}</p>
            <div className="repo-meta">
              {repo.language ? (
                <span className="repo-language">
                  <i style={{ backgroundColor: languageColors[repo.language] ?? "var(--quiet)" }} aria-hidden="true" />
                  {repo.language}
                </span>
              ) : null}
              <span aria-label={`${repo.stars} ${labels.repositories.stars}`}>
                <Star aria-hidden="true" />{repo.stars}
              </span>
              <span aria-label={`${repo.forks} ${labels.repositories.forks}`}>
                <GitFork aria-hidden="true" />{repo.forks}
              </span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
