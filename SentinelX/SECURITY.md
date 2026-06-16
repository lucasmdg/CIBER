# Security Policy

SentinelX is a **defensive** and **educational** project. Pull requests that
introduce exploit code, payload generators, brute-force tooling, credential
harvesting, phishing kits or any offensive capability will be rejected and
reported to GitHub.

## Supported versions

| Version | Supported |
| --- | --- |
| 1.x | ? |
| < 1.0 | ? |

## Reporting a vulnerability

Please email `security@sentinelx.local` (replace with the real address before
publication). Do **not** open a public issue for suspected vulnerabilities.

Include:

- Description of the issue
- Reproduction steps
- Impact assessment
- Suggested fix (optional)

We aim to acknowledge reports within **3 business days**.

## Hardening checklist

- [x] Strict CSP, X-Frame-Options, HSTS, Referrer-Policy
- [x] Zod-validated request bodies
- [x] Parameterized Prisma queries
- [x] Per-IP rate limiting
- [x] Audit log of all write actions
- [x] Secrets via environment variables, never in the repo
- [x] Loopback-only posture checks
- [x] No outbound network calls except the configured posture target
- [x] gitleaks + CodeQL + Dependabot
