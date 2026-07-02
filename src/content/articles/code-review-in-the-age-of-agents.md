---
title: "Code review in the age of agents"
excerpt: "Who owns the diff when the first draft was written by a model? Our review rules, rewritten."
category: "AI in practice"
author: sagar-vemala
date: 2026-06-10
readingTime: "9 min read"
---

When the first draft is written by a model, who owns the diff? The short answer is whoever hits merge. That has not changed, even though it feels like it should.

We rewrote our review rules around one idea: the reviewer is checking intent, not keystrokes. It does not matter that an agent wrote it. It matters whether a human understood it well enough to defend it.

In practice that means smaller pull requests, more "why" in the description, and a hard rule that "the AI wrote it" is never an answer in review.

This is a starting draft. We'll add the actual checklist we landed on.
