---
title: vega.app()
description: Create a Vega app — options, route methods, middleware, mounting, and testing.
sidebar:
  order: 1
---

Creates an app. One project deploys one app; export it from the file named in `vega.json`.

```ts title="api/index.ts"
import { vega } from '@vega/sdk';

export const api = vega.app({ region: 'global' });
```

## Options

| Option    | Type                     | Default    | Description                                                        |
| --------- | ------------------------ | ---------- | ------------------------------------------------------------------ |
| `region`  | `'global' \| string[]`   | `'global'` | Deploy everywhere, or pin to specific [region codes](/docs/guides/deployments/#region-pinning) |
| `cache`   | `{ ttl?: number; stale?: number }` | `{ ttl: 60, stale: 600 }` | Default freshness for [`cache.swr()`](/docs/api/cache/#cacheswr) calls |
| `onError` | `(error, ctx) => Response` | JSON 500 | Called for uncaught handler errors; the error is already recorded on the trace |

```ts
export const api = vega.app({
  region: ['fra', 'lhr', 'ams'],
  cache: { ttl: 300, stale: 3600 },
  onError: (error, ctx) =>
    Response.json({ error: 'internal_error', trace: ctx.trace.id }, { status: 500 }),
});
```

## Route methods

`app.get`, `app.post`, `app.put`, `app.patch`, `app.delete`, and `app.all` register a handler for a [path pattern](/docs/api/routing/#path-patterns):

```ts
api.get('/users/:id', async ({ params }) => {
  const user = await db.users.find(params.id);
  if (!user) return Response.json({ error: 'not_found' }, { status: 404 });
  return Response.json(user);
});
```

Handlers receive a single [`Context`](/docs/api/routing/#the-request-context) and return a `Response` (or a promise of one). `app.all` matches every method and is checked after method-specific routes.

## app.use()

Registers middleware, run in registration order before the matched handler:

```ts
api.use(async (ctx, next) => {
  const start = performance.now();
  const res = await next();
  res.headers.set('server-timing', `app;dur=${(performance.now() - start).toFixed(1)}`);
  return res;
});
```

Return early without calling `next()` to short-circuit — the usual shape for auth:

```ts
api.use(async (ctx, next) => {
  if (!ctx.request.headers.get('authorization')) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  return next();
});
```

## app.mount()

Mounts a [router](/docs/api/routing/#routers-and-mounting) under a prefix:

```ts
import { users } from './routes/users';

api.mount('/v1/users', users);
```

## app.fetch()

The app is a standard `fetch` handler, which makes tests dependency-free:

```ts title="api/index.test.ts"
import { api } from './index';

const res = await api.fetch(new Request('http://test/health'));
expect(res.status).toBe(200);
```

No server, no port — handlers, middleware, and routing all run exactly as deployed.
