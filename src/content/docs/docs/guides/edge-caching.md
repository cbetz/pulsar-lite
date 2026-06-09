---
title: Edge caching
description: Serve cached responses from memory with stale-while-revalidate semantics, tags, and global purges.
sidebar:
  order: 2
---

Vega's cache lives in the same process as your handlers, in every region. A cache hit is a memory read — no network hop, no serialization round trip. The default strategy is stale-while-revalidate (SWR), which keeps responses fast even while the underlying data changes.

## How SWR works

`cache.swr(key, fetcher)` resolves in one of three ways:

1. **Fresh hit** — the value is within its TTL. Returned immediately.
2. **Stale hit** — the TTL has passed but the value is inside its stale window. The stale value is returned immediately, and the fetcher runs in the background to refresh it.
3. **Miss** — no value exists. The fetcher runs inline and the result is stored.

Requests almost never wait on your data source twice: after the first request, users see cached data while revalidation happens off the critical path.

## Basic usage

```ts title="api/index.ts"
api.get('/products/:id', async ({ params, cache }) => {
  const product = await cache.swr(`product:${params.id}`, () =>
    db.products.find(params.id),
  );
  return Response.json(product);
});
```

With no options, values are fresh for 60 seconds and servable-while-stale for 10 minutes.

## Tuning freshness

Pass `ttl` and `stale` (both in seconds) as the third argument:

```ts
const rates = await cache.swr('fx:rates', fetchRates, {
  ttl: 300,    // fresh for 5 minutes
  stale: 3600, // then servable-while-revalidating for 1 hour
});
```

Short TTLs with long stale windows are the usual sweet spot: data stays current without ever exposing users to cold-fetch latency.

## Tag-based invalidation

Tag entries when you write them, then purge by tag when the source data changes:

```ts
const user = await cache.swr(`user:${id}`, () => db.users.find(id), {
  tags: ['users', `user:${id}`],
});
```

```ts
api.post('/users/:id', async ({ params, cache }) => {
  await db.users.update(params.id, /* ... */);
  await cache.purge({ tags: [`user:${params.id}`] });
  return Response.json({ ok: true });
});
```

Purges can also be issued from the CLI, which is handy after out-of-band data changes:

```bash
vega cache purge --tag users
```

## Inspecting cache behavior

Every response carries a `vega-cache` header:

| Value    | Meaning                                                  |
| -------- | -------------------------------------------------------- |
| `hit`    | Served a fresh value from cache                          |
| `stale`  | Served a stale value; revalidation running in background |
| `miss`   | No cached value; fetcher ran inline                      |
| `bypass` | Request did not touch the cache                          |

`vega logs --follow` includes the same value per request, and the [traces view](/docs/guides/observability/) shows each cache operation as a span with its outcome and duration.

## Regional behavior

Cache storage is per-region: a value cached in `fra` is not visible in `sin`. Purges are global — a purge issued anywhere propagates to all 28 regions in under 300ms. This is the right default for response caching; for shared mutable state, use a database.

Full method signatures, including `cache.get`, `cache.set`, and `cache.delete`, are in the [cache reference](/docs/api/cache/).
