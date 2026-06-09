---
title: Edge caching enters public beta
version: 1.7.0
pubDate: 2025-12-09
tags: [feature]
---

`cache.swr()` is now available on every paid plan. Wrap any async function and Vega serves the cached value from the nearest region while revalidating in the background — stale-while-revalidate semantics without a CDN configuration in sight. Cache hits return in 6ms at the median; misses run your handler as usual.

```ts
api.get('/products/:id', async ({ params, cache }) => {
  const product = await cache.swr(
    `product:${params.id}`,
    () => db.products.find(params.id),
    { ttl: 60, stale: 600 },
  );
  return Response.json(product);
});
```

Defaults are `ttl: 60` and `stale: 600` — fresh for a minute, served stale for up to 10 minutes while a single background revalidation runs per key per region. Both are configurable per call.

During the private beta, 212 teams cut origin load by a median of 91% and served 1.4 billion cached responses. The beta is on by default for Pro and Scale; hit rates per route are tracked in the new Cache tab.
