---
title: Installation
description: Install the Vega CLI and SDK, authenticate, and scaffold your first project.
sidebar:
  order: 2
---

Vega has two parts: the `vega` CLI, which builds and deploys your project, and `@vega/sdk`, the library your code imports. Both follow semver; the CLI is on the 3.x line and the SDK on 2.x.

## Requirements

- Node.js 22 or later
- npm, pnpm, or yarn
- A Vega account (the Free tier includes 100k requests/month across 3 regions)

## Install the CLI

Install the CLI globally so `vega` is available in any project:

```bash
npm install -g @vega/cli
```

Verify the install:

```bash
vega --version
```

```txt frame="terminal"
vega 3.1.0
```

## Authenticate

```bash
vega login
```

This opens your browser to complete sign-in, then stores a scoped token in `~/.vega/credentials`. In CI, set the `VEGA_TOKEN` environment variable instead — see [Deployments](/docs/guides/deployments/#deploying-from-ci).

## Create a project

`vega init` scaffolds a TypeScript project and links it to your account:

```bash
vega init acme-api
cd acme-api
```

The generated project is intentionally small:

```txt
acme-api/
├── api/
│   └── index.ts    # your app — routes, handlers, middleware
├── vega.json       # project link and build entry
├── package.json
└── tsconfig.json
```

`vega.json` holds the project binding; everything else — regions, caching, error handling — is configured in code:

```json title="vega.json"
{
  "project": "acme-api",
  "entry": "api/index.ts"
}
```

## Add the SDK to an existing project

Already have a repository? Install the SDK directly and add a `vega.json` with an `entry` pointing at the file that exports your app:

```bash
npm install @vega/sdk
```

## Run locally

```bash
vega dev
```

`vega dev` serves your app at `http://localhost:7700` with the same runtime, cache, and tracing behavior you get in production. Edits rebuild in well under a second.

## Next steps

- Deploy your first endpoint in the [Quickstart](/docs/getting-started/quickstart/)
- Understand apps, regions, and deployments in [Core concepts](/docs/getting-started/concepts/)
