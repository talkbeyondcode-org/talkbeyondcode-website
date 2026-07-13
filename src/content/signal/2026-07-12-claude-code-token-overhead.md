---
kind: Link
tag: AI Tooling
title: Claude Code sends 33k tokens before it reads your prompt
date: 2026-07-12
source:
  label: systima.ai
  href: 'https://systima.ai/blog/claude-code-vs-opencode-token-overhead'
---
Someone finally put a proxy on the wire. The harness ships ~33k tokens of scaffolding before your prompt, and a couple of MCP servers push that past 75k. If you pay per token, log your API boundary before you blame the model.
