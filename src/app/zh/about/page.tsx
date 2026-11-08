import { AboutContent } from "@/components/pages/about";
import { t } from "@/config/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("zh", "/about", "关于", t("zh").about.intro);

export default function AboutPage() { return <AboutContent locale="zh" />; }
