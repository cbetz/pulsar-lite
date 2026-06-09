---
title: Deployments
description: How Vega deployments work — production deploys, previews, instant rollbacks, secrets, and CI.
sidebar:
  order: 1
---

Every deploy produces an immutable, content-addressed artifact. Traffic moves between artifacts; artifacts themselves never change. That one property is what makes previews cheap and rollbacks instant.

## Deploy to production

```bash
vega deploy
```

```txt frame="terminal"
Compiling api/index.ts…
✓ Built in 1.2s
✓ Deployed to 28 regions
→ https://acme-api.vega.dev  (dpl_8f3k29)
```

The new deployment receives traffic only after it passes health checks in every target region, so a broken build never takes down a working one.

## Preview deployments

Deploy any branch to an isolated URL without touching production:

```bash
vega deploy --preview
```

```txt frame="terminal"
✓ Built in 1.1s
→ https://acme-api-git-rate-limits.preview.vega.dev  (dpl_2c7d41)
```

Previews run the same runtime and regions as production, with their own cache namespace. They expire after 30 days of no traffic.

If a preview looks good, promote the exact artifact you tested instead of rebuilding:

```bash
vega promote dpl_2c7d41
```

## Rollbacks

```bash
vega rollback            # back to the previous deployment
vega rollback dpl_8f3k29 # or to a specific one
```

Previous artifacts stay warm in every region, so a rollback is a routing change, not a redeploy — it takes effect in under 10 seconds globally.

List recent deployments with `vega deployments ls`.

## Environment variables and secrets

Secrets are set per project and injected into the handler context as `env`:

```bash
vega secrets set STRIPE_KEY
vega secrets ls
```

```ts
api.post('/charges', async ({ request, env }) => {
  const stripe = createClient(env.STRIPE_KEY);
  // ...
});
```

Changing a secret triggers a new deployment automatically; running code never sees a half-updated environment.

## Deploying from CI

Create a deploy token with `vega tokens create --scope deploy` and expose it as `VEGA_TOKEN`:

```yaml title=".github/workflows/deploy.yml"
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx @vega/cli deploy
        env:
          VEGA_TOKEN: ${{ secrets.VEGA_TOKEN }}
```

The same command with `--preview` on pull requests gives every PR its own URL.

## Region pinning

By default apps deploy to all 28 regions. Pin specific regions in code when data residency requires it:

```ts
export const api = vega.app({ region: ['fra', 'lhr', 'ams'] });
```

:::note
The Free tier deploys to 3 regions of your choice. Pro and Scale deploy to all 28.
:::
