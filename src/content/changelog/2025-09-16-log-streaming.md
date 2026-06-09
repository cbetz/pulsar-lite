---
title: Live log streaming and environment groups
version: 1.4.0
pubDate: 2025-09-16
tags: [feature, fix]
---

`vega logs --follow` now streams structured logs from every region in real time. Median delivery is 280ms from emit to terminal, and each line carries the request ID, route, region, and status, so output pipes cleanly into `jq`. Filters compose: `vega logs --follow --route /checkout --status 5xx` tails only the failures you care about.

Environment groups let you define a set of variables once and attach it to any number of environments. Rotating a shared secret updates every attached environment atomically — no redeploy required. Values are encrypted at rest and never written to build logs.

Also in this release: deploys retry automatically on transient upload failures instead of exiting with code 1, `vega env pull` preserves comments in existing `.env` files, and the dashboard no longer drops log lines longer than 16 KB.
