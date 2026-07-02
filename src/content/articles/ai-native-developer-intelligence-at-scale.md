---
title: "AI-native developer intelligence at scale"
excerpt: "How we built a production-grade agentic AI system that unified docs, learning, components and marketplace discovery into one developer experience, and what shipping it taught us."
category: "AI in practice"
author: sagar-vemala
coverImage: "/articles/ai-native-developer-intelligence-01-ecosystem-overview.webp"
date: 2026-06-11
readingTime: "6 min read"
---

Four tools. Four context switches. One product.

That was the reality for every developer in our ecosystem. Finding a component spec meant visiting Storybook. The tutorial video explaining it lived in the Academy. Checking whether a connector already existed required a separate trip to the Marketplace. Then back to Docs to understand the concepts.

As our product grew, developer-centric documentation, an Academy, a Storybook component library, a Marketplace, our knowledge surface expanded faster than any developer could navigate. The knowledge was all there. It just lived in four disconnected places, with no thread connecting them.

Our response was architectural: don't build a better search bar. Build an intelligence layer that understands all four systems and can reason across them.

This is the story of how we built it, and what production taught us that no amount of testing could.

## The architectural decision: every system is independently addressable

The foundation of the system is a deliberate principle, one that shaped every design decision downstream.

Rather than ingesting all content into a single shared index, we built a dedicated Model Context Protocol (MCP) server for each system. Docs, Academy, Storybook and Marketplace each expose their knowledge through their own server, structured to match the shape of data that system produces.

Why does this matter? Because docs are structured differently from video transcripts, which are structured differently from component specs, which are structured differently from marketplace artifacts. A single index flattens those distinctions. Separate MCP servers preserve them.

On top of those four servers sits a LangGraph-powered Ecosystem Agent, a stateful orchestration layer that reasons across all four knowledge sources and synthesizes answers for both human developers and external AI agents. The same MCP layer that powers the user-facing Ask-AI also serves the platform's automated development agents during code generation. One system, two consumers.

![Ecosystem Agent flow: LangGraph orchestrator, MCP retrieval fan-out, retrieval fusion, and LangFuse tracing](/articles/ai-native-developer-intelligence-02-ecosystem-agent-flow.webp)

To improve the system continuously and enhance the experience, we baked in two more pieces from day one:

- **LangFuse for full trace observability.** Every agent invocation is traced. Retrieval quality, routing decisions, failure modes, all visible and actionable. The pipeline learns from production behavior, not from assumptions made at design time.
- **Redis for caching.** Repeated queries are served from cache, keeping response times fast as usage scales.

## Four Ask-AI experiences, each purpose-built

Every surface in the ecosystem has its own Ask-AI, tuned to the knowledge it serves:

- **Docs** — full cross-system synthesis. The only surface that queries all four knowledge stores simultaneously.
- **Academy** — understands video structure. Answers point to the exact timestamp with a thumbnail preview, not just the video title.
- **Storybook** — understands component internals. Props, events, methods, design tokens and usage examples inform ready-to-use code snippet generation.
- **Marketplace** — understands the artifact landscape. Surfaces existing connectors, designs and apps to reduce duplication across teams.

The Docs Ask-AI is the flagship. Every response is structured: a summary, an Academy video with exact timestamp, a code example drawn from Storybook specs, and references to relevant Marketplace artifacts. A developer asking a single question gets an answer that previously required navigating four separate systems.

## The data pipeline is the product

AI is only as good as the data feeding it. We invested in the retrieval pipeline with the same rigor we'd apply to any core product surface.

![RAG pipeline: ingestion, vector indexing, query normalization, hybrid search, re-ranking and summarization](/articles/ai-native-developer-intelligence-03-rag-pipeline.webp)

Three principles shaped how we built it.

**1. System-specific indexing strategies.** Docs, Academy video transcripts, Storybook component definitions and Marketplace artifacts have fundamentally different data shapes. We built custom indexing per system, each optimized for the types of questions that system is expected to answer. A single generic strategy would have been a compression of information we couldn't afford to lose.

**2. A continuously evolving RAG architecture.** We didn't deploy a static retrieval system and walk away. The RAG architecture adapts as LangFuse surfaces real usage patterns. Strategies that worked at launch get revisited as the knowledge base grows and question patterns shift. The system is designed to improve continuously, not to be periodically maintained.

**3. Democratized contribution with near-realtime reflection.** Any developer writing documentation, even a brief note on how to switch themes, sees that knowledge reflected in AI responses within minutes. The pipeline is open and fast. Knowledge latency is measured in minutes, not deployment cycles. The AI improves as the team builds, with no dedicated curation team required.

## What production taught us that testing couldn't

We shipped this into production from day one rather than running it as an internal prototype. That decision created pressure that no review process can simulate, and generated feedback that fundamentally changed the system.

**1. Academy indexing was completely redesigned.** Initial video-level retrieval pointed developers to a video. That turned out not to be good enough. Real usage showed that pointing to a 20-minute video is barely better than not pointing anywhere at all. We rebuilt the entire Academy indexing layer, moving to segment-level transcript indexing with thumbnail-level timestamp precision. It was a significantly more complex engineering investment. It was fully justified by production signal.

**2. Agentic orchestration revealed edge cases invisible in testing.** LangGraph's stateful orchestration surfaced routing ambiguities and retrieval failures that no synthetic test suite predicted. LangFuse observability was the instrument that made these visible and actionable, turning production incidents into architectural improvements rather than support tickets.

**3. Multi-system synthesis required structured answer design.** Synthesizing across four knowledge sources without a consistent answer structure produced incoherent responses. The answer was a deliberately structured output format, summary, video timestamp, code example, artifact references, that imposes order on multi-source answers and meets developers exactly where they work.

## Impact: what actually changed

This system replaced a fragmented, passive documentation landscape with an active, unified intelligence layer. The before-and-after is not incremental.

**Developer workflow.** Before: 4 surfaces, 4 context switches per question. After: a single Ask-AI interaction with a structured, multi-source answer.

**Knowledge latency.** Before: deployment cycles, documentation changes required a release before they influenced AI. After: minutes, any contribution reflects in AI responses within minutes.

**Video discoverability.** Before: searchable by title only. After: segment-level indexing makes every moment in every video findable.

**Agent integration.** Before: development agents had no ecosystem knowledge. After: agents query ecosystem knowledge via MCP during code generation.

The headline numbers:

- **4 → 1** — knowledge surfaces unified into a single AI-mediated experience
- **< 5 min** — from documentation contribution to live AI response
- **Scales beyond human UX** — the same MCP infrastructure that serves developers also serves the platform's AI agents directly

## Closing thought

We built this to solve real problems in production, not as a demo. Running it in production gave us actual experience and compelled real improvements. That is the only honest way to build AI systems.

The instinct when building internal AI tooling is to keep it in prototype mode until it's "ready." What we found is that ready only comes from shipping. The Academy indexing redesign didn't come from a code review, it came from watching developers use the system and seeing where it fell short.

Build for production. Learn from production. Everything else is just guessing.
