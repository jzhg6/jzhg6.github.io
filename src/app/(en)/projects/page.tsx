import { ProjectsContent } from "@/components/pages/projects";
import { t } from "@/config/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "/projects", "Projects", t("en").projects.intro);

export default function ProjectsPage() { return <ProjectsContent locale="en" />; }
