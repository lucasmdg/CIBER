// Synthetic, clearly-labelled demo data. No real PII, no exploit payloads.

export type SampleAsset = {
  name: string;
  ip: string;
  os: string;
  owner: string;
  type: "server" | "workstation" | "container" | "cloud" | "network";
  criticality: "low" | "medium" | "high" | "critical";
  riskScore: number;
};

export const sampleAssets: SampleAsset[] = [
  { name: "edge-fw-01",  ip: "10.10.0.1",  os: "JunOS 22.4",     owner: "netops",   type: "network",     criticality: "critical", riskScore: 86 },
  { name: "corp-dc-01",  ip: "10.20.0.10", os: "Windows Server 2022", owner: "infra", type: "server",  criticality: "critical", riskScore: 78 },
  { name: "k8s-prod-01", ip: "10.30.0.5",  os: "Kubernetes 1.30", owner: "platform", type: "container", criticality: "high",  riskScore: 64 },
  { name: "aws-billing", ip: "10.40.0.2",  os: "AWS Account 9921", owner: "finops", type: "cloud",      criticality: "high",  riskScore: 58 },
  { name: "ws-eng-42",   ip: "10.50.0.42", os: "macOS 14.5",     owner: "engineering", type: "workstation", criticality: "medium", riskScore: 41 },
  { name: "ws-fin-08",   ip: "10.50.0.8",  os: "Windows 11 23H2", owner: "finance", type: "workstation", criticality: "medium", riskScore: 36 },
  { name: "db-pii-01",   ip: "10.20.5.11", os: "PostgreSQL 16",  owner: "data",   type: "server",      criticality: "critical", riskScore: 91 },
  { name: "ci-runner-3", ip: "10.60.0.3",  os: "Ubuntu 24.04",   owner: "devops",  type: "server",      criticality: "high",  riskScore: 47 },
  { name: "vpn-mgmt-01", ip: "10.10.0.7",  os: "Linux 6.1",      owner: "netops",  type: "network",     criticality: "high",  riskScore: 55 },
  { name: "k8s-stage-02",ip: "10.31.0.2",  os: "Kubernetes 1.30", owner: "platform", type: "container", criticality: "low",   riskScore: 24 }
];

export type SampleVuln = {
  cve: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  cvss: number;
  status: "open" | "in_review" | "remediating" | "mitigated" | "closed";
  description: string;
  published: Date;
  affectedNames?: string[];
};

export const sampleVulns: SampleVuln[] = [
  { cve: "CVE-2024-3094", title: "XZ Utils Backdoor (Jia Tan supply-chain)", severity: "critical", cvss: 10.0, status: "remediating",
    description: "Malicious code in liblzma allows SSH RCE. Patch liblzma to 5.6.1+.",
    published: new Date("2024-03-29"), affectedNames: ["edge-fw-01", "ci-runner-3", "k8s-prod-01"] },
  { cve: "CVE-2024-21413", title: "Microsoft Outlook RCE (MonikerLink)", severity: "high", cvss: 8.1, status: "open",
    description: "Crafted moniker bypasses Office Protected View.",
    published: new Date("2024-02-13"), affectedNames: ["ws-fin-08", "ws-eng-42"] },
  { cve: "CVE-2023-50164", title: "Apache Struts file-upload path traversal", severity: "high", cvss: 8.5, status: "in_review",
    description: "Path traversal can lead to RCE on Struts 2.5.x.",
    published: new Date("2023-12-07"), affectedNames: ["corp-dc-01"] },
  { cve: "CVE-2024-0204", title: "Fortra GoAnywhere MFT auth bypass", severity: "critical", cvss: 9.8, status: "open",
    description: "Unauthenticated administrative account creation.",
    published: new Date("2024-01-22"), affectedNames: [] },
  { cve: "CVE-2023-44487", title: "HTTP/2 Rapid Reset DoS", severity: "medium", cvss: 7.5, status: "mitigated",
    description: "Stream cancellation DoS on HTTP/2 servers.",
    published: new Date("2023-10-10"), affectedNames: ["edge-fw-01", "k8s-stage-02"] },
  { cve: "CVE-2024-1086", title: "Linux kernel netfilter UAF (nf_tables)", severity: "high", cvss: 7.8, status: "open",
    description: "Local UAF for privilege escalation.",
    published: new Date("2024-01-31"), affectedNames: ["ci-runner-3"] },
  { cve: "CVE-2022-22965", title: "Spring4Shell (Spring Core RCE)", severity: "critical", cvss: 9.8, status: "closed",
    description: "Historic Spring RCE — verify not present.",
    published: new Date("2022-04-01"), affectedNames: [] },
  { cve: "CVE-2024-23897", title: "Jenkins CLI arbitrary file read", severity: "high", cvss: 8.6, status: "remediating",
    description: "CLI reads arbitrary files; can lead to RCE with secrets.",
    published: new Date("2024-01-24"), affectedNames: ["ci-runner-3"] }
];

export type SampleActor = {
  name: string;
  origin: string;
  motivation: string;
  aliases: string;
  ttps: string;
  mitre: string;
  summary: string;
};

