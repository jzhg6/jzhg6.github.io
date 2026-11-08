"use client";

import { X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { postCategories, postTypes } from "@/config/taxonomy";
import type { PostCategory, PostType } from "@/config/taxonomy";
import {
  emptyFilterState,
  filterPosts,
  parseFilterState,
  serializeFilterState,
  type FilterState,
} from "@/lib/content/filter";
import type { PostSearchRecord } from "@/types/post";
import { PostFilterBar } from "./post-filter-bar";
import { PostGroups } from "./post-groups";

interface PostExplorerProps {
  posts: PostSearchRecord[];
  tags: string[];
  years: number[];
}

interface ActiveChip {
  key: string;
  label: string;
  next: FilterState;
}

function replaceHistory(pathname: string, state: FilterState, mode: "push" | "replace") {
  const query = serializeFilterState(state).toString();
  const url = query ? `${pathname}?${query}` : pathname;
  window.history[mode === "push" ? "pushState" : "replaceState"](null, "", url);
}

export function PostExplorer({ posts, tags, years }: PostExplorerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const parsedState = useMemo(
    () => parseFilterState(new URLSearchParams(searchString), tags, years),
    [searchString, tags, years],
  );
  const [queryOverride, setQueryOverride] = useState<{ source: string; value: string } | null>(null);
  const query = queryOverride?.source === searchString ? queryOverride.value : parsedState.query;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const state = useMemo(() => ({ ...parsedState, query }), [parsedState, query]);
  const filteredPosts = useMemo(() => filterPosts(posts, state), [posts, state]);

  useEffect(() => {
    const nextQuery = query.trim();
    if (nextQuery === parsedState.query) return;

    const timer = window.setTimeout(() => {
      replaceHistory(pathname, { ...parsedState, query: nextQuery }, "replace");
    }, 250);
    return () => window.clearTimeout(timer);
  }, [pathname, parsedState, query]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches("input, textarea, select, [contenteditable='true']");
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function commit(next: FilterState) {
    replaceHistory(pathname, next, "push");
  }

  function setType(type: PostType | null) {
    commit({ ...state, type });
  }

  function setCategory(category: PostCategory | null) {
    commit({ ...state, category });
  }

  function toggleTag(tag: string) {
    const nextTags = state.tags.includes(tag)
      ? state.tags.filter((item) => item !== tag)
      : [...state.tags, tag];
    commit({ ...state, tags: nextTags });
  }

  function setYear(year: number | null) {
    commit({ ...state, year });
  }

  function clearAll() {
    setQueryOverride({ source: searchString, value: "" });
    replaceHistory(pathname, emptyFilterState, "push");
  }

  function handleQueryKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Escape") return;
    if (query) {
      setQueryOverride({ source: searchString, value: "" });
      replaceHistory(pathname, { ...state, query: "" }, "push");
    } else {
      event.currentTarget.blur();
    }
  }

  const activeChips: ActiveChip[] = [];
  if (state.query) {
    activeChips.push({ key: "query", label: `搜索：${state.query}`, next: { ...state, query: "" } });
  }
  if (state.type) {
    activeChips.push({ key: "type", label: postTypes[state.type].label, next: { ...state, type: null } });
  }
  if (state.category) {
    activeChips.push({
      key: "category",
      label: postCategories[state.category],
      next: { ...state, category: null },
    });
  }
  for (const tag of state.tags) {
    activeChips.push({
      key: `tag-${tag}`,
      label: tag,
      next: { ...state, tags: state.tags.filter((item) => item !== tag) },
    });
  }
  if (state.year) {
    activeChips.push({ key: "year", label: `${state.year} 年`, next: { ...state, year: null } });
  }

  function removeChip(chip: ActiveChip) {
    if (chip.key === "query") setQueryOverride({ source: searchString, value: "" });
    commit(chip.next);
  }

  return (
    <div className="post-explorer">
      <PostFilterBar
        state={state}
        query={query}
        tags={tags}
        years={years}
        inputRef={searchInputRef}
        onQueryChange={(value) => setQueryOverride({ source: searchString, value })}
        onTypeChange={setType}
        onCategoryChange={setCategory}
        onTagToggle={toggleTag}
        onYearChange={setYear}
        onQueryKeyDown={handleQueryKeyDown}
      />

      <div className="results-toolbar">
        <p aria-live="polite" aria-atomic="true">
          找到 <strong>{filteredPosts.length}</strong> 篇文章
        </p>
        {activeChips.length > 0 ? (
          <button type="button" className="clear-button" onClick={clearAll}>
            清除全部
          </button>
        ) : null}
      </div>

      {activeChips.length > 0 ? (
        <div className="active-filters" aria-label="当前筛选条件">
          {activeChips.map((chip) => (
            <button key={chip.key} type="button" onClick={() => removeChip(chip)}>
              <span>{chip.label}</span>
              <X aria-hidden="true" />
              <span className="sr-only">移除此筛选条件</span>
            </button>
          ))}
        </div>
      ) : null}

      {filteredPosts.length > 0 ? (
        <PostGroups posts={filteredPosts} onTagClick={toggleTag} openAll={activeChips.length > 0} />
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">∅</span>
          <h2>没有找到匹配的文章</h2>
          <p>试试缩短关键词，或移除一个分类、标签或年份条件。</p>
          <button type="button" onClick={clearAll}>清除全部筛选</button>
        </div>
      )}
    </div>
  );
}
