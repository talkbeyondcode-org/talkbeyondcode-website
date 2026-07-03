---
title: "The future of enterprise AI won't be won by bigger models. It'll be won by smarter inference."
excerpt: "Training gets the headlines, but inference pays the bills. Lessons from llm-d, the open source project founded by Red Hat and partners, on why routing intelligence beats raw hardware."
category: "AI in practice"
author: sagar-vemala
coverImage: "/articles/smarter-inference-not-bigger-models.svg"
date: 2026-07-03
readingTime: "5 min read"
---

Every few months the industry crowns a new largest model. More parameters, longer context windows, better benchmark scores. It's an exciting race to watch. For most enterprises, it's also the wrong race to be watching.

The accounting tells the real story. Training is a one-time cost, and someone else mostly pays it. Inference is the cost you pay forever. Every chat message, every RAG query, every agent step and every retry runs through inference, around the clock, against your GPU bill. Once an AI product finds real users, the question stops being "which model?" and becomes "how efficiently can we serve it?"

And at scale, most teams discover they're serving it badly. Not because the model is too small or the GPUs too few, but because of how requests move through their infrastructure.

## The symptom: expensive GPUs, quietly wasted

Picture a production LLM service handling thousands of concurrent requests. The symptoms show up in a predictable order:

- GPU utilization looks healthy on the dashboard, but a good chunk of that work is redundant.
- Latency creeps up, and users feel it as lag. Time to first token stretches from snappy to sluggish.
- Costs climb faster than traffic, and the finance conversation gets awkward.

The instinctive fixes are to buy more GPUs or to switch to a smaller, cheaper model. Both treat the symptom. The disease usually lives somewhere else entirely: in the load balancer.

## The root cause: LLM requests have memory, your load balancer doesn't

One concept explains most of it: the KV cache.

When an LLM processes your prompt, it builds up internal state in the form of key-value tensors for every token it has attended to. Think of it as the model's short-term memory of work already done. In a multi-turn conversation or an agentic workflow, most of each new request is a prefix the model has already processed. If the server still holds that KV cache, it can skip straight to generating new tokens. If it doesn't, it recomputes everything from scratch.

Here is where things collide. The load balancing playbook we all grew up with, whether round-robin, least connections or random spread, was designed for stateless web traffic where any replica is as good as any other. That assumption held for a decade. For LLM inference it's exactly wrong.

Route turn one of a conversation to pod A, and pod A builds the cache. Route turn two to pod C, which round-robin happily does, and pod C rebuilds the entire context from token zero. The work pod A did gets thrown away. Multiply this across thousands of concurrent sessions and you end up with wasted compute, slower responses and a bigger bill, all while the dashboards insist your GPUs are busy.

![Comparison of stateless round-robin load balancing, where a follow-up request lands on a cold pod and recomputes everything, versus llm-d's cache-aware routing, where requests land on the pod that already holds their context](/articles/smarter-inference-not-bigger-models-01-cache-aware-routing.svg)

The best analogy I've found is a call center. One version connects you to the agent who already knows your case. The other transfers you to a random stranger and makes you explain everything from the beginning. Same staff, same phones, wildly different experience and cost.

## Enter llm-d: routing that knows where the memory lives

This is the problem [llm-d](https://github.com/llm-d/llm-d) exists to solve. It's an open source, Kubernetes-native distributed inference stack founded by **Red Hat** together with Google Cloud, IBM Research, CoreWeave and NVIDIA. It was [launched at Red Hat Summit in May 2025](https://www.redhat.com/en/about/press-releases/red-hat-launches-llm-d-community-powering-distributed-gen-ai-inference-scale), later joined by AMD, Cisco, Hugging Face, Intel, Mistral AI and others, and in March 2026 the founders [donated it to the Cloud Native Computing Foundation](https://www.cncf.io/blog/2026/03/24/welcome-llm-d-to-the-cncf-evolving-kubernetes-into-sota-ai-infrastructure/), where it now lives as a CNCF sandbox project. Red Hat deserves real credit here: they took a genuinely hard systems problem and drove an open, vendor-neutral solution instead of a proprietary one.

The core idea is simple to state. Route each request to the server that already holds its context, rather than starting from scratch. Making that work at production scale is where the engineering lives:

- **KV-cache aware routing.** An intelligent inference scheduler tracks which replicas hold which prefixes and sends each request where its cache is warm. Reuse beats recompute, every time.
- **Disaggregated prefill and decode.** Processing a prompt is compute-heavy and parallel. Generating tokens is memory-bound and sequential. These are different workloads, so llm-d can split them onto separate workers and scale each according to what it's actually good at.
- **Built on what you already run.** Under the hood it's [vLLM](https://github.com/vllm-project/vllm) for serving, integrated with Kubernetes through the Inference Gateway. Platform teams operate it with the tooling and patterns they already trust instead of adopting a parallel ops universe.

The project's [published benchmarks](https://github.com/llm-d/llm-d) explain why platform teams are paying attention: **3x higher output throughput and 2x faster time to first token** with prefix-cache-aware routing versus round-robin load balancing, measured on Llama 3.1 70B running on four AMD MI300X GPUs. Same model, same hardware. Only the routing changed.

![The three pillars of llm-d, which are KV-cache aware routing, disaggregated prefill and decode, and Kubernetes-native operations, delivering 3x throughput and 2x faster time-to-first-token with zero extra GPUs](/articles/smarter-inference-not-bigger-models-02-llm-d-stack.svg)

Worth pausing on. Not a bigger model. Not more GPUs. Not exotic hardware. Routing intelligence.

## The takeaway that outlives any single project

Even if you never deploy llm-d, the lesson underneath it generalizes, and it's worth internalizing.

When workloads change shape, old infrastructure assumptions quietly become the bottleneck. Stateless load balancing wasn't wrong. It was right for a world where requests carried no memory. LLM inference broke that assumption, and the biggest wins came not from scaling harder within the old model, but from noticing the assumption and rebuilding around the new shape of the work.

If you're running LLMs in production, or about to, here are some questions worth asking this week:

1. **Where does your cost actually accrue?** If you're optimizing model choice but ignoring serving efficiency, you're tuning the cheap part.
2. **Does your routing layer know anything about KV cache locality?** If requests from the same session can land on arbitrary replicas, you're paying for the same computation repeatedly.
3. **Are prefill and decode competing for the same GPUs?** Two workloads with opposite profiles sharing one resource pool is a classic utilization leak.
4. **Can your ops team run your AI stack with tools they already know?** The best inference platform is the one your platform team can actually operate at 3 a.m.

The models will keep getting bigger, and that race will keep making headlines. But the enterprises that win with AI won't be the ones with the biggest models. They'll be the ones that serve good-enough models brilliantly. The future of enterprise AI belongs to smarter inference.

---

*llm-d is open source. Explore it at [github.com/llm-d/llm-d](https://github.com/llm-d/llm-d), or start with Red Hat's introduction to [Kubernetes-native distributed inferencing](https://developers.redhat.com/articles/2025/05/20/llm-d-kubernetes-native-distributed-inferencing). Credit to Red Hat and the llm-d community for building this in the open.*
