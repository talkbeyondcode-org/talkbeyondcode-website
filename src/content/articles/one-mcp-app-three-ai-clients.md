---
title: "Putting a multi-source RAG agent inside Claude, ChatGPT, and Cursor"
excerpt: "Wrapping an existing FastAPI and pgvector backend as one MCP App with Skybridge, and where the abstraction leaked."
category: "AI in practice"
author: vivek-raj
coverImage: "/articles/one-mcp-app-three-ai-clients.png"
date: 2026-07-02
readingTime: "9 min read"
---

A plain MCP server would have gotten our RAG agent into every AI client in an afternoon. I spent days building an MCP App instead, and this post is about why that was the right call and what it cost.

The agent itself was already running in production, behind a chat bubble on our documentation site. It embedded queries with OpenAI's text-embedding-3, reranked with Jina, fused results from four surfaces (docs, a Storybook component library, a set of video tutorials, and a marketplace) with reciprocal rank fusion, and streamed cited answers over NDJSON. pgvector underneath, FastAPI in front, Claude doing the synthesis. The retrieval was good.

So reach was genuinely the easy part. The retrieval ran behind an API, and wrapping it as a plain MCP server would let any client call it. Claude, Cursor, an IDE agent, all of them could hit the tool and get an answer.

The catch is what a plain MCP tool hands back: text. The model calls your tool, reads the result, and paraphrases it. The moment that happens you lose what made the docs experience worth building. The citation cards you can click. The tutorial result that opens at the exact second in the video. The per-source provenance. Paraphrased citations also drift: the model drops a link, merges two sources, or restates a step slightly wrong, and a grounded answer ends up one hop from its grounding.

MCP Apps are a different bet. Instead of handing the model text, you hand the client an interface. The same rendered, cited, interactive panel shows up in every host, and the citations stay exact because the UI carries them, not the model's summary. That is the reason to reach for an MCP App over a plain MCP server, and it is what I wanted to test on a real retrieval backend.

## What MCP Apps actually is

In January 2026 the MCP project shipped its first official extension, MCP Apps. It was built by the MCP team together with OpenAI and the MCP-UI community, on top of earlier work from the OpenAI Apps SDK and MCP-UI. The mechanic is small: a tool declares a `ui://` resource that holds an HTML interface, the host renders it in a sandboxed iframe when the tool runs, and the UI and host can talk both ways. Claude, ChatGPT, VS Code, Goose, and Cursor have all shipped support. The finalized spec is due July 2026, but the extension has been usable since the January release.

In plain terms: a tool can return a real interface, rendered inside the chat, that runs in more than one client without client-specific code. Whether that portability actually holds was the other thing I wanted to find out, since "write once, run everywhere" has disappointed me before.

## Where Skybridge fits

