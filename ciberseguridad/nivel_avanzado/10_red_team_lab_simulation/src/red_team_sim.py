"""
Simulacion de Laboratorio Red Team

Explicacion humana:
    Un Red Team es un equipo que simula ser atacantes reales para poner
    a prueba las defensas de una organizacion. Este laboratorio simula
    un ejercicio completo de Red Team con todas sus fases:

    1. RECONOCIMIENTO: Recopilar informacion del objetivo
    2. ESCANEO: Identificar servicios y vulnerabilidades
    3. EXPLOTACION: Obtener acceso al sistema
    4. POST-EXPLOTACION: Escalar privilegios y moverse por la red
    5. EXFILTRACION: Extraer datos sensibles
    6. REPORTE: Documentar todo para el cliente

    Todo simulado, nada real. Es como un simulacro de incendio,
    pero para hackers.
"""

import json
from datetime import datetime
from enum import Enum


class Phase(Enum):
    RECON = "Reconocimiento"
    SCANNING = "Escaneo"
    EXPLOITATION = "Explotacion"
    POST_EXPLOITATION = "Post-Explotacion"
    EXFILTRATION = "Exfiltracion"
    REPORTING = "Reporte"


class Target:
    """Representa un objetivo del ejercicio."""
    def __init__(self, name, ip, services=None):
        self.name = name
        self.ip = ip
        self.services = services or []
        self.compromised = False
        self.access_level = "none"

    def to_dict(self):
        return {
            "name": self.name,
            "ip": self.ip,
            "services": self.services,
            "compromised": self.compromised,
            "access_level": self.access_level
        }


