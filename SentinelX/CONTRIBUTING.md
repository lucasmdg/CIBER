# Contributing to SentinelX

Thanks for helping make this defensive SOC dashboard better! ??

## Ground rules

1. **Defensive only.** Anything that could be used offensively (exploits, scanners, payload generators) is **out of scope**.
2. **No real user data.** All sample data must be synthetic.
3. **Secure by default.** Validate input (Zod), escape output, parameterize queries, and respect RBAC.

## Workflow

1. Fork and create a feature branch: `git checkout -b feat/<short-name>`
2. Install: `npm install`
3. Make your change and add a Vitest test when relevant.
4. Run: `npm run lint && npm run typecheck && npm test`
5. Commit using [Conventional Commits](https://www.conventionalcommits.org) (enforced by commitlint + husky).
6. Open a pull request using the provided template.

## Code style

- TypeScript strict mode, no `any` unless justified.
- Tailwind utilities, no inline styles.
- Server components by default; mark `"use client"` only when needed.
- Co-locate UI primitives in `components/ui`.

## Adding a new page

1. Add a folder under `app/(dashboard)/<section>/`.
2. Create `<section>/page.tsx` and any `client.tsx` files.
3. Add a route handler under `app/api/<section>/route.ts` if needed.
4. Wire navigation in `components/layout/shell.tsx`.
5. Add a Vitest unit test in `src/__tests__/`.
