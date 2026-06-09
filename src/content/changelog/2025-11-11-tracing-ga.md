---
title: Request-level tracing is generally available
version: 1.6.0
pubDate: 2025-11-11
tags: [feature, improvement, fix]
---

Every request now produces a full trace — routing, middleware, handler execution, and upstream calls — with no instrumentation required. The waterfall view shows where each millisecond went, and overhead stays under 0.4ms per request. Tracing is on by default for Pro and Scale plans, with 100% sampling and 7-day retention.

Per-route latency breakdowns landed alongside. The Routes view shows p50, p95, and p99 for every endpoint in every region, with week-over-week deltas, so a regression in one region no longer hides inside a global average.

Spans slower than 100ms are flagged automatically and grouped by upstream host — usually enough to identify a slow database query or third-party API without reading a single trace by hand.

Fixed: trace timestamps render in your dashboard timezone instead of UTC, and traces for requests that hit the 30s handler limit are no longer truncated.
