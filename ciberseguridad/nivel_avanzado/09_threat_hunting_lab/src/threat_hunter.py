"""
Laboratorio de Threat Hunting

Explicacion humana:
    El Threat Hunting es la busqueda PROACTIVA de amenazas que ya estan
    dentro de tu red pero que los sistemas automaticos no han detectado.
    Es como ser un detective: en vez de esperar a que suene la alarma,
    vas tu a buscar pistas de que algo malo esta pasando.

    Este laboratorio te permite:
    - Analizar logs en busca de patrones sospechosos
    - Correlacionar eventos de diferentes fuentes
    - Crear hipotesis de ataque y verificarlas
    - Generar timelines de incidentes
"""

import re
import json
from collections import defaultdict, Counter
from datetime import datetime


class LogEvent:
    """Representa un evento individual de un log."""
    def __init__(self, timestamp, source, event_type, data, severity="INFO"):
        self.timestamp = timestamp
        self.source = source
        self.event_type = event_type
        self.data = data
        self.severity = severity

    def to_dict(self):
        return {
            "timestamp": self.timestamp,
            "source": self.source,
            "type": self.event_type,
            "data": self.data,
            "severity": self.severity
        }


class ThreatHunter:
    """Motor principal de Threat Hunting."""

    def __init__(self):
        self.events = []
        self.hypotheses = []
        self.findings = []
        self.ioc_database = {
            "ips": {"10.10.10.10", "192.168.1.666", "44.55.66.77"},
            "domains": {"evil-c2.com", "malware-cdn.net", "phishing-site.org"},
            "hashes": {"d41d8cd98f00b204e9800998ecf8427e"}
        }

    def ingest_events(self, events):
        """Carga eventos para analisis."""
        self.events.extend(events)

    def create_hypothesis(self, name, description, indicators):
        """
        Crea una hipotesis de ataque para verificar.
        Una hipotesis es algo como: "Creo que hay un atacante exfiltrando
        datos por DNS tunneling porque veo muchas consultas DNS largas".
        """
        hypothesis = {
            "id": len(self.hypotheses) + 1,
            "name": name,
            "description": description,
            "indicators": indicators,
            "status": "PENDING",
            "evidence": []
        }
        self.hypotheses.append(hypothesis)
        return hypothesis

    def hunt_brute_force(self, threshold=5, window_minutes=10):
        """Busca intentos de fuerza bruta en los eventos."""
        login_failures = defaultdict(list)

        for event in self.events:
            if "login" in event.event_type.lower() and "fail" in event.event_type.lower():
                source = event.data.get("source_ip", "unknown")
                login_failures[source].append(event)

        findings = []
        for ip, events in login_failures.items():
            if len(events) >= threshold:
                finding = {
                    "type": "Brute Force",
                    "severity": "HIGH",
                    "source_ip": ip,
                    "attempts": len(events),
                    "description": f"{len(events)} intentos fallidos desde {ip}"
                }
                findings.append(finding)
                self.findings.append(finding)

        return findings

    def hunt_lateral_movement(self):
        """Busca movimiento lateral (un host conectandose a muchos otros)."""
        connections = defaultdict(set)

        for event in self.events:
            if event.event_type in ["connection", "smb_access", "rdp_session"]:
                src = event.data.get("source_ip", "")
                dst = event.data.get("dest_ip", "")
                if src and dst:
                    connections[src].add(dst)

        findings = []
        for src, destinations in connections.items():
            if len(destinations) >= 3:
                finding = {
                    "type": "Lateral Movement",
                    "severity": "CRITICAL",
                    "source_ip": src,
                    "targets": list(destinations),
                    "description": f"{src} se conecto a {len(destinations)} hosts diferentes"
                }
                findings.append(finding)
                self.findings.append(finding)

        return findings

    def hunt_data_exfiltration(self, bytes_threshold=50_000_000):
        """Busca exfiltracion de datos (transferencias grandes inusuales)."""
        transfers = defaultdict(int)

        for event in self.events:
            if event.event_type == "data_transfer":
                dst = event.data.get("dest_ip", "")
                size = event.data.get("bytes", 0)
                transfers[dst] += size

        findings = []
        for dst, total_bytes in transfers.items():
            if total_bytes >= bytes_threshold:
                finding = {
                    "type": "Data Exfiltration",
                    "severity": "CRITICAL",
                    "destination": dst,
                    "total_mb": round(total_bytes / 1_000_000, 2),
                    "description": f"{round(total_bytes / 1_000_000, 2)}MB enviados a {dst}"
                }
                findings.append(finding)
                self.findings.append(finding)

        return findings

    def check_iocs(self):
        """Comprueba los eventos contra la base de datos de IOCs."""
        hits = []
        for event in self.events:
            data_str = json.dumps(event.data).lower()
            for ip in self.ioc_database["ips"]:
                if ip in data_str:
                    hits.append({
                        "type": "IOC Match",
                        "severity": "CRITICAL",
                        "ioc": ip,
                        "ioc_type": "IP",
                        "event": event.to_dict()
                    })
            for domain in self.ioc_database["domains"]:
                if domain in data_str:
                    hits.append({
                        "type": "IOC Match",
                        "severity": "CRITICAL",
                        "ioc": domain,
                        "ioc_type": "Domain",
                        "event": event.to_dict()
                    })

        self.findings.extend(hits)
        return hits

    def generate_timeline(self):
        """Genera una linea temporal de todos los hallazgos."""
        sorted_events = sorted(self.events, key=lambda e: e.timestamp)
        timeline = []
        for event in sorted_events:
            timeline.append({
                "time": event.timestamp,
                "source": event.source,
                "type": event.event_type,
                "severity": event.severity,
                "summary": str(event.data)[:100]
            })
        return timeline

    def full_hunt(self):
        """Ejecuta todas las tecnicas de hunting."""
        self.findings = []
        brute = self.hunt_brute_force()
        lateral = self.hunt_lateral_movement()
        exfil = self.hunt_data_exfiltration()
        iocs = self.check_iocs()

        report = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_events_analyzed": len(self.events),
            "total_findings": len(self.findings),
            "brute_force": len(brute),
            "lateral_movement": len(lateral),
            "data_exfiltration": len(exfil),
            "ioc_matches": len(iocs),
            "findings": self.findings
        }
        return report


if __name__ == "__main__":
    print("=== Laboratorio de Threat Hunting ===\n")

    hunter = ThreatHunter()

    # Simulamos eventos
    events = [
        LogEvent("2024-01-01 10:00:01", "firewall", "login_fail",
                 {"source_ip": "10.10.10.10", "user": "admin"}, "WARNING"),
        LogEvent("2024-01-01 10:00:02", "firewall", "login_fail",
                 {"source_ip": "10.10.10.10", "user": "admin"}, "WARNING"),
        LogEvent("2024-01-01 10:00:03", "firewall", "login_fail",
                 {"source_ip": "10.10.10.10", "user": "root"}, "WARNING"),
        LogEvent("2024-01-01 10:00:04", "firewall", "login_fail",
                 {"source_ip": "10.10.10.10", "user": "admin"}, "WARNING"),
        LogEvent("2024-01-01 10:00:05", "firewall", "login_fail",
                 {"source_ip": "10.10.10.10", "user": "test"}, "WARNING"),
        LogEvent("2024-01-01 10:01:00", "proxy", "connection",
                 {"source_ip": "192.168.1.50", "dest_ip": "evil-c2.com"}, "INFO"),
    ]
    hunter.ingest_events(events)
    report = hunter.full_hunt()
    print(json.dumps(report, indent=2, ensure_ascii=False, default=str))
