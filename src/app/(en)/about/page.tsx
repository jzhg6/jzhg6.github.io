import { AboutContent } from "@/components/pages/about";
import { t } from "@/config/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "/about", "About", t("en").about.intro);

export default function AboutPage() { return <AboutContent locale="en" />; }
