import json
import re
from pathlib import Path

IOC_DB_PATH = Path(__file__).parent.parent / "data" / "ioc_database.json"

_ioc_data = None

def _load():
    global _ioc_data
    if _ioc_data is not None:
        return
    try:
        with open(IOC_DB_PATH) as f:
            _ioc_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        _ioc_data = {"ips": [], "domains": [], "hashes": []}

def _detect_type(query):
    if re.match(r"^[0-9a-f]{32}$", query, re.I):
        return "hash"
    if re.match(r"^[0-9a-f]{40}$", query, re.I):
        return "hash"
    if re.match(r"^[0-9a-f]{64}$", query, re.I):
        return "hash"
    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", query):
        return "ip"
    if re.match(r"^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$", query):
        return "domain"
    return "unknown"

def lookup(query):
    _load()
    q = query.strip().lower()
    dtype = _detect_type(q)
    found = False
    if dtype == "ip":
        found = q in [ip.lower() for ip in _ioc_data.get("ips", [])]
    elif dtype == "domain":
        found = q in [d.lower() for d in _ioc_data.get("domains", [])]
    elif dtype == "hash":
        found = q in [h.lower() for h in _ioc_data.get("hashes", [])]
    return {"found": found, "type": dtype if found else "none", "query": query}
