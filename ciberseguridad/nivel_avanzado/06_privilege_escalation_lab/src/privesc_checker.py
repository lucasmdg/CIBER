"""
Laboratorio de Escalada de Privilegios

Explicacion humana:
    La escalada de privilegios es cuando consigues acceso a una maquina
    como usuario normal y necesitas convertirte en administrador/root.
    Es uno de los pasos mas criticos en un pentest real.

    Este laboratorio simula los vectores mas comunes de escalada:
    - Binarios SUID mal configurados
    - Permisos incorrectos en archivos sensibles
    - Cron jobs vulnerables
    - Variables de entorno inseguras
    - Kernel exploits (simulados)
"""

import os
import json
from datetime import datetime


class PrivEscChecker:
    """Comprueba vectores comunes de escalada de privilegios."""

    def __init__(self):
        self.findings = []

    def check_suid_binaries(self, suid_list=None):
        """
        Busca binarios con el bit SUID que podrian usarse para escalar.
        En la vida real harias: find / -perm -4000 -type f 2>/dev/null
        """
        if suid_list is None:
            suid_list = [
                "/usr/bin/passwd", "/usr/bin/sudo", "/usr/bin/pkexec",
                "/usr/bin/python3", "/usr/bin/vim", "/usr/bin/find",
                "/usr/bin/nmap", "/usr/bin/bash"
            ]

        # Binarios que NO deberian tener SUID normalmente
        dangerous = {"python3", "vim", "find", "nmap", "bash", "perl",
                     "ruby", "env", "awk", "less", "more"}

        exploitable = []
        for binary in suid_list:
            name = os.path.basename(binary)
            if name in dangerous:
                exploitable.append({
                    "binary": binary,
                    "risk": "CRITICAL",
                    "note": f"{name} con SUID permite ejecucion como root"
                })

        if exploitable:
            self.findings.extend(exploitable)
        return exploitable

    def check_writable_files(self, files=None):
        """
        Busca archivos criticos con permisos de escritura incorrectos.
        Si puedes escribir en /etc/passwd, puedes crear un usuario root.
        """
        if files is None:
            files = [
                {"path": "/etc/passwd", "writable": False},
                {"path": "/etc/shadow", "writable": False},
                {"path": "/etc/sudoers", "writable": True},  # MAL!
                {"path": "/etc/crontab", "writable": True},  # MAL!
            ]

        issues = []
        for f in files:
            if f["writable"]:
                issue = {
                    "file": f["path"],
                    "risk": "CRITICAL",
                    "note": f"Archivo critico escribible: {f['path']}"
                }
                issues.append(issue)
                self.findings.append(issue)
        return issues

    def check_cron_jobs(self, cron_entries=None):
        """
        Analiza tareas programadas en busca de scripts ejecutados como
        root que un usuario normal pueda modificar.
        """
        if cron_entries is None:
            cron_entries = [
                {"job": "* * * * * root /opt/scripts/backup.sh",
                 "script_writable": True},
                {"job": "0 3 * * * root /usr/local/bin/cleanup",
                 "script_writable": False},
                {"job": "*/5 * * * * root /tmp/monitor.py",
                 "script_writable": True},
            ]

        exploitable = []
        for entry in cron_entries:
            if entry["script_writable"]:
                finding = {
                    "cron": entry["job"],
                    "risk": "CRITICAL",
                    "note": "Script ejecutado como root pero modificable por usuario"
                }
                exploitable.append(finding)
                self.findings.append(finding)
        return exploitable

    def check_kernel_version(self, version="5.4.0"):
        """Comprueba si la version del kernel tiene exploits conocidos."""
        vulnerable_kernels = {
            "3.13.0": "CVE-2015-1328 (OverlayFS)",
            "4.4.0": "CVE-2016-5195 (Dirty COW)",
            "5.8.0": "CVE-2021-3493 (OverlayFS)",
            "5.13.0": "CVE-2022-0847 (Dirty Pipe)",
        }

        # Comparacion simplificada
        for vuln_ver, cve in vulnerable_kernels.items():
            if version.startswith(vuln_ver.rsplit('.', 1)[0]):
                finding = {
                    "kernel": version,
                    "exploit": cve,
                    "risk": "CRITICAL"
                }
                self.findings.append(finding)
                return finding
        return None

    def check_env_path(self, path_dirs=None):
        """Comprueba si el PATH contiene directorios inseguros."""
        if path_dirs is None:
            path_dirs = ["/usr/bin", "/usr/local/bin", "/tmp", ".", "/home/user/bin"]

        dangerous = {".", "/tmp", "/var/tmp"}
        issues = []
        for d in path_dirs:
            if d in dangerous:
                issue = {
                    "directory": d,
                    "risk": "HIGH",
                    "note": f"Directorio inseguro en PATH: {d}"
                }
                issues.append(issue)
                self.findings.append(issue)
        return issues

    def full_audit(self):
        """Ejecuta todas las comprobaciones y genera un reporte."""
        self.findings = []

        suid = self.check_suid_binaries()
        writable = self.check_writable_files()
        cron = self.check_cron_jobs()
        kernel = self.check_kernel_version()
        path = self.check_env_path()

        report = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_findings": len(self.findings),
            "critical": len([f for f in self.findings if f.get("risk") == "CRITICAL"]),
            "high": len([f for f in self.findings if f.get("risk") == "HIGH"]),
            "findings": self.findings
        }
        return report


if __name__ == "__main__":
    print("=== Laboratorio de Escalada de Privilegios ===\n")
    checker = PrivEscChecker()
    report = checker.full_audit()
    print(f"Hallazgos totales: {report['total_findings']}")
    print(f"Criticos: {report['critical']} | Altos: {report['high']}")
    for f in report['findings'][:5]:
        print(f"  [{f.get('risk', '?')}] {f.get('note', f.get('exploit', ''))}")
