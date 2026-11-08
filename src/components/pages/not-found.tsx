import Link from "next/link";
import { localizedPath, t, type Locale } from "@/config/i18n";

export function MissingContent({ locale }: { locale: Locale }) {
  const labels = t(locale).notFound;
  return (
    <main id="main-content" className="not-found-page site-container">
      <p className="not-found-code">404</p>
      <h1>{labels.title}</h1>
      <p>{labels.description}</p>
      <Link href={localizedPath(locale)}>{labels.back} →</Link>
    </main>
  );
}
