import sys
import os
import platform
import threading
import time
import hashlib
import hmac
import json
from pathlib import Path
from functools import wraps

import psutil
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from modules import process_scanner, network_monitor, file_watcher, ioc_checker, log_parser

app = Flask(__name__)
CORS(app)

_BOOT_TIME = time.time()
_STATIC_DIR = Path(__file__).parent / "static"
_DATA_DIR = Path(__file__).parent / "data"
_PASSWORD = "12345"
_SESSION_DURATION = 3600

FICTIONAL_HOSTNAME = "SENTINEL-SOC-PRIMARY-01"
FICTIONAL_IP = "10.0.13.37"
FICTIONAL_NETWORK = "10.0.13.0/24"

_current_mode = "demo"

_demo_data = None


def _load_demo():
    global _demo_data
    if _demo_data is None:
        try:
            with open(_DATA_DIR / "demo_data.json") as f:
                _demo_data = json.load(f)
        except Exception:
            _demo_data = {"processes": [], "network": [], "events": [], "logs": [], "recommendations": []}
    return _demo_data


def _generate_token():
    raw = f"{_PASSWORD}:{int(time.time() / _SESSION_DURATION)}:sentinel"
    return hashlib.sha256(raw.encode()).hexdigest()


def _check_token(token):
    if not token:
        return False
    now_slot = int(time.time() / _SESSION_DURATION)
    for offset in (0, -1):
        raw = f"{_PASSWORD}:{now_slot + offset}:sentinel"
        expected = hashlib.sha256(raw.encode()).hexdigest()
        if hmac.compare_digest(token, expected):
            return True
    return False


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "") if auth.startswith("Bearer ") else ""
        if not _check_token(token):
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated


@app.route("/")
def index():
    return send_from_directory(_STATIC_DIR, "index.html")


@app.route("/api/auth", methods=["POST"])
def api_auth():
    data = request.get_json(force=True)
    if data.get("password") == _PASSWORD:
        token = _generate_token()
        return jsonify({"token": token, "hostname": FICTIONAL_HOSTNAME, "ip": FICTIONAL_IP, "network": FICTIONAL_NETWORK, "mode": _current_mode})
    return jsonify({"error": "Invalid password"}), 401


@app.route("/api/mode", methods=["GET", "POST"])
@require_auth
def api_mode():
    global _current_mode
    if request.method == "POST":
        data = request.get_json(force=True)
        mode = data.get("mode", "demo")
        if mode in ("demo", "live"):
            _current_mode = mode
    return jsonify({"mode": _current_mode})


@app.route("/api/processes")
@require_auth
def api_processes():
    if _current_mode == "demo":
        return jsonify({"count": len(_load_demo()["processes"]), "processes": _load_demo()["processes"]})
    procs = process_scanner.get_process_list()
    return jsonify({"count": len(procs), "processes": procs})


@app.route("/api/process/<int:pid>")
@require_auth
def api_process_detail(pid):
    if _current_mode == "demo":
        procs = _load_demo()["processes"]
        for p in procs:
            if p["pid"] == pid:
                result = dict(p)
                score = result.get("threat_score", 0)
                if score >= 75:
                    result["recommended_action"] = "TERMINATE"
                elif score >= 40:
                    result["recommended_action"] = "INVESTIGATE"
                else:
                    result["recommended_action"] = "MONITOR"
                return jsonify(result)
        return jsonify({"error": "Process not found"}), 404
    try:
        detail = process_scanner.get_process_detail(pid)
        return jsonify(detail)
    except Exception as e:
        return jsonify({"error": str(e)}), 404


@app.route("/api/network")
@require_auth
def api_network():
    if _current_mode == "demo":
        return jsonify({"count": len(_load_demo()["network"]), "connections": _load_demo()["network"]})
    conns = network_monitor.get_connections()
    return jsonify({"count": len(conns), "connections": conns})


