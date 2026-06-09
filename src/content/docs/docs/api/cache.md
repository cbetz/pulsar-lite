---
title: Cache
description: The ctx.cache interface — swr, get, set, delete, purge, response headers, and limits.
sidebar:
  order: 3
---

`ctx.cache` is the regional edge cache available in every handler. The high-level method is `swr()`; `get`/`set`/`delete` exist for cases where you need explicit control. Concepts and patterns are covered in the [edge caching guide](/docs/guides/edge-caching/).

## cache.swr()

```ts
cache.swr<T>(key: string, fetcher: () => Promise<T>, options?: SwrOptions): Promise<T>
```

Returns the cached value when fresh, returns stale-and-revalidates within the stale window, and runs the fetcher inline on a miss. Concurrent requests for the same key share a single fetcher call.

| Option  | Type       | Default | Description                                            |
| ------- | ---------- | ------- | ------------------------------------------------------ |
| `ttl`   | `number`   | `60`    | Seconds the value is considered fresh                  |
| `stale` | `number`   | `600`   | Seconds after `ttl` during which stale values serve while revalidating |
| `tags`  | `string[]` | `[]`    | Labels for [tag-based purges](#cachepurge)             |

Defaults can be changed per app via [`vega.app({ cache })`](/docs/api/app/#options).

```ts
const product = await cache.swr(`product:${id}`, () => db.products.find(id), {
  ttl: 120,
  tags: ['products'],
});
```

Values must be structured-cloneable (JSON-compatible data, plus `Date`, `Map`, `Set`, and typed arrays).

## cache.get()

```ts
cache.get<T>(key: string): Promise<T | undefined>
```

Reads a value without triggering any fetch. Stale values are returned (with revalidation left to you); expired values return `undefined`.

## cache.set()

```ts
cache.set<T>(key: string, value: T, options?: { ttl?: number; tags?: string[] }): Promise<void>
```

Writes a value directly. Useful for warming the cache from a webhook or background job:

```ts
api.post('/webhooks/cms', async ({ request, cache }) => {
  const page = await request.json();
  await cache.set(`page:${page.slug}`, page, { ttl: 3600, tags: ['pages'] });
  return Response.json({ ok: true });
});
```

## cache.delete()

```ts
cache.delete(key: string): Promise<void>
```

Removes a single key in the current region. For removal across all regions, use `purge`.

## cache.purge()

```ts
cache.purge(options: { keys?: string[]; tags?: string[] }): Promise<void>
```

Invalidates entries in **all 28 regions**, propagating in under 300ms:

```ts
await cache.purge({ tags: ['products'] });
await cache.purge({ keys: [`product:${id}`] });
```

The same operation is available from the CLI: `vega cache purge --tag products`.

## Response header

Responses produced by handlers that touched the cache carry `vega-cache`:

| Value    | Meaning                                       |
| -------- | --------------------------------------------- |
| `hit`    | Fresh value served from cache                 |
| `stale`  | Stale value served; revalidating in background |
| `miss`   | Fetcher ran inline                            |
| `bypass` | No cache call on this request                 |

## Limits

| Limit            | Value                          |
| ---------------- | ------------------------------ |
| Key length       | 512 bytes                      |
| Value size       | 25 MB                          |
| Maximum `ttl`    | 86,400 seconds (24 hours)      |
| Maximum `stale`  | 86,400 seconds (24 hours)      |
| Tags per entry   | 64                             |
