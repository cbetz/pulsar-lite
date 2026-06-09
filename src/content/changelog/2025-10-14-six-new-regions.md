---
title: Six new regions and faster cold starts
version: 1.5.0
pubDate: 2025-10-14
tags: [feature, improvement]
---

Vega is now live in São Paulo, Mumbai, Osaka, Stockholm, Sydney, and Johannesburg, bringing the network to 24 regions. New deploys pick up the regions automatically; existing apps can opt in with `vega regions add`. Free-tier apps continue to run in the 3 regions closest to their traffic.

Cold starts dropped from 96ms to 31ms at the median, and from 240ms to 88ms at p99. Isolates are now snapshotted after module initialization and restored from the snapshot on first request, so your imports no longer run on the cold path.

Anycast routing re-evaluates the nearest healthy region every 30 seconds instead of every 5 minutes, which cut p99 latency by 9ms for traffic near region boundaries.
