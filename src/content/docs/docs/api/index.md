---
title: API reference
description: The @vega/sdk surface — exports, runtime support, and versioning policy.
sidebar:
  label: Overview
  order: 0
---

`@vega/sdk` is the library your code imports. It is TypeScript-first, has zero runtime dependencies, and weighs 11 kB minified.

```bash
npm install @vega/sdk
```

## Exports

| Export                                  | Description                                              |
| --------------------------------------- | -------------------------------------------------------- |
| [`vega.app()`](/docs/api/app/)          | Create an app — the unit you deploy                      |
| [`vega.router()`](/docs/api/routing/#routers-and-mounting) | A composable group of routes, mountable under a prefix |
| [`Context`](/docs/api/routing/#the-request-context) | Type of the object passed to every handler   |
| [`Cache`](/docs/api/cache/)             | Type of `ctx.cache` — SWR reads, writes, purges          |
| `Middleware`                            | Type of functions accepted by `app.use()`                |

Everything hangs off the `vega` namespace or is a type:

```ts
import { vega, type Context, type Middleware } from '@vega/sdk';
```

## Runtime support

Apps run on Vega's edge runtime in production and under Node.js 22+ with `vega dev` locally. Handlers use web-standard primitives — `Request`, `Response`, `URL`, `fetch` — so there is no Vega-specific response type to learn.

## Versioning

The SDK follows semver. The current line is 2.x; breaking changes ship only in major versions, and deprecated APIs keep working for at least one major release with a console warning in `vega dev`. The CLI (`@vega/cli`) is versioned independently and any 3.x CLI works with any 2.x SDK.

## Reference pages

- [`vega.app()`](/docs/api/app/) — app options, route methods, middleware, testing
- [Routing](/docs/api/routing/) — path patterns, the request context, routers
- [Cache](/docs/api/cache/) — `swr`, `get`, `set`, `delete`, `purge`, response headers
