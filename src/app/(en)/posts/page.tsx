import { BlogContent } from "@/components/pages/blog";
import { t } from "@/config/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "/posts", "Blog", t("en").blog.intro);

export default function BlogPage() { return <BlogContent locale="en" />; }
