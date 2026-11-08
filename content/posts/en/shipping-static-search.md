---
title: "Building Shareable On-Site Search from Static Data"
slug: "shipping-static-search"
publishedAt: "2026-10-12"
summary: "A small search experience with Chinese keywords, combined filters, and browser history, without a backend search service."
type: "essay"
category: "engineering"
tags:
  - Search
  - TypeScript
  - URL
featured: true
draft: false
---

## Search does not always need a server

For a site with tens or hundreds of posts, a dedicated search service can introduce more questions than it answers: how is the index synchronized, when does the service sleep, and how should its privacy implications be explained? A static blog already has access to all public content at build time, so it can generate a small search record directly.

The record includes only titles, summaries, categories, tags, and normalized plain text. It does not send the original Markdown or rendered HTML to the browser.

## Normalize before matching

The user's input and each post need to be placed in the same comparison space:

```ts
export function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("zh-CN")
    .replace(/\s+/g, " ")
    .trim();
}
```

NFKC unifies some full-width and compatibility characters. Multiple keywords are combined with AND, so “RDMA retry” returns only posts containing both concepts. The first version does not attempt fuzzy ranking: results remain in publication order, preserving the worklog's timeline.

## The URL is where filter state belongs

The search query, post type, category, tags, and year are all encoded in query parameters. For example:

```text
/posts?q=rdma&type=note&tag=Protocol&year=2026
```

This makes a filtered view easy to copy, bookmark, and share; it also lets a refresh or browser back/forward restore the same view. Typing uses `replaceState` so that every keystroke does not add another history entry. Clicking a filter uses `pushState`, since that is a deliberate navigation decision.

Good static search is less about sophisticated algorithms than about clear state and predictable behavior.
