# Security Policy & Threat Model (STRIDE)

## 🛡️ Responsible Disclosure Policy

If you find a security vulnerability in SentinelX, please do not open a public issue. Instead, report it directly to the maintainer email specified in the repository configuration. All valid reports will receive a response within 48 hours and a coordinated disclosure timeline.

---

## 🏗️ Threat Model (STRIDE Assessment)

This assessment defines the threat boundaries and mitigation strategies implemented inside SentinelX.

| Threat Class (STRIDE) | Threat Description | Mitigation Strategy in SentinelX |
|-----------------------|--------------------|----------------------------------|
| **Spoofing** | Adversary tries to access the dashboard pretending to be an authorized analyst or engineer. | **NextAuth credentials provider** with Bcryptjs password hashing. Active session validation on all `/api/` and dashboard paths. |
| **Tampering** | Attackers upload malformed files or manipulate database records to inject malicious scripts (Stored XSS). | **Zod schema validation** on all incoming payloads. Static file uploads are processed entirely in memory, hashes are computed, and file content is never executed or written to raw executable host directories. |
| **Repudiation** | An analyst performs sensitive actions (e.g., deleting history entries) but claims they didn't. | **Local Audit Logger** (`lib/audit/logger.ts`) logs critical events (such as deletion attempts and logins) to stdout/system logs with timestamps and unique IDs. |
| **Information Disclosure** | Unauthorized users gain access to local system connection logs, hardware status, or database records. | **RBAC (Role-Based Access Control)** restricts sensitive endpoints. Views like `posture:run` or `audit:read` require specific roles (Engineer or Admin). |
| **Denial of Service** | Attackers upload extremely large files or spam scanning endpoints to exhaust memory and system CPU. | **File Upload limit** set strictly at 10 MB. Network posture scanner executes with a 3-second timeout constraint. Next.js server limits connection lifetimes. |
| **Elevation of Privilege** | An attacker abuses the posture scanner or file parser to run arbitrary system commands on the server host. | **Defensive, read-only commands** and libraries (`systeminformation`). The application does not accept raw command input or parameters passed directly to shell execution contexts. |

---

## 🔒 Security Hardening Settings

SentinelX implements the following defensive configurations:
- **CSP (Content Security Policy)**: Set strictly in `next.config.mjs` to block unauthorized source scripting and framing.
- **X-Frame-Options**: Configured to `DENY` to prevent clickjacking.
- **X-Content-Type-Options**: Set to `nosniff` to mitigate MIME-sniffing vulnerabilities.
- **Strict-Transport-Security (HSTS)**: Configured for 1 year to enforce encrypted SSL connections.
