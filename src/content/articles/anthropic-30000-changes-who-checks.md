---
title: "Anthropic merges 30,000 changes a day. Who checks that they work?"
excerpt: "Anthropic rebuilt source control for agent-scale merging and launched tools that grade AI apps automatically. Both show that writing code has become cheap and checking it hasn't."
category: "AI in practice"
author: vivek-raj
coverImage: "/articles/anthropic-30000-changes-who-checks.webp"
date: 2026-10-19
readingTime: "9 min read"
---

On October 13, Anthropic published an engineering post with a sentence that should make every engineering lead stop for a second:

> "At Anthropic, coding is no longer the bottleneck to building systems or doing research."

The numbers behind it are hard to argue with. In May 2026, Anthropic merged about 2,500 code changes a day into its monorepo. By September it was merging more than 30,000. Git could not keep up, so the company built its own version control system, called Scion, and moved the whole monorepo off Git in five months. In the same period it built a new code review tool, code search, and a permissions system for source control.

Two weeks earlier, Anthropic shipped something smaller that I think belongs in the same story. The `claude-api` skill for Claude Code gained two commands, `/claude-api build-eval` and `/claude-api hillclimb`. The first builds an evaluation for your AI application. The second changes your application, one round at a time, until its score on that evaluation goes up.

One story is about producing code faster. The other is about measuring whether code is good. Put them side by side and they point to the same conclusion. Writing code has become cheap. Knowing whether the code is right has not, and that is where the work now sits.

The two stories share a weak spot too. In both, the number you report doesn't quite measure the thing you ship. A green CI check says some revision passed its tests, and that may not be the revision you deploy. A hillclimb score was used to pick the winning version, so it overstates how good that version is. The rest of this post is about those two gaps.

## What Anthropic actually built

Scion is not a Git replacement for the rest of us, and Anthropic says so. The post states plainly that its workload is unusual and that it does not expect many organizations to hit these problems in the near term. It also credits prior work. Mononoke, the server behind Meta's Sapling version control system, pioneered many of the techniques Scion uses, including its data model. (Anthropic added that credit in an October 15 update, a day after Rain, who helped build Mononoke at Meta, [wrote](https://sunshowers.io/posts/anthropic-mononoke/) that the original post never mentioned it.)

So the interesting part of the post is not the storage engine. It is a short paragraph near the end, where the team describes how its view of the rest of the development process changed:

> "A proper merge queue, for example, doesn't make much sense at agent scale. What does CI even mean when hundreds or even thousands of changes can merge while tests are running? We haven't been able to effectively replicate the industry standard of a global repository lock on the merge queue, so instead, we've invested in post-merge and pre-deploy automated testing. This does mean that concurrent changes can conflict, but Claude can typically fix these conflicts faster than humans can even identify them."

That last sentence is the one I want to argue with.

## A conflict is the easy kind of failure

A merge conflict happens when two changes edit the same lines. The tooling detects it, so somebody, human or Claude, has to resolve it. Claude being fast at this is believable and useful.

The dangerous failures are the ones with no conflict at all.

Here is a simple example. One change raises a client timeout from 2 seconds to 10, because some requests to a slow upstream service were failing. Another change, written by a different agent on the same afternoon, adds three automatic retries to the same client. The two changes touch different files. Each one has tests, and each one passes them. Git, Scion, or any other version control system will merge both without complaint.

Together, a single slow request can now hold a connection for 40 seconds, and every slow call can turn into four requests to an upstream that was already struggling. Nothing conflicted. Nothing failed in CI. The bug exists only in the combination.

![Two changes pass CI on their own, merge with no conflict, and fail together in production](/articles/anthropic-30000-changes-who-checks-01-combined-failure.webp)
*A hypothetical example. Each check passed. The combination was never tested.*

A merge queue is the traditional defense against this, with one big condition. It tests each change on top of everything that landed before it, so the combination gets tested before it reaches the main branch. But it only catches the timeout bug if some test actually runs the client against a slow upstream. The unit tests that came with each change won't. Integration and load tests are what check combinations, and they matter more as agents write more of the code. A merge queue is where those tests get to run before anything lands. That is exactly the step Anthropic says it could not keep at 30,000 merges a day. Its answer is to test after merging and before deploying, which is reasonable engineering. But it changes what a green check mark means. A passing test now tells you that some revision passed. You have to work harder to know whether that revision is the one you are about to ship.

![Merge queue tests before merging; Anthropic merges first and tests after merge and before deploy](/articles/anthropic-30000-changes-who-checks-02-merge-queue-vs-post-merge.webp)
*Where testing sits in each approach. Based on Anthropic's description in "Redesigning source control at Anthropic."*

This is the real bottleneck I see in AI-assisted development. It is not typing speed, and after Scion it is not source control either. It is the integration question: does this set of changes, combined, still do what we meant? Version control can only tell you whether two edits collide at the text level. It has never told you whether they collide in behavior.

