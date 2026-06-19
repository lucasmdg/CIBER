# SENTINEL — Local Malware Analyzer

> **A beautiful, offline-first malware analysis tool.**  
> All analysis runs locally. Zero data leaves your machine. No cloud APIs. No telemetry.

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey)

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Launch SENTINEL
python app.py

# 3. Open in browser
# → http://localhost:5000
```

---

## Features

### 🔬 File Analyzer
- **Hash checking** — MD5/SHA256 cross-referenced against known-bad hash database
- **Signature analysis** — Detects file extension vs. real content mismatches (e.g., `.pdf` that's really an `.exe`)
- **Entropy calculation** — Flags packed/encrypted payloads via high-entropy detection
- **Suspicious string scanning** — Regex patterns for base64 blobs, PowerShell, IPs, registry keys, URLs, and more
- **Macro detection** — Scans `.docx`/`.xlsx` for VBA macros using `python-docx` and `openpyxl`
- **Script analysis** — Deep inspection of `.ps1`, `.bat`, `.vbs`, `.js` for obfuscation and attack patterns

### 🛡️ System Scanner
- **Process analysis** — Flags suspicious/running processes from unusual paths
- **Startup entry scan** — Reads Windows Registry Run keys (`HKCU`/`HKLM`)
- **Persistence path audit** — Checks `%AppData%`, `%Temp%`, `System32`, `/tmp`, `~/.config`
- **Network connection monitor** — Lists active connections, flags suspicious ports and remote IPs
- **Recent file audit** — Finds recently modified executables in sensitive directories

### 📊 Risk Scoring
- Each finding gets a severity level: 🟢 Clean / 🟡 Warning / 🟠 Suspicious / 🔴 Threat
- Overall system risk score (0–100) with circular gauge visualization
- Results grouped by category with expandable detail panels

### ⚡ Actionable Results
Every finding includes clear next steps:
- **Delete file** — One-click with confirmation dialog
- **Kill process** — Terminate suspicious processes
- **Disable startup entry** — Remove persistence mechanisms
- **Check hash on VirusTotal** — Opens `virustotal.com` in your browser (no API key needed)
- **Manual review guidance** — Step-by-step recommendations for critical findings

---

## UI / Design

- **Dark cyberpunk dashboard** with neon green accents (#00ff88)
- **Real-time threat radar** — Animated SVG radar sweep during scans
- **Drag & drop** file upload with animated glow effects
- **Circular risk gauge** — Pure CSS/SVG, no external libraries
- **Toast notifications** for all actions
- **Color-coded findings table** with expandable rows
- **Responsive layout** — Optimized for 1280px+ desktop

---

## Privacy & Safety

| Guarantee | Detail |
|-----------|--------|
| **100% Offline** | All analysis runs locally. No external network requests. |
| **No Storage** | File content is analyzed in memory only — never written to disk after analysis. |
| **No Logging** | No file paths or system data are logged to disk by the analysis engine. |
| **Explicit Consent** | Every destructive action (delete, kill) requires confirmation. |
| **Safe by Design** | No exploit testing, no payload generation, no network scanning of other machines. |

---

## Architecture

```
SENTINEL/
├── app.py                 # Flask backend — all scan logic
├── templates/
│   └── index.html         # Single-page frontend (HTML + CSS + JS)
├── requirements.txt       # Python dependencies
├── known_bad_hashes.txt   # Extendable hash database
├── .gitignore
└── README.md
```

### Stack
- **Backend:** Python 3.8+ with Flask
- **Frontend:** Single HTML file with vanilla JS, no frameworks
- **Fonts:** JetBrains Mono (headings), Inter (body) — loaded from Google Fonts
- **Libraries:** `psutil` (process/network), `python-docx` (macro detection), `openpyxl` (macro detection)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serves the dashboard |
| POST | `/api/analyze-file` | Upload file for analysis (multipart) |
| POST | `/api/scan-system` | Run full system scan |
| POST | `/api/kill-process` | Terminate a process (JSON: `{"pid": 1234}`) |
| POST | `/api/delete-file` | Delete a file (JSON: `{"path": "..."}`) |
| GET | `/api/health` | Health check |

---

## Extending the Hash Database

Add MD5 or SHA256 hashes to `known_bad_hashes.txt`, one per line:

```
d41d8cd98f00b204e9800998ecf8427e
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

Lines starting with `#` are ignored as comments.

---

## Requirements

- Python 3.8 or higher
- Windows, Linux, or macOS
- pip

### Python Dependencies
- Flask 3.x — Web server
- python-docx — Word document macro detection
- openpyxl — Excel workbook macro detection
- psutil — System/process/network introspection

---

## License

MIT License. See `LICENSE` for details.

---

## Disclaimer

**SENTINEL is a local analysis tool. It is NOT a substitute for a full antivirus solution.**  
While it can detect many indicators of compromise, it does not provide real-time protection.  
Always maintain defense in depth with proper security software, updates, and backups.

---

> Built with &#x1F9F1; for the security community.  
> **Stay safe. Stay local.**
