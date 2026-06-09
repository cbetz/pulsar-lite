---
title: Vega 2.0 — edge caching is GA
version: 2.0.0
pubDate: 2026-06-02
tags: [feature, improvement]
---

Edge caching is generally available on every plan, including Free. Over six months of beta, teams served 4.8 billion cached responses with a 96% median hit rate and 6ms p50 — numbers we are now confident enough to put an SLA behind. Nothing changes in your code: `cache.swr()` works exactly as it did in beta.

Tag-based invalidation is hardened for GA: limits are raised from 8 to 64 tags per entry. Attach tags when you cache — `cache.swr(key, fn, { tags: ['user:42'] })` — then purge globally with `cache.purge({ tags: ['user:42'] })` or `vega cache purge --tag user:42` from the CLI. Purges propagate to all 28 regions in under 300ms.

Four new regions — Seoul, Toronto, Madrid, and Dubai — bring the network to 28, and cached responses are served from all of them on day one. The Cache tab now reports hit rate, origin load saved, and bandwidth per route.

Vega 2.0 also moves the runtime baseline to Node 22 APIs. This is backward compatible — code deployed on 1.x keeps running — and Scale plans now carry a 99.99% uptime SLA, up from 99.95%.
