import { Search, SlidersHorizontal } from "lucide-react";
import type { Ref } from "react";
import { t, type Locale } from "@/config/i18n";
import { postCategories, postCategoryKeys, postTypes, postTypeKeys } from "@/config/taxonomy";
import type { FilterState } from "@/lib/content/filter";
import type { PostCategory, PostType } from "@/config/taxonomy";
import { YearNav } from "./year-nav";

interface PostFilterBarProps {
  state: FilterState;
  query: string;
  tags: string[];
  years: number[];
  locale: Locale;
  inputRef: Ref<HTMLInputElement>;
  onQueryChange: (query: string) => void;
  onTypeChange: (type: PostType | null) => void;
  onCategoryChange: (category: PostCategory | null) => void;
  onTagToggle: (tag: string) => void;
  onYearChange: (year: number | null) => void;
  onQueryKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function PostFilterBar({
  state, query, tags, years, locale, inputRef, onQueryChange,
  onTypeChange, onCategoryChange, onTagToggle, onYearChange, onQueryKeyDown,
}: PostFilterBarProps) {
  const labels = t(locale).blog;
  const advancedCount = Number(Boolean(state.category)) + state.tags.length + Number(Boolean(state.year));
  return (
    <div className="filter-panel">
      <div className="search-field">
        <Search aria-hidden="true" />
        <label className="sr-only" htmlFor="post-search">{labels.search}</label>
        <input ref={inputRef} id="post-search" type="search" value={query} placeholder={labels.placeholder}
          autoComplete="off" onChange={(event) => onQueryChange(event.target.value)} onKeyDown={onQueryKeyDown}
        />
        <kbd aria-label={labels.shortcut}>/</kbd>
      </div>
      <div className="type-tabs" aria-label={labels.types}>
        <button type="button" aria-pressed={state.type === null} onClick={() => onTypeChange(null)}>{labels.all}</button>
        {postTypeKeys.map((type) => (
          <button key={type} type="button" aria-pressed={state.type === type} onClick={() => onTypeChange(type)}>
            {postTypes[locale][type].label}
          </button>
        ))}
      </div>
      <details className="advanced-filter">
        <summary>
          <span><SlidersHorizontal aria-hidden="true" />{labels.filters}</span>
          <span>{advancedCount > 0 ? `${advancedCount} ${labels.selected}` : labels.filterSummary}</span>
        </summary>
        <div className="advanced-filter-body">
          <fieldset>
            <legend>{labels.category}</legend>
            <div className="choice-grid">
              <button type="button" aria-pressed={state.category === null} onClick={() => onCategoryChange(null)}>
                {labels.allCategories}
              </button>
              {postCategoryKeys.map((category) => (
                <button key={category} type="button" aria-pressed={state.category === category}
                  onClick={() => onCategoryChange(category)}>{postCategories[locale][category]}</button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{labels.tags}</legend>
            <div className="choice-grid tag-choices">
              {tags.map((tag) => (
                <button key={tag} type="button" aria-pressed={state.tags.includes(tag)}
                  onClick={() => onTagToggle(tag)}>{tag}</button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{labels.year}</legend>
            <YearNav years={years} activeYear={state.year} onChange={onYearChange} locale={locale} />
          </fieldset>
        </div>
      </details>
    </div>
  );
}
