"""
Sistema de Deteccion de Intrusiones de Red (NIDS)

Explicacion humana:
    Esto es la version "pro" del IDS basico. Mientras que el basico solo
    miraba paquetes sueltos, este NIDS analiza FLUJOS completos de trafico,
    mantiene estadisticas por IP, detecta patrones complejos y genera
    reportes detallados.

    Piensa en el IDS basico como un guardia que mira por la mirilla,
    y este NIDS como un sistema completo de camaras con grabacion,
    reconocimiento facial y alarmas automaticas.
"""

import time
import json
from collections import defaultdict
from datetime import datetime


class ThreatIntelligence:
    """Base de datos de amenazas conocidas."""

    def __init__(self):
        self.blacklisted_ips = set()
        self.known_signatures = []

    def add_blacklisted_ip(self, ip):
        self.blacklisted_ips.add(ip)

    def is_blacklisted(self, ip):
        return ip in self.blacklisted_ips

    def load_signatures(self):
        """Carga firmas de ataques conocidos."""
        self.known_signatures = [
            {"name": "Nmap SYN Scan", "pattern": "SYN-only to multiple ports"},
            {"name": "SQL Injection", "pattern": "UNION SELECT in HTTP"},
            {"name": "Shellshock", "pattern": "() { :; } in HTTP headers"},
            {"name": "Log4Shell", "pattern": "${jndi:ldap:// in request"},
        ]
        return self.known_signatures


class NetworkFlow:
    """Representa un flujo de red (conexion entre dos hosts)."""

    def __init__(self, src_ip, dst_ip, protocol="TCP"):
        self.src_ip = src_ip
        self.dst_ip = dst_ip
        self.protocol = protocol
        self.packets = 0
        self.bytes_transferred = 0
        self.ports_accessed = set()
        self.start_time = time.time()
        self.flags = set()

    def add_packet(self, size, dst_port=None, flags=None):
        self.packets += 1
        self.bytes_transferred += size
        if dst_port:
            self.ports_accessed.add(dst_port)
        if flags:
            self.flags.update(flags)

    def duration(self):
        return time.time() - self.start_time

    def to_dict(self):
        return {
            "src": self.src_ip,
            "dst": self.dst_ip,
            "protocol": self.protocol,
            "packets": self.packets,
            "bytes": self.bytes_transferred,
            "ports": len(self.ports_accessed),
            "duration": round(self.duration(), 2)
        }


class NIDS:
    """Sistema de Deteccion de Intrusiones de Red."""

    def __init__(self):
        self.flows = {}
        self.alerts = []
        self.threat_intel = ThreatIntelligence()
        self.threat_intel.load_signatures()

        # Umbrales de deteccion
        self.PORT_SCAN_THRESHOLD = 15
        self.RATE_LIMIT_PPS = 1000  # paquetes por segundo
        self.DATA_EXFIL_BYTES = 10_000_000  # 10 MB

        # Estadisticas globales
        self.stats = {
            "total_packets": 0,
            "total_alerts": 0,
            "blocked_ips": set()
        }

    def get_flow_key(self, src_ip, dst_ip):
        return f"{src_ip}->{dst_ip}"

    def process_packet(self, src_ip, dst_ip, dst_port, size, protocol="TCP",
                       flags=None):
        """Procesa un paquete individual y lo agrega al flujo."""
        self.stats["total_packets"] += 1

        # 1. Comprobar IP en lista negra
        if self.threat_intel.is_blacklisted(src_ip):
            self._generate_alert(
                "IP en lista negra",
                f"Trafico desde IP bloqueada: {src_ip}",
                "CRITICAL", src_ip
            )
            return

        # 2. Obtener o crear flujo
        flow_key = self.get_flow_key(src_ip, dst_ip)
        if flow_key not in self.flows:
            self.flows[flow_key] = NetworkFlow(src_ip, dst_ip, protocol)

        flow = self.flows[flow_key]
        flow.add_packet(size, dst_port, flags)

        # 3. Analizar el flujo
        self._analyze_flow(flow)

    def _analyze_flow(self, flow):
        """Aplica todas las reglas de deteccion sobre un flujo."""

        # Deteccion de escaneo de puertos
        if len(flow.ports_accessed) > self.PORT_SCAN_THRESHOLD:
            self._generate_alert(
                "Escaneo de puertos",
                f"{flow.src_ip} ha tocado {len(flow.ports_accessed)} puertos en {flow.dst_ip}",
                "WARNING", flow.src_ip
            )

        # Deteccion de tasa excesiva (posible DDoS)
        # Necesitamos al menos 10 paquetes y 0.1s para evitar falsos positivos
        duration = flow.duration()
        if duration > 0.1 and flow.packets >= 10:
            pps = flow.packets / duration
            if pps > self.RATE_LIMIT_PPS:
                self._generate_alert(
                    "Tasa excesiva de paquetes",
                    f"{flow.src_ip}: {int(pps)} paquetes/segundo",
                    "CRITICAL", flow.src_ip
                )

        # Deteccion de exfiltracion de datos
        if flow.bytes_transferred > self.DATA_EXFIL_BYTES:
            self._generate_alert(
                "Posible exfiltracion de datos",
                f"{flow.src_ip} ha enviado {flow.bytes_transferred // 1_000_000}MB a {flow.dst_ip}",
                "CRITICAL", flow.src_ip
            )

    def _generate_alert(self, rule_name, description, severity, source_ip):
        alert = {
            "id": len(self.alerts) + 1,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "rule": rule_name,
            "description": description,
            "severity": severity,
            "source_ip": source_ip
        }
        self.alerts.append(alert)
        self.stats["total_alerts"] += 1

    def block_ip(self, ip):
        """Bloquea una IP (la anade a la lista negra)."""
        self.threat_intel.add_blacklisted_ip(ip)
        self.stats["blocked_ips"].add(ip)

    def get_alerts(self, severity=None):
        if severity:
            return [a for a in self.alerts if a["severity"] == severity]
        return self.alerts

    def get_report(self):
        """Genera un reporte del estado actual del NIDS."""
        return {
            "total_packets": self.stats["total_packets"],
            "total_alerts": self.stats["total_alerts"],
            "active_flows": len(self.flows),
            "blocked_ips": len(self.stats["blocked_ips"]),
            "critical_alerts": len(self.get_alerts("CRITICAL")),
            "signatures_loaded": len(self.threat_intel.known_signatures)
        }


if __name__ == "__main__":
    print("=== NIDS - Sistema de Deteccion de Intrusiones ===\n")

    nids = NIDS()

    # Simulamos trafico normal
    for port in [80, 443]:
        nids.process_packet("192.168.1.100", "10.0.0.1", port, 512)

    # Simulamos un escaneo de puertos
    for port in range(1, 30):
        nids.process_packet("10.10.10.10", "192.168.1.1", port, 64)

    # Mostramos alertas
    for alert in nids.get_alerts():
        print(f"  [{alert['severity']}] {alert['rule']}: {alert['description']}")

    report = nids.get_report()
    print(f"\n  Reporte: {json.dumps(report, indent=2)}")
