---
title: "Your product could be a markdown file"
excerpt: "A lot of operator software was never the UI. It was judgment, a loop, and a channel. The playbook is the part that still needs you."
category: "AI in practice"
author: vivek-raj
coverImage: "/articles/markdown-product-01-hero.webp"
date: 2026-07-10
readingTime: "9 min read"
---

Every morning, some engineer somewhere wants the same thing: open PRs waiting on them, stale reviews, what merged overnight, what is actually worth touching first. That used to be a pitch deck. Engineering attention as a dashboard. Auth screen, empty states, charts nobody opened after week two.

I did not build that product. Nobody needs to build a full product for that job anymore. I keep seeing people rebuild it as a skill, a schedule, and a channel. A skill file encodes the policy. An agent with `gh` or a GitHub MCP server does the work. Cron or a harness schedule wakes it up. Telegram, email, or a markdown dump in `./pr-reviews/` is the delivery. The "product" was always the prioritization policy. The UI was how we delivered it when the policy could not run itself.

I run a smaller version of the same idea for content. Quill is mostly markdown files an agent reads before it drafts. More on that later. First, the claim.

For a lot of operator software, the valuable part was never the screen. The agent runtime executes. The harness, cron, and messaging tools usually own the schedule and delivery. What is left for you to design is the playbook. Playbooks fit cleanly in markdown.

## What those products actually sold

A lot of the tools I have in mind never sold "software" in the interesting sense. Under the login they sold:

1. Domain knowledge. What to check. What "good" looks like. What to ignore.
2. A loop. When to run. On which inputs.
3. A delivery channel. Slack. Email. A page you refresh with coffee.

