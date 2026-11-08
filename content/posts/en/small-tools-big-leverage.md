---
title: "Small Tools Often Save a Context Switch"
slug: "small-tools-big-leverage"
publishedAt: "2026-09-03"
summary: "A short note on scripts, command-line tools, and automated checks, and the lasting value of a shorter feedback loop."
type: "note"
category: "engineering"
tags:
  - Tooling
  - Workflow
featured: false
draft: false
---

## Do not count execution time alone

A script might save only ten seconds, but the more important saving may be a context switch: no need to open a browser, recall a set of flags, or reformat the result for the next step.

I now ask three questions before keeping a small tool:

- Does it turn a sequence of easy-to-miss steps into one explicit action?
- When it fails, does it tell me what to inspect next?
- Three months from now, can I still understand its purpose from `--help`?

If the answers are yes, even a twenty-line script has become a piece of reliable infrastructure.

## The last mile of automation

The most useful tools rarely try to handle every case. They make the stable 80% smooth and stop with a clear error for the remaining 20%. Rather than letting a script guess, it is better to state the boundary explicitly.

A good tool does not feel like one more system to operate. It quietly removes friction that was already there.
