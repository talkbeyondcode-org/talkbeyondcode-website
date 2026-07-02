---
title: "Build your agents like Google built its shopping cart: a composable system, not one clever tool"
excerpt: "What Universal Cart, AP2 and UCP quietly teach us about composability, and why your next MCP server should be small, boring and reusable."
category: "Tooling"
author: ravi-seelam
coverImage: "/articles/build-agents-like-google-built-shopping-cart.webp"
date: 2026-06-03
readingTime: "7 min read"
---

*A note on how this piece is built: each section below is its own small unit. It takes one input, does one job, and hands back one idea. None of them reaches into the others. The last section, `main()`, wires them together. That's the whole argument, written as structure instead of stated as a claim. A monolith reads smoothly and breaks silently. A composable thing reads in parts and holds.*

## intent() — the input that started this

At I/O 2026, Google showed Universal Cart: an agent that shops across the web for you, surfacing deals, flagging that the PC parts in your basket won't actually work together, and checking out on your behalf across Search, Gemini, YouTube, even Gmail.

The shopping demo is the headline. It isn't the interesting part.

The interesting part is a design decision sitting underneath it, one that has nothing to do with shopping and everything to do with how you should be wiring agents into anything that matters. Google didn't make the agent promise to behave with your money. They made misbehaving structurally impossible. Once you see that move, you can't unsee it, and you start noticing every place you've done the opposite.

This article is about that move, and how to copy it.

## boundary() — a wall beats a warning

Here's the mechanism behind Universal Cart's checkout. Before the agent can buy anything, you set the terms: which brands, which products, how much it can spend. Google's Agent Payments Protocol (AP2) captures that as a signed contract: an Intent Mandate for "here's what I want," then a Cart Mandate for "here's the exact basket and price I approved." The agent can only pull the trigger when those signed terms are satisfied. It cannot exceed them.

So the safety isn't the agent being trustworthy. It's a wall the agent can't walk through. You don't have to trust its judgment about your money, because the spending cap was never a suggestion to the agent. It's a fact about what the agent is able to do.

Now compare that to how most of us actually try to control agents. We write the rule into the prompt and hope:

> Note: always use the staging registry.
> WARNING: do not skip the health check.
> IMPORTANT: do NOT touch production.

Every time the model slips, we add another line of shouting. The prompt slowly becomes a diary of past mistakes, and the model still finds fresh ways to wander off. Then we tell ourselves the next model will be smarter and this will fix itself.

It won't. The model was never the problem. Three things are true here, each on its own:

- A warning is a request. The model can ignore it, forget it, or read it sideways. You are trusting behavior.
- A boundary is a fact. If the tool has no path to production, production is safe no matter what the model decides. You are trusting structure.
- So the goal isn't to discourage the mistake. It's to make the mistake impossible.

A rule like "do not touch production" should not be text the model might skip. It should be a tool that cannot reach production in the first place, the same way Google's cart can't overspend, not because it's being good, but because the cap is wired in.

**Takeaway:** if your safety story depends on the agent reading carefully, you don't have a safety story. You have a wish.

## decompose() — split the monolith

There's a kind of tool every team is tempted to build: the one that does everything.

Picture a single `deploy_service` tool that builds the image, pushes it, edits the config, runs the rollout, checks health, and pings the team, all behind one call. It demos beautifully. One command, whole job done. You feel clever.

Six months later it's a swamp. Something fails and you can't tell which of the six stages broke. The rollout succeeds but the alert silently doesn't, so what state are you actually in? You want to reuse just the "ping the team" logic somewhere else and you can't, because it's welded into the block. Nobody wants to touch it, and the person who wrote it has left.

The fix is unglamorous: split each job into its own tool.

`build_image` · `push_image` · `update_config` · `apply_rollout` · `check_health` · `notify_team`

Each does one thing. Each takes clear inputs. Each returns a clear result. This is just the old Unix lesson wearing new clothes: small programs that do one thing well, joined by clean pipes, outlast the do-everything binary. MCP is the modern pipe.

The signal to split: when you catch yourself writing "and then" in a tool's description, *builds the image and then pushes it and then…*, stop. Every "and then" is a seam where failures hide.

## compose() — where the cleverness actually lives

