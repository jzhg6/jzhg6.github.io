import { Search, SlidersHorizontal } from "lucide-react";
import type { Ref } from "react";
import {
  postCategories,
  postCategoryKeys,
  postTypes,
  postTypeKeys,
} from "@/config/taxonomy";
import type { FilterState } from "@/lib/content/filter";
import type { PostCategory, PostType } from "@/config/taxonomy";
import { YearNav } from "./year-nav";

interface PostFilterBarProps {
  state: FilterState;
  query: string;
  tags: string[];
  years: number[];
  inputRef: Ref<HTMLInputElement>;
  onQueryChange: (query: string) => void;
  onTypeChange: (type: PostType | null) => void;
  onCategoryChange: (category: PostCategory | null) => void;
  onTagToggle: (tag: string) => void;
  onYearChange: (year: number | null) => void;
  onQueryKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function PostFilterBar({
  state,
  query,
  tags,
  years,
  inputRef,
  onQueryChange,
  onTypeChange,
  onCategoryChange,
  onTagToggle,
  onYearChange,
  onQueryKeyDown,
}: PostFilterBarProps) {
  const advancedCount = Number(Boolean(state.category)) + state.tags.length + Number(Boolean(state.year));

  return (
    <div className="filter-panel">
      <div className="search-field">
        <Search aria-hidden="true" />
        <label className="sr-only" htmlFor="post-search">
          搜索文章标题、摘要、正文和标签
        </label>
        <input
          ref={inputRef}
          id="post-search"
          type="search"
          value={query}
          placeholder="搜索标题、摘要与标签…"
          autoComplete="off"
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onQueryKeyDown}
        />
        <kbd aria-label="快捷键斜杠">/</kbd>
      </div>

      <div className="type-tabs" aria-label="按内容类型筛选">
        <button
          type="button"
          aria-pressed={state.type === null}
          onClick={() => onTypeChange(null)}
        >
          全部
        </button>
        {postTypeKeys.map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={state.type === type}
            onClick={() => onTypeChange(type)}
          >
            {postTypes[type].label}
          </button>
        ))}
      </div>

      <details className="advanced-filter">
        <summary>
          <span>
            <SlidersHorizontal aria-hidden="true" />
            高级筛选
          </span>
          <span>{advancedCount > 0 ? `${advancedCount} 项已选` : "分类 · 标签 · 年份"}</span>
        </summary>

        <div className="advanced-filter-body">
          <fieldset>
            <legend>分类</legend>
            <div className="choice-grid">
              <button
                type="button"
                aria-pressed={state.category === null}
                onClick={() => onCategoryChange(null)}
              >
                全部分类
              </button>
              {postCategoryKeys.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={state.category === category}
                  onClick={() => onCategoryChange(category)}
                >
                  {postCategories[category]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>标签（同时满足）</legend>
            <div className="choice-grid tag-choices">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={state.tags.includes(tag)}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>年份</legend>
            <YearNav years={years} activeYear={state.year} onChange={onYearChange} />
          </fieldset>
        </div>
      </details>
    </div>
  );
}
