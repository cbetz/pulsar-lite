---
title: Observability
description: Request-level traces, custom spans, structured logs, and OTLP export — built into the runtime.
sidebar:
  order: 3
---

Every request through Vega produces a trace. There is no agent to install and no instrumentation step: the runtime records your handler, every cache operation, and every outbound `fetch` as spans automatically.

:::note
Logs are available on every plan. Tracing is included with Pro and Scale.
:::

## What a trace contains

A typical trace for the quickstart endpoint looks like this in the dashboard:

```txt
GET /users/42                            200 · 38ms · fra
├── handler                                       36ms
│   ├── cache.swr user:42            stale         1ms
│   └── fetch api.internal/users/42   (bg)        81ms
└── response                                       2ms
```

Spans carry timing, status, region, and outcome. Background revalidation triggered by [SWR caching](/docs/guides/edge-caching/) shows up attached to the request that caused it, which makes "fast response, slow refresh" patterns easy to spot.

## Viewing traces

The dashboard shows p50/p95/p99 latency, request volume, and error rate per route, with each data point linking to the underlying traces. The trace search accepts structured filters:

```txt
route:/users/:id status:>=500 region:fra duration:>200ms
```

## Custom spans

Wrap any async work in `trace.span()` to time it as its own span:

```ts
api.get('/reports/:id', async ({ params, trace }) => {
  const report = await trace.span('report.generate', () =>
    generateReport(params.id),
  );
  return Response.json(report);
});
```

## Attributes

Attach key-value attributes to the active trace to make searches meaningful for your domain:

```ts
api.use(async (ctx, next) => {
  const user = await authenticate(ctx.request);
  ctx.trace.set('user.plan', user.plan);
  return next();
});
```

Attributes are indexed; `user.plan:scale status:>=500` is a valid search.

## Structured logs

Anything you write with `console.log` is captured per-request and attached to the trace. Stream logs from your terminal:

```bash
vega logs --follow
```

```txt frame="terminal"
12:04:11 GET  /users/42        200  38ms  fra  cache=stale
12:04:12 POST /charges         201  92ms  iad
12:04:12 GET  /health          200   1ms  syd  cache=hit
```

Pass `--json` for machine-readable output, or filter with `--route`, `--status`, and `--region`.

## Exporting traces

On the Scale plan you can forward traces to an existing OpenTelemetry collector. Set the OTLP endpoint per project:

```bash
vega otlp set https://otel.example.com:4318
```

Vega keeps its own retention either way — 90 days on Scale; export is additive, not a replacement.
