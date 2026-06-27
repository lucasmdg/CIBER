import sys
import subprocess
import re
from datetime import datetime
from pathlib import Path

def _parse_auth_log(path):
    events = []
    try:
        with open(path, "r", errors="replace") as f:
            lines = f.readlines()[-500:]
    except (FileNotFoundError, PermissionError):
        return events
    for line in lines:
        line = line.strip()
        if not line:
            continue
        ts = _extract_timestamp(line)
        event_type = _tag_event(line)
        events.append({
            "timestamp": ts,
            "event_type": event_type,
            "source": Path(path).name,
            "message": line[:200],
        })
    return events

def _extract_timestamp(line):
    m = re.match(r"(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})", line)
    if m:
        return m.group(1)
    return ""

def _tag_event(line):
    ll = line.lower()
    if "failed password" in ll or "authentication failure" in ll or "invalid user" in ll:
        return "auth_failure"
    if "accepted password" in ll or "accepted publickey" in ll or "session opened" in ll:
        return "auth_success"
    if "started" in ll and ("service" in ll or "unit" in ll):
        return "service_start"
    if "sudo" in ll or "su:" in ll or "privilege" in ll or "new user" in ll:
        return "privilege_escalation"
    return "unknown"

def _get_windows_logs():
    events = []
    try:
        import win32evtlog
        hand = win32evtlog.OpenEventLog(None, "Security")
        flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ
        total = win32evtlog.GetNumberOfEventLogRecords(hand)
        raw = win32evtlog.ReadEventLog(hand, flags, 0)[:100]
        for record in raw:
            ts = str(record.TimeGenerated) if hasattr(record, "TimeGenerated") else ""
            eid = record.EventID if hasattr(record, "EventID") else 0
            src = record.SourceName if hasattr(record, "SourceName") else ""
            msg = " ".join(record.StringInserts) if record.StringInserts else ""
            etype = _tag_windows_event(eid)
            events.append({
                "timestamp": ts,
                "event_type": etype,
                "source": src,
                "message": msg[:200],
            })
        win32evtlog.CloseEventLog(hand)
    except ImportError:
        try:
            result = subprocess.run(
                ["wevtutil", "qe", "Security", "/c:100", "/f:text"],
                capture_output=True, text=True, timeout=10
            )
            raw = result.stdout
            blocks = raw.strip().split("Event[")
            for block in blocks[1:]:
                ts = ""
                etype = "unknown"
                src = "Security"
                msg = block[:200]
                m = re.search(r"Date:\s+(.+)", block)
                if m:
                    ts = m.group(1).strip()
                m = re.search(r"Event ID:\s+(\d+)", block)
                if m:
                    etype = _tag_windows_event(int(m.group(1)))
                events.append({
                    "timestamp": ts,
                    "event_type": etype,
                    "source": src,
                    "message": msg.strip()[:200],
                })
        except Exception:
            pass
    return events

def _tag_windows_event(eid):
    if eid in (4625, 4771, 4776, 4777):
        return "auth_failure"
    if eid in (4624, 4648, 4768, 4769):
        return "auth_success"
    if eid in (7036, 7040, 7045):
        return "service_start"
    if eid in (4672, 4673, 4674, 4703):
        return "privilege_escalation"
    return "unknown"

def get_logs(limit=100):
    if sys.platform == "win32":
        events = _get_windows_logs()
    else:
        events = []
        for p in ["/var/log/auth.log", "/var/log/syslog"]:
            events.extend(_parse_auth_log(p))
            if events:
                break
    return events[-limit:]
