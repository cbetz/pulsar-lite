---
title: 'SDK 2.0: end-to-end type safety'
version: 1.8.0
pubDate: 2026-01-27
tags: [breaking, feature]
---

`@vega/sdk` 2.0 infers types from your route definitions. Path parameters are typed from the path string itself — `'/users/:id'` gives you `params.id` as a `string` with no annotations — and response types flow through to `vega types`, which generates a typed client for your frontend. Mismatched handlers fail at compile time, not in production.

**Breaking change.** Handlers now receive a single context object instead of positional `(req, res)` arguments, and they return a `Response` instead of writing to `res`:

```ts
// SDK 1.x
api.get('/users/:id', async (req, res) => {
  const user = await db.users.find(req.params.id);
  res.json(user);
});

// SDK 2.0
api.get('/users/:id', async ({ params }) => {
  const user = await db.users.find(params.id);
  return Response.json(user);
});
```

Run `npx @vega/codemod sdk-2` to migrate automatically — it converted 96% of handlers across a test corpus of 1,800 repositories. SDK 1.x continues to receive security patches until July 31, 2026, and existing deploys keep running unchanged.
