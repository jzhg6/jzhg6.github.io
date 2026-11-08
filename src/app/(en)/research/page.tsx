import { ResearchContent } from "@/components/pages/research";
import { t } from "@/config/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "/research", "Research", t("en").research.intro);

export default function ResearchPage() { return <ResearchContent locale="en" />; }
