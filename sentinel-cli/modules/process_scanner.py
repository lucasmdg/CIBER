import psutil
import os
import re
from pathlib import Path

SUSPICIOUS_NAMES = [
    "miner", "xmrig", "cryptonight", "ethminer", "cpuminer",
    "rat", "backdoor", "keylog", "keylogger", "netcat",
    "nc.exe", "ncat", "socat", "mimikatz", "pwdump",
    "bloodhound", "cobaltstrike", "beacon", "meterpreter", "shellter",
]

TEMP_PATTERNS = ["temp", "tmp", "downloads", "desktop", "cache"]

KNOWN_SYSTEM_PROCESSES = [
    "lsass.exe", "svchost.exe", "winlogon.exe", "services.exe",
    "csrss.exe", "smss.exe", "wininit.exe", "taskhostw.exe",
    "explorer.exe", "spoolsv.exe", "sihost.exe", "ctfmon.exe",
    "runtimebroker.exe", "searchindexer.exe", "wmiprvse.exe",
    "svchost32.exe",
]


def _name_mimics_system(name):
    base = name.lower().replace(".exe", "")
    for sysp in KNOWN_SYSTEM_PROCESSES:
        sysbase = sysp.lower().replace(".exe", "")
        if base == sysbase:
            continue
        if len(base) == len(sysbase) and base != sysbase:
            diffs = sum(1 for a, b in zip(base, sysbase) if a != b)
            if diffs == 1 and diffs <= len(base) * 0.2:
                return True
        if base.startswith(sysbase[:4]) and len(base) <= len(sysbase) + 1:
            return True
    return False


VALID_PATHS = [
    r"\\Windows\\System32",
    r"\\Windows\\SysWOW64",
    r"\\Program Files",
    r"\\Program Files \(x86\)",
    r"\\Windows\\WinSxS",
]

SUSPICIOUS_PARENT_CHAIN = {
    "winword.exe": ["cmd.exe", "powershell.exe", "wscript.exe", "cscript.exe"],
    "excel.exe": ["cmd.exe", "powershell.exe", "wscript.exe", "cscript.exe"],
    "outlook.exe": ["cmd.exe", "powershell.exe"],
    "firefox.exe": ["cmd.exe"],
    "chrome.exe": ["cmd.exe"],
    "wmplayer.exe": ["cmd.exe", "powershell.exe"],
    "acrobat.exe": ["cmd.exe"],
    "acrord32.exe": ["cmd.exe", "powershell.exe"],
}


def classify_origin(exe_path):
    if not exe_path:
        return "UNKNOWN"
    low = exe_path.lower()
    if r"\windows\system32" in low or r"\windows\syswow64" in low:
        return "SYSTEM"
    if r"\program files" in low:
        return "APPLICATION"
    if r"\appdata" in low:
        return "USER"
    if r"\temp" in low or r"\tmp" in low:
        return "TEMP"
    if "downloads" in low:
        return "DESKTOP"
    if "desktop" in low:
        return "DESKTOP"
    if r"\windows" in low:
        return "SYSTEM"
    return "OTHER"


def calc_threat_score(proc_info, parent_name=None):
    score = 0
    exe = proc_info["exe"]
    name = proc_info["name"].lower()
    username = proc_info["username"]
    conn_count = proc_info["connections"]

    if exe:
        if any(p in exe.lower() for p in TEMP_PATTERNS):
            score += 30
        if not any(re.search(p, exe, re.I) for p in VALID_PATHS):
            score += 20
    if not exe or exe == "":
        score += 20
    if conn_count > 10:
        score += 25
    if any(s in name for s in SUSPICIOUS_NAMES):
        score += 40
    if username and username.lower() in ("root", "system", r"nt authority\system"):
        score += 15
    if _name_mimics_system(proc_info["name"]):
        score += 50
    if parent_name and exe:
        pname = parent_name.lower().replace(".exe", "")
        cnames = [c.lower().replace(".exe", "") for c in SUSPICIOUS_PARENT_CHAIN.get(pname, [])]
        if proc_info["name"].lower().replace(".exe", "") in cnames:
            score += 35
    if conn_count > 0 and not exe:
        score += 15

    return min(score, 100)


