---
title: "AI is making juniors faster. I worry it's making them hollow."
excerpt: "Juniors are shipping faster than ever and understanding less than ever about what they're shipping. The gap between those two things is where the problem lives."
category: "Career"
author: raj-kumar-abbadi
coverImage: "/articles/ai-making-juniors-faster.webp"
date: 2026-06-09
readingTime: "5 min read"
---

I'm not here to argue against AI. I use it. My team uses it. It's genuinely one of the best things to happen to the day-to-day work of writing software. But after years of watching young engineers grow, and now watching a new generation grow up with AI from day one, I've noticed something that keeps me up a little at night.

The juniors are shipping faster than ever. They also understand less than ever about what they're shipping. And the gap between those two things is where the problem lives.

Let me explain by telling you how I learned, because I think the contrast is the whole point.

## How I was actually built as an engineer

When I joined as a fresher, nobody handed me a feature on day one. I spent the first two or three weeks just learning the fundamentals of programming. It felt slow at the time. In hindsight, it's the reason my foundations are still solid today.

Then they started me on bugs. Small ones, in a sample application. Fixing bugs is underrated as a teacher: to fix something, you're forced to understand how it works, why it broke, and what touches it. I wasn't building anything yet, but I was learning how the system breathed.

Because I did well with bugs, I slowly got pulled into feature development. And this is where things really opened up. You don't understand a product's architecture all at once. It arrives in pieces, over months, as you keep touching different parts of it. Somewhere in there my own way of writing code changed, not because someone lectured me, but because I started seeing the patterns. I began using constants instead of magic values. Writing common methods. Building reusable components. Asking whether a component actually fit where it was going. I even started suggesting workflow changes to my seniors based on how I understood the system. That's roughly when "fresher" turned into "Associate Software Engineer."

Then a second phase began. I got added to client calls where clients explained their bugs and the enhancements they wanted. Suddenly I wasn't just looking at code, I was looking at how the application lived in production, what business problems it solved, how it actually made money. I started building production-grade applications for clients. And eventually I was handed a team of juniors, and I ran them through the exact same cycle I'd been through.

That cycle, fundamentals, bugs, features, architecture, business context, mentorship, is what produces an engineer who can think about the bigger picture. None of it was fast. All of it was load-bearing.

## What I see now

Recently I was again given a team of fresh developers. Everyone uses AI, and it's made the work easier, but I've watched it quietly stop making them think.

The new pattern is: paste the problem, get a solution, stitch the solution into the system, move on. It works. The ticket closes. The demo runs. And the learning curve that used to climb steadily over months is flattening out a little more every day.

For a while that feels like a win, things are progressing faster than expected. But speed isn't the only thing we should be measuring. We're trading away the slow accumulation of knowing the mental model of the system, the instinct for why one approach fits and another doesn't.

I'll give you the instance that worries me most. With "vibe coding" I've seen developers build an application that perfectly serves today's use case by writing a mountain of code that will never scale. The moment you need to grow it, or bolt on a few more features, it buckles. It solved the problem in front of them. It didn't solve the problem they couldn't see yet. And the developer who wrote it often can't tell you why it'll break, because they never really owned the design in the first place.

That's the heart of it for me. You can generate code faster than you can understand it. And when you can't understand it, you can't own it.

## The feedback loop we're skipping

There's one more loss that doesn't get talked about enough: the feedback loop.

The old way had a built-in teacher. A senior assigns you a task. You implement it. They review it. They tell you what's wrong, what could be better, and crucially, why. You argue a little. You learn. Next time, you make a better first attempt. That back-and-forth is where judgment is forged.

When the AI hands you a working answer, that conversation never happens. There's no one asking "why did you do it this way?" and worse, you never ask it of yourself. The friction that used to produce growth just… disappears. It feels efficient. It's actually expensive, just on a delay.

## So what do I actually want?

Not less AI. I want developers to use AI to solve problems and then turn around and interrogate the solution.

- Why did this solve the problem? What's the underlying idea?
- Why didn't I think of that approach first? What was I missing?
- How would I solve this same problem in a different system, where this exact solution wouldn't fit?

That last question matters most, because it forces you to think about the future of your system, not just its present.

There's a real shift underneath all of this that's worth naming. We used to be expected to know syntax. In the AI era, you can genuinely outsource a lot of that, and that's fine. But you cannot outsource concepts. Knowing how a framework actually works, and knowing how to apply those concepts where your system needs them, has become more important, not less. The syntax is the part the machine should hold. The understanding is the part you can never give away.

AI will not replace developers. But it will absolutely widen the gap between developers who use it to think faster and developers who use it to avoid thinking. It's a brilliant helping hand. It makes a smart engineer quicker. It does not, on its own, make a junior into an engineer.

## To the juniors reading this

Use the tool. Ship fast. But every time AI hands you something that works, steal a few minutes to ask why it works and whether you could have gotten there yourself. Read the code you didn't write as carefully as the code you did. Chase the concepts, not just the output.

The engineers who do that will be unstoppable in this era. The ones who don't will be very fast right up until the moment the system asks them a question their AI can't answer for them.

If any of this resonates, or if you completely disagree, I'd genuinely like to hear how AI has changed the way your team grows its juniors.
