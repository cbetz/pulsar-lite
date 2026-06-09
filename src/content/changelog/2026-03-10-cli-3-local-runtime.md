---
title: CLI 3.0 with a local edge runtime
version: 1.9.0
pubDate: 2026-03-10
tags: [feature, improvement]
---

`vega dev` now runs the exact runtime we run in production — same isolate version, same cache semantics, same trace format. Requests against `localhost:7700` produce the same waterfalls you would see in the dashboard, viewable locally with `vega dev --trace`. The class of bug that only appears after deploy gets a lot smaller.

Deploys are faster. Uploads are content-addressed, so only changed modules leave your machine: the median deploy went from 8.4s to 3.1s, and builds for a typical service finish in 1.2s. `vega deploy --watch` redeploys on save for staging environments.

Smaller things: shell completions for bash, zsh, and fish via `vega completions`, a `--json` flag on every command for CI pipelines, and exit codes are now documented and stable.
