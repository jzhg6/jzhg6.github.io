import type { Locale } from "@/config/i18n";
import { postCategories, postCategoryKeys, postTypes, postTypeKeys } from "@/config/taxonomy";
import type { PostCategory, PostType } from "@/config/taxonomy";
import type { PostSearchRecord } from "@/types/post";

export interface FilterState {
  query: string;
  type: PostType | null;
  category: PostCategory | null;
  tags: string[];
  year: number | null;
}

export const emptyFilterState: FilterState = {
  query: "",
  type: null,
  category: null,
  tags: [],
  year: null,
};

export function normalizeSearchText(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("zh-CN").replace(/\s+/g, " ").trim();
}

export function parseFilterState(
  params: URLSearchParams,
  availableTags: readonly string[] = [],
  availableYears: readonly number[] = [],
): FilterState {
  const rawType = params.get("type");
  const rawCategory = params.get("category");
  const rawYear = Number(params.get("year"));
  const allowedTags = new Set(availableTags);
  const tags = Array.from(new Set(params.getAll("tag")))
    .filter((tag) => allowedTags.size === 0 || allowedTags.has(tag))
    .sort((a, b) => a.localeCompare(b, "zh-CN"));

  return {
    query: params.get("q")?.trim() ?? "",
    type: postTypeKeys.includes(rawType as PostType) ? (rawType as PostType) : null,
    category: postCategoryKeys.includes(rawCategory as PostCategory)
      ? (rawCategory as PostCategory)
      : null,
    tags,
    year:
      Number.isInteger(rawYear) &&
      rawYear > 0 &&
      (availableYears.length === 0 || availableYears.includes(rawYear))
        ? rawYear
        : null,
  };
}

export function serializeFilterState(state: FilterState) {
  const params = new URLSearchParams();
  const query = state.query.trim();

  if (query) params.set("q", query);
  if (state.type) params.set("type", state.type);
  if (state.category) params.set("category", state.category);
  for (const tag of [...state.tags].sort((a, b) => a.localeCompare(b, "zh-CN"))) {
    params.append("tag", tag);
  }
  if (state.year) params.set("year", String(state.year));

  return params;
}

export function filterPosts(posts: PostSearchRecord[], state: FilterState) {
  const tokens = normalizeSearchText(state.query).split(" ").filter(Boolean);

  function matchesToken(text: string, token: string) {
    if (/^[a-z0-9]+$/.test(token)) {
      return new RegExp(`(?:^|[^a-z0-9])${token}(?![a-z0-9])`).test(text);
    }
    return text.includes(token);
  }

  return posts.filter((post) => {
    if (state.type && post.type !== state.type) return false;
    if (state.category && post.category !== state.category) return false;
    if (state.year && post.year !== state.year) return false;
    if (state.tags.some((tag) => !post.tags.includes(tag))) return false;
    return tokens.every((token) => matchesToken(post.searchText, token));
  });
}

export function describeFilter(state: FilterState, locale: Locale = "zh") {
  const labels: string[] = [];
  if (state.query) labels.push(locale === "en" ? `Search: ${state.query}` : `搜索“${state.query}”`);
  if (state.type) labels.push(postTypes[locale][state.type].label);
  if (state.category) labels.push(postCategories[locale][state.category]);
  labels.push(...state.tags);
  if (state.year) labels.push(locale === "en" ? String(state.year) : `${state.year} 年`);
  return labels;
}
