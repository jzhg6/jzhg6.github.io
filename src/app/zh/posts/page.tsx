import { BlogContent } from "@/components/pages/blog";
import { t } from "@/config/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("zh", "/posts", "博客", t("zh").blog.intro);

export default function BlogPage() { return <BlogContent locale="zh" />; }