Here's the part people get backwards. "Small tools" sounds like you're giving something up: less power, more plumbing. You're not. You're moving the cleverness, not deleting it.

In the monolith, the intelligence is trapped inside one opaque box you can't read, test, or reuse. In the composable version, the intelligence moves up into the composition: the order you run the pieces in, the conditions between them, the retries. And that layer is one you can actually see, version, and reason about.

This is why composability beats raw cleverness over any timescale that matters:

- **It fails where you can see it.** When `push_image` breaks, you know exactly what broke and what to retry. No archaeology through half-finished work.
- **It's safe to retry.** "Set this version" can run twice with no harm. "Do the whole deployment" cannot. Small, clear inputs make idempotency easy; monoliths make it a prayer.
- **It's testable.** You can run `check_health` on its own, mock it, and gate it in CI, without spinning up the entire world.
- **It gets reused.** The same `notify_team` serves deploys, outages, and nightly backups. The monolith makes you copy that logic into every workflow.
- **It's safe to change.** Edit one tool and you only touch the workflows that use it, not all of them at once, holding your breath.

The big tool buys you a faster demo. The composable system buys you the next eighteen months. Durability is measured in months, not minutes.

## interface() — the shared grammar that makes pieces composable

Small tools alone aren't enough. Pieces only compose if they speak a common language. This is the half of the Google story enterprises should be stealing hardest, and the half the shopping headlines skipped.

Alongside the cart, Google shipped UCP, the Universal Commerce Protocol, a shared standard so that any shopping surface (Search, Gemini, and others) can talk to any merchant backend without a bespoke, hand-built integration per store. Stripe, Shopify, Etsy, Target and Walmart all plug into the same grammar. AP2, in turn, rides on top of existing protocols rather than reinventing them. It can extend MCP and A2A, letting MCP expose the "checkout" tool while AP2 carries the cryptographic proof of consent. Composability all the way down: small tools, a shared interface, and protocols that stack instead of collide.

That's exactly the job MCP should do inside your company: one common way for agents to reach your tools, so you build each tool once and every team reuses it. Skip it, and you get a different glue script for every system, which is just the one big tangled tool again, only now smeared across the whole org. A monolith you can at least delete. A hundred bespoke integrations you have to live with.

**Takeaway:** composability isn't only "make tools small." It's "make tools small and give them a shared socket." Small without a standard is just a different mess.

## loop() — the agent is the orchestrator, not the oracle

Once your tools are small, predictable, and speak a common interface, the agent's job gets dramatically easier, and the feel of the work changes.

The old rhythm was a gamble: write one giant prompt, hit go, wait, hope. The new rhythm is a loop. The agent proposes the next sensible step, a real tool runs it, you see what actually happened, and the next move is grounded in that result instead of in a guess. When a step fails, you redo that one step. You don't throw away the whole run because one thing tripped.

And here's the part that surprised me: once the tools got small, the agent making things up stopped being scary. A hallucinated flag is dangerous when it's buried inside one giant action. When it's an input to a tiny tool that validates its own inputs, the tool just shrugs and rejects it. You stop needing the model to be perfect. You only need its bad guesses to land somewhere harmless, and a well-bounded tool is that harmless place. The promise moves from a warning the model might ignore to a rule it cannot route around.

This is the same insight as `boundary()`, viewed from the inside of the loop. Google bounded the money. You bound each step. Same idea, different layer.

## main() — wiring it together

Read the section names back as a single line and you have the entire method:

`intent()` → `boundary()` → `decompose()` → `compose()` → `interface()` → `loop()`

Set the intent. Enforce it with a wall, not a warning. Break the monolith into single-purpose tools. Move the cleverness into how you compose them. Give them a shared interface so they're reused, not rebuilt. Then run them in a loop where every step is grounded in what actually happened.

Google didn't build Universal Cart as one brilliant agent you have to trust. They built a system: bounded payments (AP2), a shared commerce grammar (UCP), and small capabilities the agent strings together. The intelligence lives in the wiring, and the safety lives in the walls.

So keep your tools small and a little boring. Let the agent be the clever part. And when you're deciding what to lean on, lean on how you've built things, not on a future model that's finally, surely, this time going to behave.

If you wrote "and then" anywhere in this article's structure, you'd have a monolith. It doesn't, because it's trying to practice what it argues. Your agents can too.
