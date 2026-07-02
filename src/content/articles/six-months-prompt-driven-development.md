---
title: "Six months of prompt-driven development: our honest scorecard"
excerpt: "Four engineers, four stacks, one rule: reach for the agent first. What sped up, what broke, and the practices we kept after the experiment ended."
category: "AI in practice"
author: sagar-vemala
date: 2026-06-20
readingTime: "12 min read"
featured: true
---

For six months the four of us ran one rule across four very different stacks: reach for the agent first. Not as a gimmick, as a default. This is the honest scorecard.

The wins were real but narrow. Boilerplate, test scaffolding, and the first draft of almost anything got faster. The blank page stopped being a tax. Where it fell down was judgment. The agent was happy to be confidently wrong, and the cost of catching that landed squarely on review.

What we kept: agents for the boring 80 percent, with humans firmly on the 20 percent that decides whether the code is actually right. What we dropped: trusting a green diff nobody read.

This piece is a starting draft. We'll expand each section with the real numbers and examples from the experiment.
