---
title: "RAG in production: the parts the tutorials skip"
excerpt: "Chunking, evals and the unglamorous retrieval bugs that only show up under real traffic."
category: "AI in practice"
author: "By one of us"
date: 2026-05-12
readingTime: "14 min read"
---

Every RAG tutorial ends at "and now it answers questions." Production starts where the tutorial stops.

The unglamorous work is chunking that respects meaning, evals you actually trust, and retrieval bugs that only show up under real traffic and weird inputs. None of it demos well.

This is the stuff we wish someone had written down before we shipped: what broke, what we measured, and what we would do differently.

This is a starting draft. We'll add the concrete failure cases and the eval setup we use now.
