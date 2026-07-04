---
title: "gRPC in MCP, explained from the transport up"
excerpt: "Google wants gRPC as a native MCP transport. The spec proposal got deferred, the SDK PR got closed, and the idea is still winning. Here is how."
category: "Architecture"
author: vivek-raj
coverImage: "/articles/grpc-01-hero.webp"
date: 2026-07-04
readingTime: "9 min read"
---

I first ran into this at KubeCon India 2026 in Mumbai, in a talk by Pawan Bhardwaj from Google. The pitch fit in one sentence: MCP should be able to speak gRPC natively, not through a translation layer. I posted a short take on it afterwards, and then went digging through the repos, the spec proposal, and the SDK discussions to see how real it is. This article is what I found. The short version: the code is further along than I expected, the politics are messier than the talk let on, and the mechanism that will actually ship it is not the one anyone was arguing about.

## A transport history in four steps

MCP's transport layer has been rewritten more times than any other part of the protocol, and each rewrite tracks who was trying to adopt it.

It started with stdio. Your MCP server was a local process, the client wrote JSON-RPC to stdin and read from stdout. Perfect for a desktop app talking to a tool on the same machine, useless for anything remote.

Then came HTTP with server-sent events, which made remote servers possible. Then streamable HTTP, which cleaned up the awkward two-endpoint dance of the SSE design. Then stateless streamable HTTP, which let servers run behind ordinary load balancers without session pinning.

Notice the direction. Every step made MCP servers look more like normal backend services. And the moment they looked like normal backend services, the companies that run thousands of normal backend services showed up with a reasonable question: our services already speak gRPC, why are we translating?

![Four transports: stdio, HTTP plus SSE, streamable HTTP, stateless streamable HTTP. Each rewrite widened who could adopt.](/articles/grpc-02-transport-evolution.webp)
*The fleets arrived at step four, and brought gRPC with them.*

## The mismatch

MCP speaks JSON-RPC on the wire. That was the right call for a protocol that needed to be debuggable with curl and adoptable in a weekend. But the enterprise backends that are now wiring themselves up as agent tools mostly standardized on gRPC years ago. It is a CNCF project, their service meshes already understand it, and their auth and observability tooling grew up around it.

Connecting the two today means a transcoding gateway: a proxy that translates protobuf to JSON and back on every call. It works, and in a demo you never notice it. At thousands of calls a second you notice it in three places at once: latency, cost, and one more piece of infrastructure that can fail or drift out of sync with the schema on either side.

![Today a transcoding gateway translates every call between JSON-RPC and protobuf. The proposed native transport is one gRPC hop.](/articles/grpc-03-gateway-vs-native.webp)
*The same tool call, routed two ways.*

This is not a hypothetical enterprise. Stefan Särne at Spotify described exactly this in Google's announcement post: gRPC is their backend standard, so they built experimental MCP-over-gRPC support internally rather than gateway everything, citing developer familiarity and the statically typed APIs. When a company builds a nonstandard transport in-house rather than use the standard one, that is the protocol equivalent of a desire path. The proposal is essentially an offer to pave it.

## What gRPC actually brings

Google's argument, laid out in a blog post by Victor Moreno and Mark D. Roth, comes down to four properties.

Size and connection efficiency. Protobuf's binary encoding runs roughly 10x smaller than the equivalent JSON, over persistent HTTP/2 connections. That is Google's number, and worth flagging: the post offers no published benchmarks, latency figures, or throughput comparisons. The claim is plausible, protobuf-vs-JSON size ratios in that range are well documented elsewhere, but nobody has yet shown MCP-specific measurements.

Real streaming with backpressure. HTTP/2 gives full-duplex bidirectional streams, and gRPC layers flow control on top, so a fast tool cannot flood a slow agent. MCP's current transports simulate bidirectionality; gRPC has it natively.

