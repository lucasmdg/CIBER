# SENTINEL-CLI · SOC-Grade Local Threat Monitor

<!-- SCREENSHOT -->

[![Python](https://img.shields.io/badge/Python-3.9%2B-00ff88?style=flat&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-00ff88?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![PSUtil](https://img.shields.io/badge/PSUtil-6.0-00ff88?style=flat)]()
[![Platform](https://img.shields.io/badge/OS-Windows%20|%20Linux-00ff88?style=flat)]()

SENTINEL-CLI is a real-time cybersecurity dashboard that runs entirely on your local machine. It monitors running processes, network connections, file system events, and system logs — surfacing indicators of compromise (IOCs) and suspicious activity in a single-pane-of-glass SOC terminal interface.

No external APIs required. All data stays local.

## Features

- **Process Scanner** — Lists all running processes with heuristic threat scoring (0-100). Detects name mimicry, unusual parent chains, temp/downloads execution, and more.
- **Network Monitor** — Active TCP/UDP connections with suspicious IP flagging, non-standard port detection, and bandwidth estimation.
- **File System Watcher** — Real-time monitoring of Desktop, Downloads, temp, and system directories via Watchdog.
- **IOC Checker** — Lookup IPs, domains, and file hashes against a local threat intelligence database (20+ seeded IOCs).
- **Log Parser** — Parses auth logs (Linux) or Security Event Log (Windows) for authentication failures, privilege escalations, and service events.
- **Recommendations Engine** — Analyzes current system state and provides actionable security recommendations.
- **SOC Terminal UI** — Dark cyberpunk aesthetic, JetBrains Mono, color-coded threat scores, mini score bars, process analysis slide panel, keyboard shortcuts.
- **Demo Mode** — Complete simulated dataset for demonstrations and testing without affecting real system data.

## Demo Mode vs Live Mode

SENTINEL-CLI has two operational modes:

### LIVE Mode
Uses real data from your system via psutil, watchdog, and system logs. Every process, connection, and event is from your actual machine.

### DEMO Mode (default)
Returns completely fictional but realistic data from a static JSON dataset (`data/demo_data.json`). Includes:
- 25 fictional processes (mix of safe, suspicious, and malicious)
- 20 network connections with fictional IPs and country flags
- 15 file system events
- 20 log entries with auth failures, successes, privilege escalations
- 3 pre-built recommendations

Toggle between modes using the button in the top bar, or press `D` on the keyboard.

## Threat Scoring Algorithm

Each process receives a score from 0 (safe) to 100 (critical) based on the following factors:

| Factor | Points | Description |
|--------|--------|-------------|
| Temp/Download path | +30 | Process running from temp, downloads, desktop, or cache |
| No valid signature path | +20 | Executable not in System32, Program Files, or known paths |
| No readable exe | +20 | Process has no executable path |
| High connection count | +25 | More than 10 open network connections |
| Suspicious name match | +40 | Name matches known malware patterns (miner, rat, backdoor, etc.) |
| SYSTEM/root running | +15 | Process running as SYSTEM or root unexpectedly |
| Name mimicry | +50 | Name closely mimics a system process (e.g., svch0st.exe, lssas.exe) |
| Suspicious parent spawn | +35 | Office/doc viewer spawning cmd.exe, powershell.exe, etc. |
| Network + no visible window | +15 | Has network connections but no executable path |

Score is clamped to a maximum of 100.

### Recommended Actions

- **MONITOR** (score 0-39): No immediate action needed
- **INVESTIGATE** (score 40-74): Process exhibits suspicious characteristics
- **TERMINATE** (score 75-100): Highly likely malicious — kill command available

## Installation

```bash
# Clone the repository
git clone https://github.com/lucashojii/sentinel-cli.git
cd sentinel-cli

# Install dependencies
pip install -r requirements.txt

# (Optional) Install geoip2 for GeoIP resolution
# pip install geoip2

# (Optional, Windows) Install pywin32 for Windows Event Log reading
# pip install pywin32

# Start the dashboard
python app.py

# Open in browser
# → http://localhost:5000
```

**Default password:** `12345`

## Project Structure

```
sentinel-cli/
├── app.py                     # Flask server, routes, mode system
├── modules/
│   ├── process_scanner.py     # Process enumeration + enhanced threat scoring
│   ├── network_monitor.py     # Network connections + suspicious detection + summary
│   ├── file_watcher.py        # Watchdog-based file system monitor
│   ├── ioc_checker.py         # IOC database lookup engine
│   └── log_parser.py          # Cross-platform auth/event log parser
├── data/
│   ├── ioc_database.json      # Seed IOC database (IPs, domains, hashes)
│   └── demo_data.json         # Demo mode simulated dataset
├── static/
│   └── index.html             # Single-page SOC dashboard frontend
├── requirements.txt
└── README.md
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth` | Authenticate with password |
| GET | `/api/mode` | Get current mode (demo/live) |
| POST | `/api/mode` | Set mode (demo/live) |
| GET | `/api/status` | System status (hostname, uptime, CPU, RAM) |
| GET | `/api/processes` | Process list with threat scores |
| GET | `/api/process/<pid>` | Detailed process analysis |
| GET | `/api/network` | Active connections with flag info |
| GET | `/api/network/summary` | Network summary statistics |
| GET | `/api/events` | File watcher events |
| GET | `/api/logs` | System log events |
| GET | `/api/logs/export` | Download logs as .txt |
| POST | `/api/ioc/check` | IOC lookup |
| GET | `/api/recommendations` | Security recommendations |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `D` | Toggle LIVE / DEMO mode |
| `R` | Force refresh all panels |
| `1` | Network tab |
| `2` | Events tab |
| `3` | IOC Lookup tab |
| `4` | Logs tab |
| `?` | Show keyboard shortcuts |

## Compatibility

- **Windows** 10+ (full support with Event Log reading)
- **Linux** Debian/Ubuntu/Arch (auth.log parsing)
- **macOS** — not tested; contributions welcome

> **Note:** Some features (e.g., full connection listing, system file monitoring) may require elevated privileges. The application degrades gracefully when admin/root is unavailable.

## Performance

- Minimal CPU overhead: process scanning runs on-demand per API request
- File watcher uses a bounded deque (max 200 events) to prevent memory growth
- All API responses are lightweight JSON
- Process name caching reduces redundant psutil calls

## Customization

- **IOC Database**: Edit `data/ioc_database.json` to add your own indicators
- **Demo Data**: Edit `data/demo_data.json` to customize the simulated dataset
- **Suspicious Process Names**: Edit `SUSPICIOUS_NAMES` in `modules/process_scanner.py`
- **Known Bad IP Ranges**: Edit `KNOWN_BAD_RANGES` in `modules/network_monitor.py`
- **Monitored Paths**: Edit `get_monitored_paths()` in `modules/file_watcher.py`
- **Password**: Change `_PASSWORD` in `app.py`

## Ethical Use Disclaimer

SENTINEL-CLI is designed for **authorized security assessment, education, and defensive monitoring only**. Users must ensure they have explicit permission to monitor the systems on which this tool is deployed. Unauthorized monitoring of systems you do not own or have explicit written permission to test is illegal and unethical. The authors assume no liability for misuse.

## License

MIT — Use freely, responsibly, and only on systems you own or have permission to monitor.