## More merges is a cost, not an achievement

The other line from the post that stuck with me:

> "The latent demand for merging code is practically infinite, and every bottleneck we remove immediately leads to a further increase in the amount of code we produce."

I believe this as a description of what happens. I don't accept it as a goal. Every merged change is something a person may later need to understand, debug, or roll back. A codebase that grows by 30,000 changes a day is also a codebase where "which change caused this?" gets harder to answer every day.

Anthropic seems to know this. The same post describes Claude agents it calls "superfans," each assigned to watch the health of a single component, read its telemetry, and flag anything odd. That is a sensible response, and it shows where the effort has moved. When you can produce changes without limit, you have to put more work into watching, testing, and understanding the system after they land.

## The same problem, in evaluation

This brings me to the eval tooling, which is the other half of the same problem.

If you can't review every change, you need automated checks you trust. For AI features, those checks are evaluations: a set of example inputs, a grader, and a score. Anthropic's new commands try to automate building and improving them. The announcement post by Lance Martin is thoughtful, and the guidance behind the commands is worth reading even if you never run them. It warns against tuning on the same cases you score on, asks for human review of grader decisions, and is honest about statistics. The hillclimb guide notes, for example, that 25 test cases run twice give you a margin of error of about 14 percentage points.

Hamel Husain, who teaches AI evals, tried the tool with Isaac Flath on conversations from an apartment leasing assistant and wrote up what he found. His main complaint is about order. The tool asked them to choose a failure to evaluate before they had read any of the conversations, so they went with its recommendation. He also lists what worked, and he isn't dismissing the tool. But choosing which failures matter is the one part of checking you can't hand to the agent.

I'd add one point from reading the hillclimb guide itself. By default, the tool splits your examples into a set it learns from and a test set it holds out. Each round, it scores the test set. At the end, it keeps whichever version scored best on the test set and reports that same test score as the improvement.

That is a subtle form of the overfitting the guide warns about. The tool never reads the test cases, but it picks the winner using them, so the reported number is a little optimistic. With small test sets and many rounds, it can be a lot optimistic. Lance Martin's post adds that a round's change is kept only if both the training and test scores improve, so the test set also decides which changes survive along the way. The final report does include a confidence interval, but that interval treats the winning score as a fresh measurement. It doesn't account for the score having been used to pick the winner. The guide does offer a fix: a third slice of examples used to choose the winner, with the test set saved for one final run. But it describes that option as worth it only for large sets, saying "for most evals the extra bookkeeping isn't worth it."

![Default split picks the winner and reports the score on the same test set; the three-way split keeps the test set untouched](/articles/anthropic-30000-changes-who-checks-03-eval-splits.webp)
*The hillclimb guide's default split compared with its optional three-way split.*

I think that default should flip. If the number at the end is what persuades someone to merge the change, it should come from data that played no part in choosing the change.

## What this means if you are not Anthropic

Most teams will never need Scion. But most teams using coding agents will hit a smaller version of the same problem soon, because the cost of producing a change has dropped and the cost of checking one hasn't. A few things follow from that.

- **Keep testing changes together before they reach main, for as long as you can afford to.** A merge queue is cheap at 50 merges a day. Anthropic dropped it at 30,000, which is not your situation.
- **Treat "CI passed" as a statement about a specific revision.** Know which one, with which dependencies, and whether it is the revision you will deploy.
- **Measure what got shipped and what broke, not how many changes merged.** Merged-change counts go up on their own once agents are involved.
- **Before you automate an eval, read the data yourself.** An agent can find candidate failures. Deciding which ones matter is still your job.
- **Keep a final test set the optimizer never touches.** Report that number, and report it with its margin of error.

Anthropic's post says the bottleneck now is "all of the developer infrastructure built for human scale: source control, builds, and CI." That's true. But the hardest of those tools to replace aren't the ones that store code. They're the ones that tell us whether the code is right: tests, reviews, evaluations, and the judgment of people who know what the system is supposed to do. The tools that store and move code got rebuilt in five months. The tools that check it are much further behind.

## Sources

- Anthropic, "Redesigning source control at Anthropic," October 13, 2026 (updated October 15): <https://www.anthropic.com/engineering/redesigning-source-control>
- Lance Martin, "Automating eval design and hillclimbing with Claude," claude.dev, September 28, 2026: <https://claude.dev/blog/automating-eval-design-and-hillclimbing/>
- Anthropic, hillclimb guide in the claude-api skill: <https://github.com/anthropics/skills/blob/main/skills/claude-api/shared/evals/eval-hillclimb.md>
- Hamel Husain, "Claude's new auto eval tool," September 30, 2026: <https://hamel.dev/blog/posts/claude-auto-evals/>
- Rain, "Anthropic's Scion is heavily inspired by Mononoke," October 14, 2026: <https://sunshowers.io/posts/anthropic-mononoke/>
