<div align="center">

# ??? SentinelX — Cyber Security Operations Dashboard

A defensive, educational SOC console for blue teams, security analysts and DevSecOps engineers.

[![CI](https://img.shields.io/badge/CI-GitHub_Actions-blue)]() [![CodeQL](https://img.shields.io/badge/CodeQL-enabled-blueviolet)]() [![Dependabot](https://img.shields.io/badge/Dependabot-enabled-brightgreen)]() [![Secret Scan](https://img.shields.io/badge/gitleaks-enabled-red)]() [![License: MIT](https://img.shields.io/badge/license-MIT-yellowgreen)]()

</div>

> SentinelX simulates a modern Security Operations Center. It is **100% defensive**:
> it never runs offensive tooling, generates payloads, performs brute force, or
> weaponises data. All telemetry is synthetic, public, or self-generated.

## ? Features

- **Executive Dashboard** — security score, KPIs, severity pie, trend area chart, risk heatmap, threat feed, compliance coverage.
- **Asset Inventory** — register and manage servers, workstations, containers, cloud and network assets. Search, filter, delete.
- **Vulnerability Management** — CVEs with CVSS, status, affected assets, sorting, filtering, search, monthly trend.
- **Threat Intelligence Center** — public threat actors, malware families and MITRE ATT&CK coverage per tactic.
- **Security Posture Scanner** — safe, **loopback / RFC1918 only** HTTP header and reachability checks with PDF export.
- **Attack Path Visualization** — interactive kill-chain graphs (React Flow) for tabletop exercises.
- **Incident Response** — NIST SP 800-61 phases timeline with per-phase events.
- **Security Reports** — Executive, Technical, Threat and Incident reports as branded PDFs.

## ?? Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn-style primitives + glassmorphism |
| Charts | Recharts |
| Graphs | React Flow |
| Auth | NextAuth (Credentials) |
| ORM | Prisma (SQLite by default, PostgreSQL ready) |
| Validation | Zod |
| Tests | Vitest + Playwright |
| DevSecOps | ESLint, Prettier, Husky, Commitlint, CodeQL, Dependabot, gitleaks, npm audit |

## ??? Defensive scope

This repository **must** stay defensive. The following are **forbidden**:

- Exploits, malware, reverse shells, persistence mechanisms
- Credential harvesting, phishing kits, brute force tooling
- Payload generators, weaponised scanners, unauthorised reconnaissance
- Real user data collection

See `SECURITY.md` and `THREAT_MODEL.md` for the full policy.

## ?? Local development

```bash
git clone https://github.com/<your-user>/Ciber.git
cd Ciber/SentinelX
cp .env.example .env
npm install
npx prisma migrate deploy
npx tsx prisma/seed.ts
npx tsx prisma/seed-users.ts
npm run dev
```

Then open <http://localhost:3000> and sign in with the demo credentials seeded above:

| Role | Email | Password |
| --- | --- | --- |
| Analyst | `analyst@sentinelx.local` | `SentinelX-Demo-2026` |
| Engineer | `engineer@sentinelx.local` | `SentinelX-Demo-2026` |
| Admin | `admin@sentinelx.local` | `SentinelX-Demo-2026` |

> Replace the seed password in production. The schema is configured for
> NextAuth + Prisma adapter; rotate secrets via environment variables only.

## ?? Docker

```bash
docker build -t sentinelx .
docker compose up -d
```

For hot-reload development:

```bash
docker compose -f docker-compose.dev.yml up
```

For a real PostgreSQL backend:

```bash
docker compose --profile postgres up
```

## ?? Tests

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
```

## ?? Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — system design and data model
- [THREAT_MODEL.md](docs/THREAT_MODEL.md) — STRIDE-style model and mitigations
- [SECURITY.md](SECURITY.md) — responsible disclosure and security policy
- [CONTRIBUTING.md](CONTRIBUTING.md) — code style, commit conventions
- [docs/screenshots/README.md](public/screenshots/README.md) — screenshot placeholders

## ??? Screenshots

Drop captures into `public/screenshots/` and reference them from
`public/screenshots/README.md`. Suggested frames:

- Executive dashboard
- Asset inventory
- Vulnerability list
- Threat intelligence center
- Posture scanner results
- Attack path graph
- Incident timeline
- Report PDF preview

## ?? Contributing

Contributions that keep the project defensive are welcome. Read `CONTRIBUTING.md`
and `SECURITY.md` first. Run `npm run lint && npm test` before opening a PR.

## ?? License

MIT — see [LICENSE](LICENSE).
