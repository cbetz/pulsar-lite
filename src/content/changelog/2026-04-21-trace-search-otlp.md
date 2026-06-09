---
title: Trace search and OpenTelemetry export
version: 1.10.0
pubDate: 2026-04-21
tags: [feature, improvement, fix]
---

You can now search every trace, not just the flagged ones. The query syntax composes filters — `route:/checkout status:500 duration:>200ms region:fra` — and returns results in under a second across 30 days of data. Saved searches live in the sidebar and are shareable by URL.

Traces also export over OTLP to any OpenTelemetry-compatible backend, so Vega can feed the observability stack you already run. Export is configured per environment, batched, and adds no request overhead.

Retention is longer at no price change: Pro plans keep traces for 30 days, up from 7, and Scale keeps them for 90.

Fixed: waterfalls with more than 500 spans render without locking the tab, and cache hits are attributed to the cache span instead of the handler.
