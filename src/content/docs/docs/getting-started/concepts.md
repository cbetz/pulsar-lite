---
title: Core concepts
description: Apps, the request context, regions, deployments, and the edge cache — the five ideas behind every Vega project.
sidebar:
  order: 3
---

Five ideas cover most of what Vega does. Each links to a deeper guide or reference page.

## Apps

An app is the unit you build and deploy. You create one with [`vega.app()`](/docs/api/app/), register routes on it, and export it:

```ts title="api/index.ts"
import { vega } from '@vega/sdk';

export const api = vega.app({ region: 'global' });

api.get('/health', () => Response.json({ ok: true }));
```

One project maps to one app. Larger surfaces stay organized with [routers](/docs/api/routing/#routers-and-mounting), which you mount under a path prefix.

## The request context

Every handler receives a single context object instead of separate request/response arguments. It carries the parsed route params, query string, environment, and handles to the cache and the active trace:

```ts
api.get('/users/:id', async ({ params, query, cache, trace }) => {
  trace.set('user.id', params.id);
  const user = await cache.swr(`user:${params.id}`, () => db.users.find(params.id));
  return Response.json(user);
});
```

Handlers return a standard `Response`. The full field list is in the [routing reference](/docs/api/routing/#the-request-context).

## Regions

Vega runs in 28 regions. With `region: 'global'`, every deploy goes to all of them and requests are routed to the nearest one — typically 42ms p99 from major metros. You can also pin an app to specific regions, which is useful for data-residency requirements:

```ts
export const api = vega.app({ region: ['fra', 'lhr'] });
```

The Free tier deploys to 3 regions; Pro and Scale deploy to all 28.

## Deployments

`vega deploy` builds your entry file (typically in about 1.2s) and ships the artifact to every target region as an immutable deployment with a unique ID. Deployments never mutate: a rollback is just traffic moving back to a previous artifact, so it takes effect in under 10 seconds globally. Previews, promotion, and CI are covered in the [deployments guide](/docs/guides/deployments/).

## Edge cache and traces

Two things are built into the runtime rather than bolted on:

- **Edge caching** with stale-while-revalidate semantics, exposed as `cache.swr()`. Cached responses serve from memory in the region that received the request. See [Edge caching](/docs/guides/edge-caching/).
- **Request-level tracing.** Every request produces a trace with spans for your handler, cache operations, and outbound fetches — no agent or instrumentation step. See [Observability](/docs/guides/observability/).