def get_process_list():
    results = []
    _pname_cache = {}
    for proc in psutil.process_iter(["pid", "name", "exe", "username", "ppid"]):
        try:
            info = proc.info
            exe = info["exe"] or ""
            cpu = proc.cpu_percent(interval=0)
            mem = proc.memory_percent()
            conns = len(proc.connections())
            ppid = info["ppid"]
            pname = ""
            if ppid:
                if ppid not in _pname_cache:
                    try:
                        _pname_cache[ppid] = psutil.Process(ppid).name()
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        _pname_cache[ppid] = ""
                pname = _pname_cache[ppid]
            pinfo = {
                "pid": info["pid"],
                "name": info["name"] or "Unknown",
                "exe": exe,
                "cpu_percent": round(cpu, 1),
                "memory_percent": round(mem, 2) if mem else 0.0,
                "username": info["username"] or "N/A",
                "connections": conns,
                "origin": classify_origin(exe),
            }
            pinfo["threat_score"] = calc_threat_score(pinfo, pname)
            results.append(pinfo)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue
    results.sort(key=lambda x: x["threat_score"], reverse=True)
    return results


def get_process_detail(pid):
    proc = psutil.Process(pid)
    info = proc.as_dict(attrs=["pid", "name", "exe", "username", "cmdline",
                                "create_time", "cwd", "status", "ppid",
                                "cpu_percent", "memory_percent", "num_threads"])
    try:
        conns = [{
            "laddr": f"{c.laddr.ip}:{c.laddr.port}" if c.laddr else "",
            "raddr": f"{c.raddr.ip}:{c.raddr.port}" if c.raddr else "",
            "status": c.status,
        } for c in proc.connections()]
    except (psutil.AccessDenied, psutil.NoSuchProcess):
        conns = []

    try:
        open_files_count = len(proc.open_files())
    except (psutil.AccessDenied, psutil.NoSuchProcess):
        open_files_count = 0

    exe = info.get("exe") or ""
    pname = info.get("name", "")
    ppid = info.get("ppid")
    parent_name = ""
    if ppid:
        try:
            parent_name = psutil.Process(ppid).name()
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            parent_name = ""

    flags = []
    if exe and any(p in exe.lower() for p in TEMP_PATTERNS):
        flags.append("Running from unusual path")
    if _name_mimics_system(pname):
        flags.append("Name mimics system process")
    if len(conns) > 10:
        flags.append("High connection count")
    if len(conns) > 0 and not exe:
        flags.append("No visible window with network activity")
    if not exe or not any(re.search(p, exe, re.I) for p in VALID_PATHS):
        flags.append("No digital signature")
    if parent_name:
        pp = parent_name.lower().replace(".exe", "")
        if pp in SUSPICIOUS_PARENT_CHAIN:
            targets = [c.lower().replace(".exe", "") for c in SUSPICIOUS_PARENT_CHAIN[pp]]
            if pname.lower().replace(".exe", "") in targets:
                flags.append(f"Spawned by {parent_name} unexpectedly")

    score = calc_threat_score({
        "exe": exe,
        "name": pname,
        "username": info.get("username", ""),
        "connections": len(conns),
    }, parent_name)

    if score >= 75:
        action = "TERMINATE"
    elif score >= 40:
        action = "INVESTIGATE"
    else:
        action = "MONITOR"

    return {
        "pid": info["pid"],
        "name": info["name"],
        "exe": exe,
        "origin": classify_origin(exe),
        "username": info.get("username") or "N/A",
        "cmdline": info.get("cmdline") or [],
        "cwd": info.get("cwd") or "",
        "status": info.get("status") or "",
        "ppid": ppid,
        "parent_name": parent_name,
        "created": info.get("create_time", 0),
        "cpu_percent": round(info.get("cpu_percent", 0) or 0, 1),
        "memory_percent": round(info.get("memory_percent", 0) or 0, 2),
        "num_threads": info.get("num_threads", 0),
        "connections": conns,
        "open_files_count": open_files_count,
        "behavioral_flags": flags,
        "threat_score": score,
        "recommended_action": action,
    }
