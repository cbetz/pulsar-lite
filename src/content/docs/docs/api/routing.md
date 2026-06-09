---
title: Routing
description: Path patterns, the request context passed to every handler, and composable routers.
sidebar:
  order: 2
---

Routes are registered on an [app](/docs/api/app/) or a router with a method, a path pattern, and a handler. Matching is exact-first: static segments beat params, params beat wildcards.

## Path patterns

| Pattern        | Matches                          | `params`                  |
| -------------- | -------------------------------- | ------------------------- |
| `/health`      | `/health` only                   | `{}`                      |
| `/users/:id`   | `/users/42`                      | `{id:'42'}`               |
| `/teams/:team/members/:id` | `/teams/core/members/7` | `{team:'core',id:'7'}` |
| `/assets/*`    | `/assets/img/logo.svg`           | `{'*':'img/logo.svg'}`    |

Params are always strings; validate and convert in the handler.

## The request context

Every handler and middleware receives one `Context`:

| Field       | Type                     | Description                                                  |
| ----------- | ------------------------ | ------------------------------------------------------------ |
| `request`   | `Request`                | The standard web request — headers, body, method, URL        |
| `params`    | `Record<string, string>` | Values captured by the path pattern                          |
| `query`     | `URLSearchParams`        | Parsed query string                                          |
| `env`       | `Record<string, string>` | Project [secrets and variables](/docs/guides/deployments/#environment-variables-and-secrets) |
| `cache`     | `Cache`                  | The regional [edge cache](/docs/api/cache/)                  |
| `trace`     | `Trace`                  | The active [trace](/docs/guides/observability/) — `span()`, `set()`, `id` |
| `waitUntil` | `(p: Promise<unknown>) => void` | Keep background work alive after the response is sent |

```ts
api.post('/webhooks/stripe', async ({ request, env, waitUntil }) => {
  const event = await verifyStripe(request, env.STRIPE_KEY);
  waitUntil(processEvent(event)); // respond now, process after
  return Response.json({ received: true });
});
```

## Responses

Handlers return a standard `Response`. `Response.json()` covers most cases; streams work unchanged:

```ts
api.get('/export', async () => {
  const stream = buildCsvStream();
  return new Response(stream, {
    headers: { 'content-type': 'text/csv' },
  });
});
```

## Routers and mounting

`vega.router()` groups routes so large APIs split cleanly across files. Routers accept the same methods and middleware as an app:

```ts title="api/routes/users.ts"
import { vega } from '@vega/sdk';

export const users = vega.router();

users.get('/', async ({ query, cache }) => {
  const page = Number(query.get('page') ?? 1);
  const list = await cache.swr(`users:page:${page}`, () => db.users.list(page));
  return Response.json(list);
});

users.get('/:id', async ({ params }) =>
  Response.json(await db.users.find(params.id)),
);
```

```ts title="api/index.ts"
import { users } from './routes/users';

api.mount('/v1/users', users);
// GET /v1/users      → users.get('/')
// GET /v1/users/42   → users.get('/:id')
```

Middleware registered with `users.use()` runs only for routes inside that router, after any app-level middleware.