@app.route("/api/network/summary")
@require_auth
def api_network_summary():
    if _current_mode == "demo":
        net = _load_demo()["network"]
        total = len(net)
        established = sum(1 for c in net if c.get("status") == "ESTABLISHED")
        suspicious = sum(1 for c in net if c.get("flagged"))
        countries = set(c.get("country", "") for c in net if c.get("country") and c["country"] not in ("Local", ""))
        proc_counts = {}
        for c in net:
            p = c.get("process_name", "")
            if p:
                proc_counts[p] = proc_counts.get(p, 0) + 1
        top = sorted(proc_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        return jsonify({
            "total_connections": total,
            "established_count": established,
            "suspicious_count": suspicious,
            "unique_remote_countries": len(countries),
            "countries": list(countries),
            "top_processes_by_connections": [{"process": p, "connections": c} for p, c in top],
        })
    return jsonify(network_monitor.get_network_summary())


@app.route("/api/events")
@require_auth
def api_events():
    if _current_mode == "demo":
        events = _load_demo()["events"]
        return jsonify({"count": len(events), "events": events})
    limit = request.args.get("limit", 50, type=int)
    events = file_watcher.get_events(limit)
    return jsonify({"count": len(events), "events": events})


@app.route("/api/logs")
@require_auth
def api_logs():
    if _current_mode == "demo":
        logs = _load_demo()["logs"]
        return jsonify({"count": len(logs), "logs": logs})
    limit = request.args.get("limit", 100, type=int)
    logs = log_parser.get_logs(limit)
    return jsonify({"count": len(logs), "logs": logs})


@app.route("/api/logs/export")
@require_auth
def api_logs_export():
    if _current_mode == "demo":
        logs = _load_demo()["logs"]
    else:
        logs = log_parser.get_logs(100)
    text = "\n".join(f"[{l.get('timestamp','')}] [{l.get('event_type','')}] [{l.get('source','')}] {l.get('message','')}" for l in logs)
    return text, 200, {"Content-Type": "text/plain", "Content-Disposition": "attachment; filename=sentinel_logs_export.txt"}


@app.route("/api/ioc/check", methods=["POST"])
@require_auth
def api_ioc_check():
    data = request.get_json(force=True)
    query = data.get("query", "")
    result = ioc_checker.lookup(query)
    return jsonify(result)


@app.route("/api/status")
@require_auth
def api_status():
    uptime_secs = int(time.time() - _BOOT_TIME)
    hours, rem = divmod(uptime_secs, 3600)
    mins, secs = divmod(rem, 60)
    return jsonify({
        "hostname": FICTIONAL_HOSTNAME,
        "ip": FICTIONAL_IP,
        "network": FICTIONAL_NETWORK,
        "os": f"{platform.system()} {platform.release()}",
        "uptime": f"{hours}h {mins}m {secs}s",
        "cpu_percent": psutil.cpu_percent(interval=0.3),
        "memory_percent": psutil.virtual_memory().percent,
        "mode": _current_mode,
    })


@app.route("/api/recommendations")
@require_auth
def api_recommendations():
    if _current_mode == "demo":
        return jsonify(_load_demo().get("recommendations", []))
    recs = []
    procs = process_scanner.get_process_list()
    high_score = [p for p in procs if p["threat_score"] >= 60]
    if high_score:
        names = ", ".join(f"{p['name']}({p['threat_score']})" for p in high_score[:5])
        recs.append({
            "severity": "HIGH",
            "title": f"{len(high_score)} high-score processes detected",
            "description": f"Processes with threat score >60: {names}. Immediate investigation required.",
            "action": "Open process list",
        })
    conns = network_monitor.get_connections()
    flagged = [c for c in conns if c.get("flagged")]
    if flagged:
        recs.append({
            "severity": "MEDIUM",
            "title": f"{len(flagged)} suspicious network connections detected",
            "description": f"{len(flagged)} flagged connections to known-bad IP ranges detected.",
            "action": "Open network tab",
        })
    return jsonify(recs)


def _start_watcher():
    try:
        file_watcher.start_watcher()
    except Exception as e:
        print(f"[WARN] File watcher could not start: {e}")


if __name__ == "__main__":
    watcher_thread = threading.Thread(target=_start_watcher, daemon=True)
    watcher_thread.start()
    app.run(host="127.0.0.1", port=5000, debug=False)
