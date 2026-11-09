import { RepositoriesContent } from "@/components/pages/repositories";
import { t } from "@/config/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("zh", "/repositories", "代码仓库", t("zh").repositories.intro);

export default function RepositoriesPage() {
  return <RepositoriesContent locale="zh" />;
}