Judgment is the part you can put in a file and review in a PR. Tools ([MCP](https://modelcontextprotocol.io/), `gh`, SQL, browser) give the agent hands. Schedulers and channels (GitHub Actions, Hermes cron, Telegram) make the loop real.

So the claim is narrow. Not "SaaS is dead." For a lot of operator software, the moat moved from UI to playbook, and the playbook is a file.

![Three cards for Judgment, Loop, and Channel, each mapped to where it lives now](/articles/markdown-product-02-judgment-loop-channel.webp)

## The stack behind the PR brief

Once you stop thinking "dashboard," the replacement stack is boring on purpose:

- **Playbook.** Prefer blast radius over volume. Flag missing tests. Ignore draft PRs. Write a short brief.
- **Agent runtime.** [Claude Code](https://code.claude.com/docs/en), [OpenCode](https://opencode.ai/), [Hermes](https://hermes-agent.nousresearch.com/), or Codex. Pick a harness.
- **Tools.** GitHub CLI or a GitHub MCP server. File write. Optional messaging.
- **Schedule and channel.** Hermes has a [daily briefing recipe](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/daily-briefing-bot.md) (8am research, deliver to Telegram or Discord, same pattern for GitHub repo summaries). Guides for [scheduled Claude Code agents](https://www.mindstudio.ai/blog/how-to-build-scheduled-ai-agents-claude-code) show PR review jobs that write results to `.md` files on disk. GitHub Actions still works if you want the job off your laptop.

You do not need a product page for any of that. You need policy, execution, and delivery precise enough that a competent agent can follow the job twice without you re-explaining.

![Four-layer stack with Playbook highlighted and the old custom app UI crossed out](/articles/markdown-product-03-stack-layers.webp)

## Why this is showing up now

I am not inventing a private theory. The public surface of this shift is already plain text.

[AGENTS.md](https://agents.md/) is a README for coding agents: setup commands, conventions, tests. No required schema. The project points to [60k+ examples on GitHub](https://github.com/search?q=path%3AAGENTS.md+NOT+is%3Afork+NOT+is%3Aarchived&type=code). OpenAI helped pioneer it for Codex. It is now stewarded by the [Agentic AI Foundation (AAIF)](https://aaif.io/) under the Linux Foundation. Claude Code still leans on [`CLAUDE.md`](https://code.claude.com/docs/en/memory), so people symlink. Cursor and Copilot have their own rule files. Messy at the edges, boring at the center. The format is still markdown the agent loads before it touches code.

Skills shrink the product surface further. A skill is usually a folder with a [`SKILL.md`](https://agentskills.io/home) ([OpenCode's skill docs](https://opencode.ai/docs/skills/) are a clear example): name, when to use it, process, output format, guardrails. You do not ship a microservice for "how we review a PR." You ship a file the agent loads when the task matches.

For the extreme form, look at [CompanyOS](https://adventuresinclaude.ai/posts/2026-02-21-running-a-company-on-markdown-files/): a git repo that barely looks like software. No app UI. No second orchestration layer on top of Claude Code. About two thousand lines of markdown skills for email, support, multi-system search, weekly scorecards. MCP into the systems of record. Hard approval gates before anything irreversible leaves. The bet is blunt. The agent already exists. What was missing was domain knowledge.

None of those are the thesis. They are evidence the unit of shipping moved toward playbooks.

## Why markdown, not another config UI

Markdown is readable by the person who owns the policy and by the model that has to follow it. You can keep the same file in git, diff it in a PR, grep it when something drifts, and fix a bad rule at 11pm without opening a settings page that only exists because someone had a design system. Config UIs look friendlier until the policy gets real. Then judgment becomes toggles that never quite match the case you care about. A paragraph in a skill file does.

There is also a token argument. Cloudflare's [Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/) notes that raw HTML is expensive padding for models. On that post they measured about 16,180 tokens as HTML and 3,150 as markdown, an 80% cut. Agents already send `Accept: text/markdown`. The web is starting to treat agents as first-class consumers. Markdown wins that negotiation because it has enough structure and almost no ceremony.

## Quill is the part that is actually mine

Everything above is pattern recognition. This is the system I maintain.

![Quill file tree feeding an agent that outputs LinkedIn, X, and Medium drafts](/articles/markdown-product-04-quill-tree.webp)

Quill is my content workspace for LinkedIn, X, and Medium. Notion is the control plane (pipeline, sources, scheduling). Quill is the drafting engine. What makes it work is not a custom content CMS. It is a pile of markdown:

- `voice.md` for how I actually sound
- `pillars.md` so every post fits one job
- `never-say.md` for phrases I refuse to publish
- `stack.md` so drafts name real tools instead of "our vector DB"
- command files that are prompts with a procedure
- platform drafts as markdown with frontmatter

When I open an agent in that directory, the product loads as context: voice rules, pillar balance, banned phrases, and how to save a draft. The agent does not invent my standards from vibes. It reads the files.

If I were building Quill as a SaaS in 2022, I would have designed settings screens for tone, pillars, banned words, and templates. In 2026 the honest version is a repo the agent already knows how to operate, with Notion holding state I do not want to reinvent. The product surface is smaller because the agent is part of the runtime.

That is the observation landing in my own work. A lot of "products" were workflow packages waiting for a runtime that could follow instructions. We have the runtime. Quill is the package I keep.

## What still needs a real product

I do not want this piece to turn into "delete your SaaS." That take is cheap and wrong.

Markdown plus an agent is a bad fit when:

**Multiple people need a shared system of record.** Permissions, roles, billing, audit logs, concurrent edits. A skill file is a great playbook. It is a poor multi-tenant database.

**Exploration is the job.** Design tools, maps, complex analytics you click through. Chat is a bad substitute for spatial UIs people actually want to use.

**A third party has to trust the trail.** Lawyers, auditors, compliance. "The agent followed a markdown file on my laptop" is not an evidence package. You may still encode policy in markdown, but you need immutable history somewhere else.

**The buyer is paying for maintenance and distribution, not for the idea.** Most people will not wire Hermes cron and a skill pack on a Sunday. They will pay for the polished wrapper, support, and the fact that it still works when a model provider changes its API. The `.md` file can still be the core. The business is reliability around it.

Power-user workflows also do not automatically become mass-market products. Sheets plus an agent can replace a CRM for one founder and still be a nightmare for a fifty-person sales org. The boundary is not "AI can do it." It is who operates the thing, and what breaks when the answer is wrong.

## Write the skill before the product

If you are staring at a product idea, reverse the usual order.

1. Write the skill first. A markdown file that tells a competent agent how to do the job with tools you already have. Inputs, steps, output format, irreversible actions that need a human gate.
2. Run it on a schedule for a week. See where it breaks. Most breaks are missing context, weak tools, or fuzzy policy. Fix the file.
3. Only then ask whether anyone else needs a UI, a team model, billing, or an audit surface.

If the answer is no, you may already be done. If the answer is yes, you now know which parts of the product are real, because the playbook forced you to name them.

A lot of AI demos go the other way. Chat chrome first, policy later. Policy was always the hard part.

## The shape under the hype

```
playbook (.md / skill / AGENTS.md)
        +
agent runtime (Claude Code, OpenCode, Hermes, Codex, ...)
        +
tools (gh, MCP, browser, SQL, ...)
        +
schedule and channel (cron, Actions, Telegram, disk)
```

Interesting software is concentrating in two layers: better harnesses and tools on one side, better playbooks on the other. The middle layer (the custom app that only exists to show the agent a form) is where a surprising amount of 2024 product ideas used to live.

I do not think every product collapses into a file. I do think a lot of internal tools, personal operators, and single-player workflows were overbuilt relative to the job. Agents made that overbuild hard to ignore.

Somewhere this week, someone will skip the dashboard and write a morning brief skill instead. I know which version I would rather maintain.

If you are building something that is mostly judgment, a loop, and a channel: write the markdown first, run it until the policy is honest, then decide whether a product is still needed. Often the playbook was the product. The screen was optional.