class RedTeamExercise:
    """Simulacion de un ejercicio de Red Team completo."""

    def __init__(self, exercise_name, scope):
        self.name = exercise_name
        self.scope = scope
        self.current_phase = Phase.RECON
        self.targets = []
        self.actions_log = []
        self.loot = []
        self.start_time = datetime.now()

    def log_action(self, action, details, phase=None):
        """Registra una accion del Red Team."""
        entry = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "phase": (phase or self.current_phase).value,
            "action": action,
            "details": details
        }
        self.actions_log.append(entry)
        return entry

    # ---- FASE 1: RECONOCIMIENTO ----
    def recon_passive(self):
        """Reconocimiento pasivo (OSINT, sin tocar el objetivo)."""
        self.current_phase = Phase.RECON
        findings = {
            "dns_records": ["A: 10.0.0.1", "MX: mail.target.local"],
            "subdomains": ["www", "mail", "vpn", "dev", "staging"],
            "emails_found": 3,
            "technologies": ["nginx", "PHP", "MySQL"],
            "social_media": "Perfiles profesionales encontrados"
        }
        self.log_action("Reconocimiento pasivo", findings)
        return findings

    def recon_active(self):
        """Reconocimiento activo (interaccion directa con el objetivo)."""
        targets = [
            Target("Servidor Web", "10.0.0.1", ["HTTP:80", "HTTPS:443", "SSH:22"]),
            Target("Servidor de Correo", "10.0.0.2", ["SMTP:25", "IMAP:143"]),
            Target("Base de Datos", "10.0.0.3", ["MySQL:3306"]),
            Target("Domain Controller", "10.0.0.10", ["LDAP:389", "SMB:445", "RDP:3389"]),
        ]
        self.targets = targets
        self.log_action("Reconocimiento activo", {
            "targets_found": len(targets),
            "services": sum(len(t.services) for t in targets)
        })
        return targets

    # ---- FASE 2: ESCANEO ----
    def scan_vulnerabilities(self):
        """Escanea los objetivos en busca de vulnerabilidades."""
        self.current_phase = Phase.SCANNING
        vulns = [
            {"target": "10.0.0.1", "vuln": "Apache Struts RCE (CVE-2017-5638)", "severity": "CRITICAL"},
            {"target": "10.0.0.1", "vuln": "Directory listing habilitado", "severity": "LOW"},
            {"target": "10.0.0.2", "vuln": "Open relay SMTP", "severity": "MEDIUM"},
            {"target": "10.0.0.3", "vuln": "MySQL sin contrasena root", "severity": "CRITICAL"},
            {"target": "10.0.0.10", "vuln": "SMB signing desactivado", "severity": "MEDIUM"},
        ]
        self.log_action("Escaneo de vulnerabilidades", {"vulns_found": len(vulns)})
        return vulns

    # ---- FASE 3: EXPLOTACION ----
    def exploit_target(self, target_ip, vulnerability):
        """Intenta explotar una vulnerabilidad en un objetivo."""
        self.current_phase = Phase.EXPLOITATION

        # Simulamos el resultado
        for target in self.targets:
            if target.ip == target_ip:
                target.compromised = True
                target.access_level = "user"
                self.log_action("Explotacion exitosa", {
                    "target": target_ip,
                    "vulnerability": vulnerability,
                    "access": "user"
                })
                return {"success": True, "access_level": "user", "target": target_ip}

        return {"success": False, "reason": "Objetivo no encontrado"}

    # ---- FASE 4: POST-EXPLOTACION ----
    def escalate_privileges(self, target_ip):
        """Intenta escalar privilegios en un objetivo comprometido."""
        self.current_phase = Phase.POST_EXPLOITATION

        for target in self.targets:
            if target.ip == target_ip and target.compromised:
                target.access_level = "root"
                self.log_action("Escalada de privilegios", {
                    "target": target_ip,
                    "from": "user",
                    "to": "root",
                    "method": "Kernel exploit (simulado)"
                })
                return {"success": True, "access_level": "root"}

        return {"success": False}

    def pivot_to_target(self, from_ip, to_ip):
        """Pivota desde un host comprometido a otro."""
        for target in self.targets:
            if target.ip == to_ip:
                target.compromised = True
                target.access_level = "user"
                self.log_action("Pivoting/Movimiento lateral", {
                    "from": from_ip,
                    "to": to_ip,
                    "method": "Pass-the-Hash"
                })
                return {"success": True, "target": to_ip}

        return {"success": False}

    # ---- FASE 5: EXFILTRACION ----
    def exfiltrate_data(self, target_ip, data_type="credentials"):
        """Simula la exfiltracion de datos sensibles."""
        self.current_phase = Phase.EXFILTRATION

        loot_item = {
            "source": target_ip,
            "type": data_type,
            "data": f"Datos simulados de tipo '{data_type}' desde {target_ip}",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.loot.append(loot_item)
        self.log_action("Exfiltracion de datos", loot_item)
        return loot_item

    # ---- FASE 6: REPORTE ----
    def generate_report(self):
        """Genera el reporte final del ejercicio."""
        self.current_phase = Phase.REPORTING

        compromised = [t for t in self.targets if t.compromised]
        root_access = [t for t in self.targets if t.access_level == "root"]

        report = {
            "exercise": self.name,
            "scope": self.scope,
            "start_time": self.start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "summary": {
                "total_targets": len(self.targets),
                "compromised": len(compromised),
                "root_access": len(root_access),
                "data_exfiltrated": len(self.loot),
                "total_actions": len(self.actions_log)
            },
            "targets": [t.to_dict() for t in self.targets],
            "loot": self.loot,
            "actions_log": self.actions_log
        }
        self.log_action("Reporte generado", {"status": "completo"})
        return report

    def run_full_exercise(self):
        """Ejecuta el ejercicio completo de principio a fin."""
        print(f"=== Ejercicio Red Team: {self.name} ===\n")

        # Fase 1
        print("[1/6] Reconocimiento...")
        self.recon_passive()
        self.recon_active()

        # Fase 2
        print("[2/6] Escaneo de vulnerabilidades...")
        vulns = self.scan_vulnerabilities()

        # Fase 3
        print("[3/6] Explotacion...")
        self.exploit_target("10.0.0.1", vulns[0]["vuln"])
        self.exploit_target("10.0.0.3", vulns[3]["vuln"])

        # Fase 4
        print("[4/6] Post-explotacion...")
        self.escalate_privileges("10.0.0.1")
        self.pivot_to_target("10.0.0.1", "10.0.0.10")

        # Fase 5
        print("[5/6] Exfiltracion...")
        self.exfiltrate_data("10.0.0.3", "database_dump")
        self.exfiltrate_data("10.0.0.10", "domain_hashes")

        # Fase 6
        print("[6/6] Generando reporte...")
        report = self.generate_report()

        print(f"\n[+] Ejercicio completado.")
        print(f"    Objetivos comprometidos: {report['summary']['compromised']}/{report['summary']['total_targets']}")
        print(f"    Acceso root: {report['summary']['root_access']}")
        print(f"    Datos exfiltrados: {report['summary']['data_exfiltrated']}")

        return report


if __name__ == "__main__":
    exercise = RedTeamExercise(
        exercise_name="Operacion Sombra Digital",
        scope="Red interna 10.0.0.0/24"
    )
    report = exercise.run_full_exercise()
