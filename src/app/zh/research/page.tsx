import { ResearchContent } from "@/components/pages/research";
import { t } from "@/config/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("zh", "/research", "研究", t("zh").research.intro);

export default function ResearchPage() { return <ResearchContent locale="zh" />; }
