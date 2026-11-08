import type { Metadata } from "next";
import { PostContent, postPageMetadata } from "@/components/pages/post";
import { getAllPostSlugs } from "@/lib/content/posts";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getAllPostSlugs("en")).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return postPageMetadata((await params).slug, "en");
}
export default async function PostPage({ params }: Props) {
  return <PostContent slug={(await params).slug} locale="en" />;
}
