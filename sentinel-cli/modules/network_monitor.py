import psutil
import os
from pathlib import Path

TOR_EXIT_NODES = [
    "185.220.101.0/24", "185.220.102.0/24", "185.220.103.0/24",
    "185.220.100.0/24", "91.121.222.0/24", "171.25.193.0/24",
    "154.127.61.0/24", "198.98.50.0/24", "199.249.230.0/24",
    "192.42.116.0/24",
]

KNOWN_BAD_RANGES = [
    "10.0.13.0/24", "203.0.113.0/24", "198.51.100.0/24",
    "192.0.2.0/24", "51.15.0.0/16", "91.134.200.0/24",
    "185.220.101.0/24", "171.25.193.0/24", "154.127.61.0/24",
    "192.42.116.0/24", "45.33.32.0/24", "104.248.50.0/24",
    "139.162.130.0/24", "85.93.88.0/24", "23.129.64.0/24",
    "193.32.126.0/24", "51.75.0.0/16", "163.172.0.0/16",
    "62.210.0.0/16", "54.36.0.0/16",
]

SAFE_PORTS = {80, 443, 53, 853, 22, 993, 587, 25, 465, 8080}


def _ip_in_cidr(ip, cidr):
    try:
        import ipaddress
        return ipaddress.ip_address(ip) in ipaddress.ip_network(cidr, strict=False)
    except Exception:
        return False


def is_malicious(ip):
    for cidr in KNOWN_BAD_RANGES:
        if _ip_in_cidr(ip, cidr):
            return True
    return False


def is_non_standard(remote_addr):
    try:
        ip, port_str = remote_addr.rsplit(":", 1)
        port = int(port_str)
        if port not in SAFE_PORTS:
            return True
    except Exception:
        return False
    return False


def get_connections():
    results = []
    try:
        conns = psutil.net_connections(kind="inet")
    except psutil.AccessDenied:
        conns = []
    _pname_cache = {}
    for conn in conns:
        try:
            laddr = conn.laddr
            raddr = conn.raddr
            local = f"{laddr.ip}:{laddr.port}" if laddr else "N/A"
            remote = f"{raddr.ip}:{raddr.port}" if raddr else "N/A"
            status = conn.status or "N/A"
            pid = conn.pid
            pname = ""
            if pid:
                if pid not in _pname_cache:
                    try:
                        _pname_cache[pid] = psutil.Process(pid).name()
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        _pname_cache[pid] = "Unknown"
                pname = _pname_cache[pid]

            country = ""
            flagged = False
            non_standard = False
            if raddr:
                flagged = is_malicious(raddr.ip)
                non_standard = is_non_standard(remote)

            results.append({
                "local_addr": local,
                "remote_addr": remote,
                "status": status,
                "pid": pid or 0,
                "process_name": pname,
                "country": "Unknown",
                "flagged": flagged,
                "non_standard_port": non_standard,
                "bytes_sent": 0,
                "bytes_recv": 0,
            })
        except Exception:
            continue
    return results


def get_network_summary():
    conns = get_connections()
    total = len(conns)
    established = sum(1 for c in conns if c["status"] == "ESTABLISHED")
    suspicious = sum(1 for c in conns if c["flagged"] or c["non_standard_port"])
    countries = set(c["country"] for c in conns if c["country"] and c["country"] != "Unknown")
    proc_counts = {}
    for c in conns:
        p = c["process_name"]
        if p:
            proc_counts[p] = proc_counts.get(p, 0) + 1
    top_procs = sorted(proc_counts.items(), key=lambda x: x[1], reverse=True)[:5]

    return {
        "total_connections": total,
        "established_count": established,
        "suspicious_count": suspicious,
        "unique_remote_countries": len(countries),
        "countries": list(countries),
        "top_processes_by_connections": [{"process": p, "connections": c} for p, c in top_procs],
    }
