import { ProjectsContent } from "@/components/pages/projects";
import { t } from "@/config/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("zh", "/projects", "项目", t("zh").projects.intro);

export default function ProjectsPage() { return <ProjectsContent locale="zh" />; }