Security that is already deployed. Mutual TLS for zero-trust authentication, JWT and OAuth hooks, and authorization enforceable per method, so an agent can be allowed to call ReadFile but not DeleteFile at the transport layer rather than in application code. The KubeCon talk also covered SPIFFE-based workload identity, which is how most service meshes issue those mTLS identities in practice. Protobuf's strict typing adds schema-level input validation for free.

Operational maturity. Native OpenTelemetry integration, standardized error codes like UNAVAILABLE and PERMISSION_DENIED, deadlines and timeouts as first-class concepts, and code generation for eleven-plus languages. None of this needs to be built for MCP. It exists, hardened by a decade of production use.

The one-line summary of all four: a service already on gRPC could expose itself as an agent tool using infrastructure its team already trusts, with no gateway in the path.

## The code is real

This is not a slideware proposal. Two repos exist.

The proto definitions live at [GoogleCloudPlatform/mcp-grpc-transport-proto](https://github.com/GoogleCloudPlatform/mcp-grpc-transport-proto): an `Mcp` gRPC service in `mcp.proto` and the message payloads in `mcp_messages.proto`, kept in sync with MCP schema version 2025-11-25, with a v0.1.0 release from April 2026. One design detail in there says a lot about the mindset. The protos deliberately avoid `oneof` fields, because `oneof` breaks forward compatibility when new message types land, and MCP is a protocol that adds message types constantly. The maintainers committed to non-breaking changes only. Whoever wrote these protos has been burned by schema evolution before, which is exactly who you want writing them.

The Python transport at [GoogleCloudPlatform/mcp-grpc-transport-py](https://github.com/GoogleCloudPlatform/mcp-grpc-transport-py) is younger: a handful of commits, no release yet, explicitly work in progress. The scaffolding is there, the implementation is arriving.

And because protobuf is the source of truth, stubs for Go, Java, Rust, C++, or Node are one `protoc` invocation away. That is the quiet advantage of proto-first design: the Python transport is the first implementation, not the only possible one.

## The hard part was never the code

Here is where the story gets more interesting than the talk suggested, because the MCP maintainers have now pushed back twice, and both times for defensible reasons.

![Timeline: maintainers agree in principle in December 2025, the SDK PR closes in January, protos and the V2 dispatcher land in April, SEP-2598 is deferred in May, V2 stable is targeted for July 2026.](/articles/grpc-04-timeline.webp)
*Two rejections on paper. Read on for why the door is still open.*

Round one was a pull request to the Python SDK adding transport abstraction classes, the minimal interfaces a custom transport would implement. Mark Roth's framing was that this had been agreed with core maintainers in December 2025, with Google committing to build the gRPC transport against it. The SDK maintainers closed the PR in January 2026 anyway, with the argument that the existing stream-based interface already supported multiple transports and a new abstraction was not needed. Underneath the surface disagreement sat a real one: the MCP spec itself is coupled to JSON-RPC framing, and no SDK interface can abstract that away.

Round two was SEP-2598, the Pluggable Transports proposal. It is a careful piece of work: stdio and streamable HTTP stay as the only standard transports, every tier-1 SDK must expose a public Transport interface plus a conformance test harness, and everything else, gRPC included, ships as independent packages outside the core spec. Custom transports may even use non-JSON encodings, protobuf included, as long as they faithfully round-trip MCP semantics. The design principle is stated outright in the proposal: a small standard set is load-bearing. Every transport added to the core is complexity every implementer carries forever.

The review thread is worth reading for how open-source standards actually get made. Roth himself argued the requirements were too strict, that a gRPC transport should not be forced to carry JSON-RPC artifacts like request IDs that its own framing makes redundant. Other reviewers pushed the opposite way: one warned about the burden of mandating interfaces across all tier-1 SDKs, another cautioned against using the spec to strong-arm SDK maintainers into redesigns. And one commenter mentioned, almost in passing, that he had already shipped a production gRPC transport aligned with the proposal's spirit and offered it as a reference implementation. The desire path keeps getting walked.

In May 2026, the core maintainers voted to defer the SEP. Not rejected, deferred, but the message was clear: not like this, not yet.

## The dispatcher is the actual answer

So the spec proposal is parked and the SDK PR is closed. Why do I still think this ships?

Because of a talk at the MCP Dev Summit in New York this April: Max Isbey's "Path to V2 for MCP SDKs." The V2 rework's architectural headline is a dispatcher pattern that separates MCP semantics from wire format and transport.

![The V2 dispatcher sits between MCP semantics and the transports. stdio and streamable HTTP stay in the core spec; gRPC, WebSocket, and SSH plug in as independent packages.](/articles/grpc-05-dispatcher.webp)
*SEP-2598's shape, delivered through SDK architecture instead of the spec.* That separation is precisely the thing whose absence killed the January PR. Once the SDK core no longer assumes JSON-RPC framing, a gRPC transport stops being a spec question and becomes a packaging question: an independent module that slots into the dispatcher, exactly the shape SEP-2598 sketched for it.

The timeline makes this concrete rather than aspirational. TypeScript V2 is in alpha, Python V2 entered beta in Q2, and both stable releases are targeted for July 27, 2026, alongside the new spec revision. The pieces are converging from both ends: Google maintains the protos and the transport, the SDK team ships the seam it plugs into, and the spec never has to bless gRPC at all. Deferring the SEP looks less like a rejection and more like the maintainers refusing to standardize a plug before the socket existed.

## What I would push back on

A fair article needs the other side, and there is one.

JSON-RPC is debuggable with your eyes. Every MCP developer has read raw tool-call traffic to figure out what went wrong; protobuf turns that into a tooling problem. That cost lands on everyone, not just enterprises.

There is also a genuine impedance mismatch between protobuf's compile-time schemas and MCP's runtime dynamism. Tools appear and disappear mid-session, their JSON Schemas are arbitrary and server-defined. The proto repo's no-oneof rule is a clever workaround for protocol evolution, but it is a workaround, and it trades away some of the type safety that is supposedly the point.

And the performance case remains unquantified for MCP specifically. Tool-call payloads are often small and infrequent; the 10x wire savings matters enormously for high-frequency service-to-service traffic and much less for an agent making a dozen calls a minute. The companies that need this, need it badly. Most MCP servers will never notice.

That is probably the right way to hold the whole proposal. It is less a fight over the default and more a protocol growing the ability to meet deployments where they already are. JSON-RPC for reach and readability, gRPC for fleets that outgrew both concerns years ago.

## Where this leaves us

As agents move out of demos and into production, the unglamorous layers start deciding the economics. Nobody writes keynotes about transports, but the transport is where cost, latency, and reliability actually live once call volume gets serious. MCP's history of rewriting its transport every time a new class of adopter arrived suggests the maintainers understand this, and the V2 dispatcher suggests they have chosen extensibility over an ever-growing blessed list.

Watch three things: the stable V2 SDK releases targeted for late July, the Python transport repo filling in against them, and whether SEP-2598 comes back refined once the dispatcher is real. If all three land, MCP-over-gRPC goes from conference talk to `pip install` sometime this year, and the interpreter finally leaves the room.

## Sources

- [gRPC as a native transport for MCP](https://cloud.google.com/blog/products/networking/grpc-as-a-native-transport-for-mcp), Victor Moreno and Mark D. Roth, Google Cloud
- [Proto definitions: GoogleCloudPlatform/mcp-grpc-transport-proto](https://github.com/GoogleCloudPlatform/mcp-grpc-transport-proto)
- [Python transport (WIP): GoogleCloudPlatform/mcp-grpc-transport-py](https://github.com/GoogleCloudPlatform/mcp-grpc-transport-py)
- [SEP-2598: Pluggable Transports](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2598) (deferred May 2026)
- [Python SDK PR #1591: pluggable transport abstractions](https://github.com/modelcontextprotocol/python-sdk/pull/1591) (closed January 2026)
- "Path to V2 for MCP SDKs," Max Isbey, MCP Dev Summit NY, April 2026
- Pawan Bhardwaj's talk at KubeCon India 2026, Mumbai
