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
  { name: "edge-fw-01",      ip: "10.10.0.1",   os: "JunOS 22.4",             owner: "netops",      type: "network",     criticality: "critical", riskScore: 86 },
  { name: "corp-dc-01",      ip: "10.20.0.10",  os: "Windows Server 2022",     owner: "infra",       type: "server",      criticality: "critical", riskScore: 78 },
  { name: "k8s-prod-01",     ip: "10.30.0.5",   os: "Kubernetes 1.30",         owner: "platform",    type: "container",   criticality: "high",     riskScore: 64 },
  { name: "aws-billing",     ip: "10.40.0.2",   os: "AWS Account 9921",        owner: "finops",      type: "cloud",       criticality: "high",     riskScore: 58 },
  { name: "ws-eng-42",       ip: "10.50.0.42",  os: "macOS 14.5",             owner: "engineering", type: "workstation", criticality: "medium",   riskScore: 41 },
  { name: "ws-fin-08",       ip: "10.50.0.8",   os: "Windows 11 23H2",         owner: "finance",     type: "workstation", criticality: "medium",   riskScore: 36 },
  { name: "db-pii-01",       ip: "10.20.5.11",  os: "PostgreSQL 16",          owner: "data",        type: "server",      criticality: "critical", riskScore: 91 },
  { name: "ci-runner-3",     ip: "10.60.0.3",   os: "Ubuntu 24.04",           owner: "devops",      type: "server",      criticality: "high",     riskScore: 47 },
  { name: "vpn-mgmt-01",     ip: "10.10.0.7",   os: "Linux 6.1",              owner: "netops",      type: "network",     criticality: "high",     riskScore: 55 },
  { name: "k8s-stage-02",    ip: "10.31.0.2",   os: "Kubernetes 1.30",         owner: "platform",    type: "container",   criticality: "low",      riskScore: 24 },
  { name: "corp-mail-01",    ip: "10.20.0.12",  os: "Exchange Server 2019",    owner: "infra",       type: "server",      criticality: "critical", riskScore: 72 },
  { name: "ws-hr-15",        ip: "10.50.0.15",  os: "Windows 11 23H2",         owner: "hr",          type: "workstation", criticality: "medium",   riskScore: 30 },
  { name: "ws-sales-03",     ip: "10.50.0.33",  os: "macOS 14.2",             owner: "sales",       type: "workstation", criticality: "medium",   riskScore: 35 },
  { name: "api-gateway-01",  ip: "10.30.0.1",   os: "Alpine Linux / Nginx",    owner: "platform",    type: "container",   criticality: "critical", riskScore: 68 },
  { name: "aws-s3-backups",  ip: "10.40.0.15",  os: "AWS S3 Storage Object",   owner: "secops",      type: "cloud",       criticality: "critical", riskScore: 82 },
  { name: "iot-badge-reader",ip: "192.168.5.50",os: "FreeRTOS Embedded v10",   owner: "facilities",  type: "network",     criticality: "low",      riskScore: 50 },
  { name: "gitlab-onprem",   ip: "10.60.0.10",  os: "Ubuntu 22.04 / GitLab",   owner: "devops",      type: "server",      criticality: "high",     riskScore: 60 },
  { name: "db-replica-01",   ip: "10.20.5.12",  os: "PostgreSQL 16",          owner: "data",        type: "server",      criticality: "high",     riskScore: 49 },
  { name: "ws-exec-01",      ip: "10.50.0.99",  os: "Windows 11 Enterprise",   owner: "executive",   type: "workstation", criticality: "critical", riskScore: 75 },
  { name: "proxy-egress-01", ip: "10.10.0.2",   os: "Squid on Debian 12",      owner: "netops",      type: "network",     criticality: "medium",   riskScore: 38 }
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
    published: new Date("2024-03-29"), affectedNames: ["edge-fw-01", "ci-runner-3", "k8s-prod-01", "gitlab-onprem"] },
  { cve: "CVE-2024-21413", title: "Microsoft Outlook RCE (MonikerLink)", severity: "high", cvss: 8.1, status: "open",
    description: "Crafted moniker bypasses Office Protected View.",
    published: new Date("2024-02-13"), affectedNames: ["ws-fin-08", "ws-eng-42", "ws-hr-15", "ws-exec-01"] },
  { cve: "CVE-2023-50164", title: "Apache Struts file-upload path traversal", severity: "high", cvss: 8.5, status: "in_review",
    description: "Path traversal can lead to RCE on Struts 2.5.x.",
    published: new Date("2023-12-07"), affectedNames: ["corp-dc-01"] },
  { cve: "CVE-2024-0204", title: "Fortra GoAnywhere MFT auth bypass", severity: "critical", cvss: 9.8, status: "open",
    description: "Unauthenticated administrative account creation.",
    published: new Date("2024-01-22"), affectedNames: ["corp-dc-01"] },
  { cve: "CVE-2023-44487", title: "HTTP/2 Rapid Reset DoS", severity: "medium", cvss: 7.5, status: "mitigated",
    description: "Stream cancellation DoS on HTTP/2 servers.",
    published: new Date("2023-10-10"), affectedNames: ["edge-fw-01", "k8s-stage-02", "api-gateway-01"] },
  { cve: "CVE-2024-1086", title: "Linux kernel netfilter UAF (nf_tables)", severity: "high", cvss: 7.8, status: "open",
    description: "Local UAF for privilege escalation.",
    published: new Date("2024-01-31"), affectedNames: ["ci-runner-3", "vpn-mgmt-01", "gitlab-onprem"] },
  { cve: "CVE-2022-22965", title: "Spring4Shell (Spring Core RCE)", severity: "critical", cvss: 9.8, status: "closed",
    description: "Historic Spring RCE — verify not present.",
    published: new Date("2022-04-01"), affectedNames: [] },
  { cve: "CVE-2024-23897", title: "Jenkins CLI arbitrary file read", severity: "high", cvss: 8.6, status: "remediating",
    description: "CLI reads arbitrary files; can lead to RCE with secrets.",
    published: new Date("2024-01-24"), affectedNames: ["ci-runner-3"] },
  { cve: "CVE-2021-44228", title: "Log4Shell (Apache Log4j2 RCE)", severity: "critical", cvss: 10.0, status: "mitigated",
    description: "JNDI lookup injection allows full remote execution.",
    published: new Date("2021-12-10"), affectedNames: ["corp-dc-01", "k8s-prod-01"] },
  { cve: "CVE-2023-38180", title: ".NET Core Denial of Service Vulnerability", severity: "medium", cvss: 7.5, status: "open",
    description: "Denial of service vulnerability exists in ASP.NET Core.",
    published: new Date("2023-08-08"), affectedNames: ["corp-mail-01"] },
  { cve: "CVE-2023-3519", title: "Citrix ADC and Gateway RCE", severity: "critical", cvss: 9.8, status: "open",
    description: "Unauthenticated remote code execution on NetScaler gateway devices.",
    published: new Date("2023-07-18"), affectedNames: ["vpn-mgmt-01"] },
  { cve: "CVE-2023-23397", title: "Microsoft Outlook NTLM Privilege Escalation", severity: "critical", cvss: 9.8, status: "closed",
    description: "Specially crafted emails trigger NTLM hash leakage.",
    published: new Date("2023-03-14"), affectedNames: ["ws-fin-08", "ws-hr-15"] },
  { cve: "CVE-2023-32409", title: "macOS WebKit Sandbox Bypass", severity: "high", cvss: 8.8, status: "open",
    description: "Arbitrary code execution outside browser sandbox via crafted web content.",
    published: new Date("2023-05-18"), affectedNames: ["ws-eng-42", "ws-sales-03"] },
  { cve: "CVE-2023-49103", title: "ownCloud graphapi phpinfo disclosure", severity: "high", cvss: 7.5, status: "open",
    description: "Exposure of sensitive environment credentials via phpinfo.",
    published: new Date("2023-11-21"), affectedNames: ["aws-billing"] },
  { cve: "CVE-2024-21626", title: "runc container escape (workdir path traversal)", severity: "high", cvss: 8.6, status: "remediating",
    description: "File descriptor leak allows container escape to host namespace.",
    published: new Date("2024-01-31"), affectedNames: ["k8s-prod-01", "k8s-stage-02"] },
  { cve: "CVE-2023-46604", title: "Apache ActiveMQ RCE", severity: "critical", cvss: 9.8, status: "open",
    description: "Unsafe deserialization leads to execution of arbitrary shell commands.",
    published: new Date("2023-10-27"), affectedNames: ["ci-runner-3"] },
  { cve: "CVE-2023-20198", title: "Cisco IOS XE Web UI Privilege Escalation", severity: "critical", cvss: 10.0, status: "open",
    description: "Unauthenticated administrative access and configuration injection.",
    published: new Date("2023-10-16"), affectedNames: ["proxy-egress-01"] },
  { cve: "CVE-2023-26360", title: "Adobe ColdFusion Deserialization RCE", severity: "high", cvss: 8.6, status: "closed",
    description: "Improper input validation leads to arbitrary code execution.",
    published: new Date("2023-03-14"), affectedNames: [] },
  { cve: "CVE-2024-27198", title: "JetBrains TeamCity Auth Bypass", severity: "critical", cvss: 9.8, status: "remediating",
    description: "Auth bypass leads to admin access and remote command execution.",
    published: new Date("2024-03-04"), affectedNames: ["gitlab-onprem"] },
  { cve: "CVE-2023-28252", title: "Windows CLFS Driver Privilege Escalation", severity: "high", cvss: 7.8, status: "open",
    description: "Kernel privilege escalation exploited in the wild by ransomware actors.",
    published: new Date("2023-04-11"), affectedNames: ["corp-dc-01", "ws-exec-01"] },
  { cve: "CVE-2023-4863", title: "libwebp Heap Buffer Overflow", severity: "critical", cvss: 8.8, status: "open",
    description: "Out-of-bounds write in webp rendering can trigger RCE across web browsers.",
    published: new Date("2023-09-12"), affectedNames: ["ws-eng-42", "ws-fin-08", "ws-hr-15", "ws-sales-03", "ws-exec-01"] },
  { cve: "CVE-2024-21634", title: "NodeJS HTTP Response Splitting", severity: "medium", cvss: 6.5, status: "open",
    description: "Response splitting can occur via crafted HTTP header fields.",
    published: new Date("2024-02-15"), affectedNames: ["api-gateway-01"] },
  { cve: "CVE-2023-40217", title: "Python SSL Socket Bypass", severity: "medium", cvss: 6.5, status: "closed",
    description: "Bypass SSL handshake protections under high volume requests.",
    published: new Date("2023-08-25"), affectedNames: [] },
  { cve: "CVE-2024-2961", title: "glibc iconv buffer overflow", severity: "high", cvss: 8.3, status: "open",
    description: "Out of bounds write in glibc iconv conversion utility leads to DoS or code execution.",
    published: new Date("2024-04-17"), affectedNames: ["ci-runner-3", "vpn-mgmt-01", "proxy-egress-01"] },
  { cve: "CVE-2023-51385", title: "OpenSSH command injection via ProxyCommand", severity: "high", cvss: 8.8, status: "open",
    description: "Command injection is possible via hostnames containing shell metacharacters.",
    published: new Date("2023-12-18"), affectedNames: ["ws-eng-42"] },
  { cve: "CVE-2023-46805", title: "Ivanti Connect Secure Authentication Bypass", severity: "critical", cvss: 9.8, status: "remediating",
    description: "Auth bypass leads to arbitrary request dispatching and access.",
    published: new Date("2024-01-10"), affectedNames: ["vpn-mgmt-01"] },
  { cve: "CVE-2024-21887", title: "Ivanti Connect Secure Command Injection", severity: "critical", cvss: 9.8, status: "open",
    description: "Command injection in administrative web interface allows system takeover.",
    published: new Date("2024-01-10"), affectedNames: ["vpn-mgmt-01"] },
  { cve: "CVE-2023-36884", title: "Windows HTML RCE (Storm-0978)", severity: "high", cvss: 8.3, status: "open",
    description: "Crafted Office documents trigger search bypass and remote DLL execution.",
    published: new Date("2023-07-11"), affectedNames: ["ws-fin-08", "ws-hr-15"] },
  { cve: "CVE-2023-24489", title: "Citrix ShareFile Padding Oracle Auth Bypass", severity: "critical", cvss: 9.8, status: "mitigated",
    description: "Cryptographic padding oracle bypass permits administrative access and RCE.",
    published: new Date("2023-06-13"), affectedNames: ["aws-billing"] },
  { cve: "CVE-2023-27997", title: "Fortinet FortiOS SSL VPN Heap Buffer Overflow", severity: "critical", cvss: 9.8, status: "closed",
    description: "Heap overflow inside SSL VPN component allows unauthenticated device takeover.",
    published: new Date("2023-06-12"), affectedNames: [] }
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
    mitre: "T1566, T1195, T1059", summary: "Long-running DPRK operator; financial and defense targeting." },
  { name: "APT29", origin: "RU-aligned (SVR)", motivation: "State espionage",
    aliases: "Cozy Bear, Nobelium, Midnight Blizzard", ttps: "Cloud identity hijack, malicious OAuth apps, spear-phishing",
    mitre: "T1078.004, T1566, T1133", summary: "Extremely stealthy campaigns targeting governments and diplomatic entities." },
  { name: "APT28", origin: "RU-aligned (GRU)", motivation: "Geopolitical espionage / disruption",
    aliases: "Fancy Bear, Pawn Storm, Strontium", ttps: "Exploiting zero-days, credential harvesting, malware droppers",
    mitre: "T1190, T1059, T1132", summary: "Focuses on military, government, and elections globally." },
  { name: "LockBit", origin: "Siberian / Russian (Cabal)", motivation: "Financial extortion (Ransomware)",
    aliases: "LockBit 3.0, LockBit Supp", ttps: "Ransomware-as-a-Service, double-extortion, credential access",
    mitre: "T1486, T1021, T1003", summary: "Highly active ransomware operation utilizing automated exfiltration and encryption." },
  { name: "Sandworm", origin: "RU-aligned (GRU Unit 74455)", motivation: "Destruction / Sabotage",
    aliases: "Telebots, Voodoo Bear", ttps: "OT attacks, wiper malware, industrial system disruption",
    mitre: "T0831, T1489, T1490", summary: "Infamous for electrical grid blackouts and NotPetya wiper attacks." },
  { name: "Muddy Water", origin: "Iran-aligned (MOIS)", motivation: "Espionage / intellectual property theft",
    aliases: "Mercury, Static Kitten", ttps: "Phishing, custom remote access trojans (RATs), lolbas execution",
    mitre: "T1566.001, T1059.003, T1204", summary: "Targets defense, government, and aviation industries across the Middle East." }
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
    id: "path-01",
    name: "Phishing -> Cloud Admin -> Production DB",
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
    id: "path-02",
    name: "Edge appliance -> Tunnel -> DC",
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
    id: "inc-2024-0001",
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
  },
  {
    id: "inc-2024-0002",
    title: "SQL Injection attempt on API Gateway",
    severity: "medium",
    phase: "eradication",
    summary: "WAF blocked several SQLi payloads directed to user login queries. Attacker IP was banned automatically.",
    events: [
      { phase: "detection", title: "WAF anomaly trigger", description: "Multiple high-frequency requests containing single quotes and UNION statements." },
      { phase: "investigation", title: "WAF logs check", description: "Trace logs confirm attacker was targeting API Gateway public route." },
      { phase: "containment", title: "Dynamic firewall block", description: "Attacker IP blocked at the edge router for 24h." },
      { phase: "eradication", title: "Patch SQL schema bindings", description: "Adjust backend validation models using safe bindings." }
    ]
  },
  {
    id: "inc-2024-0003",
    title: "Ransomware detection on CI-Runner-3",
    severity: "critical",
    phase: "investigation",
    summary: "System logs show file-renaming activity resembling Lockbit encryption patterns on CI workspace directories.",
    events: [
      { phase: "detection", title: "FIM Integrity Alert", description: "Sudden alteration of 200+ source files to .lockbit extensions." },
      { phase: "investigation", title: "Memory snapshot export", description: "Acquired memory dump of PID 8223 (suspicious runner script)." },
      { phase: "containment", title: "VLAN quarantine", description: "Isolated runner VM from internal network segments." }
    ]
  },
  {
    id: "inc-2024-0004",
    title: "Phishing email reported by Executive",
    severity: "low",
    phase: "recovery",
    summary: "Executive assistant reported a link redirecting to a clone of corporate login page. No credentials entered.",
    events: [
      { phase: "detection", title: "User report submission", description: "Suspicious message submitted to phishing sandbox." },
      { phase: "investigation", title: "Domain age lookup", description: "Fake site registered 3 hours ago." },
      { phase: "containment", title: "DNS sinkholing", description: "Corporate DNS sinkholed the malicious domain name." },
      { phase: "recovery", title: "Security awareness reminder", description: "Triggered brief awareness refresher module for the Executive group." }
    ]
  },
  {
    id: "inc-2024-0005",
    title: "Unauthorized S3 bucket access detected",
    severity: "critical",
    phase: "containment",
    summary: "AWS CloudTrail logged access to aws-s3-backups from a non-standard IP address lacking proper MFA tags.",
    events: [
      { phase: "detection", title: "CloudTrail GuardDuty alert", description: "S3 API calls executed using leaked engineer IAM keys." },
      { phase: "investigation", title: "Access logs analysis", description: "Confirming read requests to backups containing DB snapshots." },
      { phase: "containment", title: "IAM key revocation", description: "Disabled compromised IAM keys and forced session reset across accounts." }
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
  { target: "http://localhost:3000", category: "TLS", name: "HTTPS enforced", status: "warn", detail: "Plain HTTP listener active on loopback. Recommend HSTS in production.", evidence: "curl -I http://localhost:3000 -> 200" },
  { target: "http://localhost:3000", category: "Headers", name: "Security headers present", status: "pass", detail: "CSP, X-Frame-Options, Referrer-Policy configured via next.config.", evidence: "x-frame-options: DENY" },
  { target: "127.0.0.1", category: "Network", name: "No dangerous ports listening", status: "pass", detail: "Only loopback web ports open (3000, 5555).", evidence: "ss -tlnp" },
  { target: "127.0.0.1", category: "Auth", name: "Strong password policy", status: "warn", detail: "Demo accepts short passwords. Production requires 12+ chars and MFA.", evidence: "schema min(8)" },
  { target: "http://localhost:3000", category: "Cookies", name: "Secure, HttpOnly, SameSite", status: "pass", detail: "NextAuth cookies set with HttpOnly, SameSite=Lax.", evidence: "Set-Cookie: next-auth.session-token" },
  { target: "http://localhost:3000", category: "Logging", name: "Audit log enabled", status: "pass", detail: "Audit events written to local database via Prisma.", evidence: "/api/audit -> 200" },
  { target: "127.0.0.1", category: "System", name: "CPU utilization below threshold", status: "pass", detail: "Ensures the system host is not suffering resource starvation.", evidence: "load avg: 0.12" },
  { target: "127.0.0.1", category: "System", name: "Free RAM memory check", status: "pass", detail: "Protects running nodes from sudden out-of-memory crashes.", evidence: "free memory: 42%" },
  { target: "127.0.0.1", category: "System", name: "No tools of threat agents running", status: "pass", detail: "Validates active tasks to detect mimikatz or cobaltstrike instances.", evidence: "processes scanned: 140" },
  { target: "http://localhost:3000", category: "Environment", name: "Safe TLS Rejection variable", status: "pass", detail: "Ensures NODE_TLS_REJECT_UNAUTHORIZED is not disabled.", evidence: "NODE_TLS_REJECT_UNAUTHORIZED != 0" },
  { target: "http://localhost:3000", category: "Dependency", name: "No critical dependencies vulnerable", status: "warn", detail: "NPM packages checked against security audit catalog.", evidence: "npm audit: 20 warnings" },
  { target: "http://localhost:3000", category: "Files", name: "Env variables files unexposed", status: "pass", detail: "Checks that no database or authorization secrets are served under public path.", evidence: "http://localhost:3000/.env -> 404" },
  { target: "127.0.0.1", category: "OS", name: "Kernel version updated", status: "pass", detail: "Confirms host operating system is patched against known local privileges escalation.", evidence: "Kernel: patched" },
  { target: "127.0.0.1", category: "Network", name: "Firewall profile active", status: "pass", detail: "Validates local network interface filtering profile status.", evidence: "iptables/ufw/defender: enabled" },
  { target: "http://localhost:3000", category: "WAF", name: "WAF blocking active", status: "warn", detail: "Demo rates are not fully filtered at proxy gateway.", evidence: "rate-limiting active" }
];