The spec defines what an MCP App is. It does not make building one pleasant. [Skybridge](https://github.com/alpic-ai/skybridge) is an open-source framework from Alpic that does. It is TypeScript and React. You define a tool on the server, write a React view, and it connects them with end-to-end type inference, the way tRPC connects a backend to a frontend.

One detail set my architecture. Skybridge is TypeScript and my backend is Python. I was not going to port the retrieval pipeline to Node to satisfy a UI framework. So a thin Skybridge server sits in front, owns the React view, and calls the existing FastAPI service over HTTP. The Python side keeps doing what it already did. Skybridge gives it a face and a way into other clients.

## The idea that makes the rest click

Skybridge's docs call it context asymmetry. There are three participants in an MCP App, not two: the user, the model, and the UI, and they do not see the same things. The view runs client-side in a sandbox, so the model cannot see what the user clicked. The structured data you return is for the model, so the user never sees it raw.

Every design choice reduces to one question. Who needs to see this, and when. For a RAG answer that meant the model needs the answer text to reason over, and the user needs the rendered version with citation cards and video thumbnails. Two outputs from one tool call.

## The version I shipped first was wrong

The tool itself is boring, which is the point:

```ts
server.registerTool(
  {
    name: "ragSearch",
    description: "Search our docs and components and render a cited answer",
    inputSchema: { query: z.string() },
    view: { component: "rag-search" },   // this line is what makes it an App
  },
  handler,
);
```

The `view` field is the whole trick. Everything else is a normal MCP tool.

My backend streams over NDJSON, so my first instinct was to keep streaming on the client. The widget opened the connection itself and rendered tokens as they arrived, and the tool returned immediately with a "rendering in the panel" placeholder. It demoed beautifully. The answer typed itself out, the cards filled in.

Then I watched the model use it. Because the tool returned no real answer, the model did not believe it had one. It called `ragSearch` again with a slightly reworded query. Then a third time. I was getting the widget rendered three times in a single turn. It also started opening the cited doc URLs on its own to recover the content the tool had withheld. My nice streaming had made the model blind to its own result, which is the one failure mode an MCP App is supposed to avoid.

The fix was to move the backend call server-side. The tool now calls the search endpoint, waits for the complete answer, and returns it in the response. The model gets a real answer, calls once, and stops trying to read the links itself. I gave up live token streaming for a model that understands what it just did. In a demo that reads as a downgrade. For correctness it was not a close call.

## The two bugs that cost the most time

The blank widget. I changed the shape of my view state between versions, and Skybridge persists view state on the host and restores it. The restored object was the old shape, missing a field the new code read, so the view threw on every render and showed nothing. I was sure my deploy was broken until I opened the iframe console and saw a one-line `undefined` error. Read view state defensively. It behaves like a cache that survives your schema changes, and the docs do not warn you about that.

CORS, which I want to call out because the cause is sneaky and it cost me an afternoon. While I was still fetching from the widget, the app worked in local dev and rendered a blank answer everywhere else. I chased reachability for too long. The real cause: in local dev the widget runs on localhost, which my FastAPI CORS config allowed. Every real client renders the widget from a different iframe origin, sometimes an opaque `null` one, and the browser blocked the fetch. Not the network. The browser. The dev emulator hides this entirely.

The useful part is that these two connect. Moving the call server-side, the fix for the streaming problem, also made the CORS problem disappear, because the server has no origin. Two of my worst edges had a single resolution. If your widget fetches your backend, cross-client behavior depends on your CORS config. If the server fetches it, the question never comes up. Decide where the call lives deliberately.

## What held up

The type bridge earned its keep the day I renamed a field on the tool output. Every place in the view that read the old name lit up red before I ran anything. That is the tRPC-style inference working as advertised: the server is the source of truth and the UI cannot drift from it quietly.

Write once held too, with the asterisk above. One React component, the same widget in Claude, ChatGPT, and Cursor, no per-client branches in my code. Skybridge papers over the gap between ChatGPT's `window.openai` runtime and the open spec the other clients use, and I never touched either directly.

One smaller gotcha: a plain anchor tag does nothing inside the sandbox. External links go through `useOpenExternal`, which routes the open request to the host. My citation cards refused to click until I switched. The docs URLs from the backend were also relative, so I had to resolve them against the docs base before any of it worked.

## Would I do it again

Yes, with the deploy-first tax priced in.

If you have a backend that already works and you want it to show up as a real interface inside the clients people use, Skybridge gets you there faster than hand-rolling MCP UI per host, and the type safety pays for itself the first time you rename something. Budget a day for the three edges the local emulator hides: where the backend call lives, CORS, and stale view state. None are hard once you have seen them. All are invisible until you deploy.

The outcome is what kept me on it. The same retrieval engine, the same cited answers, now rendering inside Claude, ChatGPT, and Cursor from one codebase, wherever the person asking happens to be working.

If you are porting an existing backend into an MCP App, the first decision to get right is the one I got wrong: put the backend call on the server, not in the widget. Most of the rest follows from that.