export const sampleThreatActors: SampleActor[] = [
  { name: "Volt Typhoon", origin: "PRC-aligned", motivation: "Espionage / OT pre-positioning",
    aliases: "BRONZE SILHOUETTE, Vanguard Panda", ttps: "Living-off-the-land, valid accounts, edge devices",
    mitre: "T1078, T1190, T0855", summary: "Targets US critical infrastructure via stealth and edge persistence." },
  { name: "Scattered Spider", origin: "Western", motivation: "Financial / data extortion",
    aliases: "Octo Tempest, Muddled Libra", ttps: "Vishing, SIM swap, cloud admin abuse",
    mitre: "T1566, T1078.004, T1530", summary: "Aggressive social engineering against cloud and SaaS." },
  { name: "Lazarus Group", origin: "DPRK-aligned", motivation: "Espionage / crypto theft",
    aliases: "APT38, Hidden Cobra", ttps: "Spear-phishing, supply-chain, DeFi theft",
    mitre: "T1566, T1195, T1059", summary: "Long-running DPRK operator; financial and defense targeting." }
];

export type SampleMalware = {
  family: string;
  type: string;
  ttps: string;
  campaign: string;
  firstSeen: Date;
};

export const sampleMalware: SampleMalware[] = [
  { family: "Akira", type: "Ransomware", ttps: "SMB, RDP, double-extortion", campaign: "AkiraLeaks", firstSeen: new Date("2023-03-01") },
  { family: "BlackCat/ALPHV", type: "Ransomware", ttps: "Rust, ESXi, affiliates", campaign: "ALPHV", firstSeen: new Date("2021-11-01") },
  { family: "Qakbot", type: "Loader", ttps: "Macro docs, email chains, C2", campaign: "Qakbot resurgences", firstSeen: new Date("2008-04-01") },
  { family: "Raspberry Robin", type: "Worm/Loader", ttps: "USB, msiexec, tor proxy", campaign: "USB drop", firstSeen: new Date("2022-06-01") }
];

export type AttackPathStep = { id: string; label: string; type: "entry" | "execution" | "lateral" | "priv-esc" | "target" };
export type SampleAttackPath = { id?: string; name: string; scenario: string; steps: AttackPathStep[] };

export const sampleAttackPaths: SampleAttackPath[] = [
  {
    name: "Phishing ? Cloud Admin ? Production DB",
    scenario: "External phishing lands on a helpdesk inbox. SSO misconfig plus conditional access gaps let the actor pivot to a cloud admin role and reach the PII database.",
    steps: [
      { id: "1", label: "Spear-phish (helpdesk@)", type: "entry" },
      { id: "2", label: "OAuth consent grant abuse", type: "execution" },
      { id: "3", label: "Lateral to engineer laptop", type: "lateral" },
      { id: "4", label: "Cloud admin role assumed", type: "priv-esc" },
      { id: "5", label: "Reach db-pii-01", type: "target" }
    ]
  },
  {
    name: "Edge appliance ? Tunnel ? DC",
    scenario: "An exposed VPN appliance is compromised via valid accounts. A persistence tunnel is established toward the corporate domain controller.",
    steps: [
      { id: "1", label: "Compromise edge-fw-01", type: "entry" },
      { id: "2", label: "Steal valid admin token", type: "execution" },
      { id: "3", label: "Tunnel to corp subnet", type: "lateral" },
      { id: "4", label: "DCSync on corp-dc-01", type: "priv-esc" },
      { id: "5", label: "Stage ransomware payload", type: "target" }
    ]
  }
];

export type SampleIncident = {
  id?: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  phase: "detection" | "investigation" | "containment" | "eradication" | "recovery" | "post_incident";
  summary: string;
  events: { phase: string; title: string; description: string }[];
};

export const sampleIncidents: SampleIncident[] = [
  {
    id: "inc-2024-0007",
    title: "Suspected credential abuse on WS-FIN-08",
    severity: "high",
    phase: "containment",
    summary: "EDR detected impossible travel and unusual mailbox activity on a finance workstation.",
    events: [
      { phase: "detection", title: "Impossible travel alert", description: "Sign-ins from two continents in <30m." },
      { phase: "investigation", title: "Mailbox rule audit", description: "Auto-forward to external alias discovered." },
      { phase: "containment", title: "Disable account + revoke tokens", description: "Identity team disabled the user and revoked OAuth grants." },
      { phase: "eradication", title: "Reimage workstation", description: "Forensic image retained, host reimaged." },
      { phase: "recovery", title: "Restore from clean backup", description: "Mailbox restored from 12h-back snapshot." },
      { phase: "post_incident", title: "Lessons learned", description: "Add geo-fencing + tighten OAuth allow-list." }
    ]
  }
];

export type SamplePosture = {
  target: string;
  category: string;
  name: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  evidence?: string;
};

export const samplePosture: SamplePosture[] = [
  { target: "http://localhost:3000", category: "TLS", name: "HTTPS enforced", status: "warn", detail: "Plain HTTP listener active on loopback. Recommend HSTS in production.", evidence: "curl -I http://localhost:3000 ? 200" },
  { target: "http://localhost:3000", category: "Headers", name: "Security headers present", status: "pass", detail: "CSP, X-Frame-Options, Referrer-Policy configured via next.config.", evidence: "x-frame-options: DENY" },
  { target: "127.0.0.1", category: "Network", name: "No dangerous ports listening", status: "pass", detail: "Only loopback web ports open (3000, 5555).", evidence: "ss -tlnp" },
  { target: "127.0.0.1", category: "Auth", name: "Strong password policy", status: "warn", detail: "Demo accepts short passwords. Production requires 12+ chars and MFA.", evidence: "schema min(8)" },
  { target: "http://localhost:3000", category: "Cookies", name: "Secure, HttpOnly, SameSite", status: "pass", detail: "NextAuth cookies set with HttpOnly, SameSite=Lax.", evidence: "Set-Cookie: next-auth.session-token" },
  { target: "http://localhost:3000", category: "Logging", name: "Audit log enabled", status: "pass", detail: "Audit events written to PostgreSQL via Prisma.", evidence: "/api/audit ? 200" }
];
