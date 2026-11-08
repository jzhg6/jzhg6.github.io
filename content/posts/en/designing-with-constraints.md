---
title: "Constraints Are a Way to Prioritize Design"
slug: "designing-with-constraints"
publishedAt: "2026-08-15"
summary: "Starting from a personal site's layout decisions, a reflection on how explicit constraints reduce visual noise and clarify priorities."
type: "essay"
category: "building"
tags:
  - Design
  - CSS
  - Accessibility
featured: false
draft: false
---

## Width is an editorial decision

A wider screen does not mean that every line of text should grow with it. Keeping the archive's main column around 812px makes a decision about the page's job: scan titles and read summaries, rather than display as many modules as possible.

The article column should be narrower still. Once line length is stable, font size, leading, and paragraph rhythm have a reliable reference point.

## Color should have a job

This site originally used two accent colors: warm orange for selection and primary actions, and teal for supporting information and outward-facing links. Other levels were established through text tone, spacing, and borders.

If an interface needs five highly saturated colors to explain its structure, the structure itself may not yet be clear enough.

## Design for the keyboard first

Keyboard accessibility forces useful questions: where is focus now? Where does it return when a panel closes? Is a tag information or an action?

Those answers also improve touch and mouse interactions. A visible focus ring, generous targets, and readable state labels are not a compliance layer added at the end; they are part of the component definition.

Constraints do not make a page smaller. They help every remaining element earn its place.
