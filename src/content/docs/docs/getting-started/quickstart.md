---
title: Quickstart
description: Deploy your first Vega API in under five minutes.
sidebar:
  order: 1
---

Get from zero to a globally deployed API in under five minutes. If you don't have the CLI yet, start with [Installation](/docs/getting-started/installation/).

## Install the SDK

```bash
npm install @vega/sdk
```

## Create your first endpoint

```ts title="api/index.ts"
import { vega } from '@vega/sdk';

export const api = vega.app({ region: 'global' });

api.get('/hello', () => Response.json({ message: 'Hello from the edge' }));
```

## Deploy

```bash
vega deploy
```

```txt frame="terminal"
Compiling api/index.ts…
✓ Built in 1.2s
✓ Deployed to 28 regions
→ https://acme-api.vega.dev  (42ms p99)
```

Your API is now live in 28 regions. Run `vega logs --follow` to watch requests stream in.

## Where to next

- [Core concepts](/docs/getting-started/concepts/) — apps, the request context, regions, deployments
- [Edge caching](/docs/guides/edge-caching/) — make the fast path the default with `cache.swr()`
- [API reference](/docs/api/) — the full `@vega/sdk` surface
