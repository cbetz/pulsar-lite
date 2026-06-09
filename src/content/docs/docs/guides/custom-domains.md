---
title: Custom domains
description: Point your own domain at a Vega app, with TLS certificates issued and renewed automatically.
sidebar:
  order: 4
---

Every project gets a default domain at `<project>.vega.dev`. Production APIs usually want their own — this guide walks through adding one.

## Add a domain

```bash
vega domains add api.example.com
```

```txt frame="terminal"
✓ Domain api.example.com added to acme-api
→ Create a CNAME record:  api.example.com → edge.vega.dev
  Waiting for DNS…
```

The command waits for DNS to propagate and issues a TLS certificate as soon as it resolves. You can exit at any time; verification continues in the background.

## DNS records

For subdomains, a single CNAME is all that is required:

| Type  | Name  | Value           |
| ----- | ----- | --------------- |
| CNAME | `api` | `edge.vega.dev` |

`edge.vega.dev` resolves via anycast to the nearest of the 28 regions, so no per-region configuration is needed.

### Apex domains

CNAME records are not allowed at the zone apex (`example.com`). If your DNS provider supports ALIAS/ANAME records, point one at `edge.vega.dev`. Otherwise, use A records to Vega's anycast addresses:

| Type | Name | Value           |
| ---- | ---- | --------------- |
| A    | `@`  | `203.0.113.10`  |
| A    | `@`  | `203.0.113.11`  |

## TLS certificates

Certificates are issued automatically once DNS resolves — typically within 30 seconds — and renewed before expiry with no action on your side. Traffic is served over TLS 1.3 with HTTP/2 and HTTP/3.

## Wildcard domains

Scale plans can attach a wildcard, which routes any subdomain to your app and exposes the hostname on the request:

```bash
vega domains add "*.example.com"
```

```ts
api.use(async (ctx, next) => {
  const tenant = new URL(ctx.request.url).hostname.split('.')[0];
  ctx.trace.set('tenant', tenant);
  return next();
});
```

Wildcards require a TXT record for verification; the CLI prints the exact record to create.

## Checking status

```bash
vega domains ls
```

```txt frame="terminal"
DOMAIN              STATUS   TLS      ADDED
api.example.com     active   valid    2026-05-12
*.example.com       pending  —        2026-06-08
```

A domain stuck in `pending` almost always means the DNS record has not propagated yet or points somewhere else. `vega domains inspect api.example.com` shows what Vega currently sees for the name.
