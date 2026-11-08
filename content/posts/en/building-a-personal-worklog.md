---
title: "Making a Personal Blog a Sustainable Worklog"
slug: "building-a-personal-worklog"
publishedAt: "2026-10-28"
updatedAt: "2026-10-30"
summary: "How this blog evolved from a visual reference into a lightweight content model, and why writing should stay simpler than the publishing system."
type: "project"
category: "building"
tags:
  - Next.js
  - Markdown
  - Design
featured: true
draft: false
---

## First, decide what it is not

This site is not a carefully packaged résumé, nor is it meant to be updated every day. It is closer to a workbench that stays open over time: essays explain questions I have thought through, notes preserve observations that are still taking shape, and project logs answer a simpler question: what have I actually been building?

A changelog-inspired timeline puts **change** first. Dates, types, and tags establish context; titles and summaries help readers decide whether to keep reading. Compared with a grid of cards, this structure is quieter and better suited to a growing archive.

## The content should be easier to maintain than the system

Each post is a Markdown file. Frontmatter describes its title, date, type, and tags, while the body remains ordinary text:

```yaml
title: "A post title"
publishedAt: "2026-10-28"
type: "project"
tags:
  - Next.js
  - Markdown
```

At build time, the site validates these fields, generates the post page, and updates the archive, RSS, and sitemap. Publishing therefore remains a matter of adding a file, rather than signing in to a dashboard, filling out forms, or maintaining a database.

## A boundary worth keeping

This first version has no comments, accounts, or online editor. Those features are possible, but they would shift attention away from the writing and toward operating the system. For a personal site, each service removed is one less failure mode to keep watching.

What I hope this worklog shows is not how much I know, but how an idea gradually becomes clearer.
