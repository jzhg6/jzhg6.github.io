import { createFeed } from "@/lib/feed";

export const dynamic = "force-static";

export function GET() { return createFeed("zh"); }
