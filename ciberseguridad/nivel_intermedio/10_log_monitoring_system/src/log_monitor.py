"""
Sistema de Monitorizacion de Logs en Tiempo Real

Explicacion humana:
    Imagina que tienes un servidor y quieres saber al instante si alguien
    intenta hacer algo sospechoso. Los "logs" son como un diario donde el
    sistema escribe todo lo que pasa (quién se conecta, quién falla al
    meter su contrasena, quién intenta acceder a cosas raras...).

    Este programa vigila esos logs en tiempo real (como un guardia de
    seguridad mirando las camaras) y te avisa si detecta algo peligroso:
    - Muchos intentos fallidos de login (posible fuerza bruta)
    - Accesos desde IPs sospechosas
    - Patrones conocidos de ataques

Uso:
    python log_monitor.py --logfile /var/log/auth.log
    python log_monitor.py --logfile mi_log.txt --rules reglas.json
"""

import re
import time
import json
import os
import sys
from collections import defaultdict
from datetime import datetime


class AlertLevel:
    """Niveles de alerta, como un semaforo de seguridad."""
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class DetectionRule:
    """
    Una regla de deteccion es basicamente un patron que buscamos en los logs.

    Por ejemplo: si vemos "Failed password" muchas veces seguidas desde la
    misma IP, eso huele a ataque de fuerza bruta.
    """
    def __init__(self, name, pattern, alert_level, threshold=1, window_seconds=60):
        self.name = name
        self.pattern = re.compile(pattern, re.IGNORECASE)
        self.alert_level = alert_level
        self.threshold = threshold        # Cuantas veces tiene que pasar
        self.window_seconds = window_seconds  # En cuanto tiempo
        self.hits = []                    # Registro de detecciones

    def check(self, line):
        """Comprueba si una linea del log coincide con esta regla."""
        match = self.pattern.search(line)
        if match:
            now = time.time()
            self.hits.append(now)
            # Limpiamos detecciones antiguas (fuera de la ventana de tiempo)
            self.hits = [h for h in self.hits
                         if now - h <= self.window_seconds]

            if len(self.hits) >= self.threshold:
                return True
        return False


class LogMonitor:
    """
    El vigilante principal. Lee logs linea a linea y aplica las reglas.
    """
    def __init__(self):
        self.rules = []
        self.alerts = []
        self.stats = defaultdict(int)

    def add_rule(self, rule):
        """Anade una nueva regla de deteccion."""
        self.rules.append(rule)

    def load_default_rules(self):
        """
        Carga las reglas por defecto. Estas son las tipicas cosas
        sospechosas que cualquier administrador de sistemas deberia vigilar.
        """
        default_rules = [
            DetectionRule(
                name="Intento de login fallido",
                pattern=r"(failed password|authentication failure|login failed)",
                alert_level=AlertLevel.WARNING,
                threshold=5,
                window_seconds=60
            ),
            DetectionRule(
                name="Acceso root/administrador",
                pattern=r"(root login|sudo|su -|administrator)",
                alert_level=AlertLevel.INFO,
                threshold=1,
                window_seconds=30
            ),
            DetectionRule(
                name="Posible inyeccion SQL",
                pattern=r"(union select|or 1=1|drop table|' or '|select \*)",
                alert_level=AlertLevel.CRITICAL,
                threshold=1,
                window_seconds=10
            ),
            DetectionRule(
                name="Escaneo de puertos detectado",
                pattern=r"(port scan|nmap|masscan|connection refused)",
                alert_level=AlertLevel.WARNING,
                threshold=10,
                window_seconds=30
            ),
            DetectionRule(
                name="Acceso a ruta sospechosa",
                pattern=r"(\/etc\/passwd|\/etc\/shadow|\.\.\/|cmd\.exe|powershell)",
                alert_level=AlertLevel.CRITICAL,
                threshold=1,
                window_seconds=10
            ),
            DetectionRule(
                name="Posible ataque de fuerza bruta SSH",
                pattern=r"(failed password for .+ from|invalid user .+ from)",
                alert_level=AlertLevel.CRITICAL,
                threshold=10,
                window_seconds=120
            ),
        ]

        for rule in default_rules:
            self.add_rule(rule)

    def process_line(self, line):
        """
        Procesa una linea del log contra todas las reglas activas.
        Retorna una lista de alertas generadas.
        """
        line = line.strip()
        if not line:
            return []

        generated_alerts = []

        for rule in self.rules:
            if rule.check(line):
                alert = {
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "rule": rule.name,
                    "level": rule.alert_level,
                    "line": line[:200],  # Truncamos por seguridad
                    "hits": len(rule.hits)
                }
                generated_alerts.append(alert)
                self.alerts.append(alert)
                self.stats[rule.name] += 1

        return generated_alerts

    def format_alert(self, alert):
        """Da formato bonito a una alerta para mostrar en consola."""
        level = alert['level']
        prefix = "[!]" if level == AlertLevel.CRITICAL else "[*]"
        return (
            f"  {prefix} [{level}] {alert['rule']}\n"
            f"      Hora: {alert['timestamp']} | Detecciones: {alert['hits']}\n"
            f"      Linea: {alert['line'][:100]}..."
        )

    def monitor_file(self, filepath, follow=True):
        """
        Monitoriza un archivo de log.

        Si follow=True, se queda esperando nuevas lineas (como tail -f).
        Si follow=False, solo procesa el archivo una vez y para.
        """
        if not os.path.exists(filepath):
            print(f"  [ERROR] El archivo no existe: {filepath}")
            return

        print(f"  [*] Monitorizando: {filepath}")
        print(f"  [*] Reglas activas: {len(self.rules)}")
        print("-" * 50)

        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            # Primero procesamos lo que ya hay en el archivo
            for line in f:
                alerts = self.process_line(line)
                for alert in alerts:
                    print(self.format_alert(alert))

            if not follow:
                return

            # Ahora nos quedamos esperando nuevas lineas
            print("  [*] Esperando nuevas entradas...")
            try:
                while True:
                    line = f.readline()
                    if line:
                        alerts = self.process_line(line)
                        for alert in alerts:
                            print(self.format_alert(alert))
                    else:
                        time.sleep(0.5)
            except KeyboardInterrupt:
                print("\n  [*] Monitorizacion detenida.")

    def get_summary(self):
        """Genera un resumen de todas las alertas detectadas."""
        summary = {
            "total_alertas": len(self.alerts),
            "por_regla": dict(self.stats),
            "criticas": len([a for a in self.alerts
                             if a['level'] == AlertLevel.CRITICAL]),
            "warnings": len([a for a in self.alerts
                             if a['level'] == AlertLevel.WARNING]),
        }
        return summary


def analyze_log_file(filepath):
    """
    Funcion de conveniencia para analizar un archivo de log de una vez.
    Util para llamar desde tests o desde otros scripts.
    """
    monitor = LogMonitor()
    monitor.load_default_rules()
    monitor.monitor_file(filepath, follow=False)
    return monitor.get_summary()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Sistema de Monitorizacion de Logs en Tiempo Real"
    )
    parser.add_argument("--logfile", required=True,
                        help="Ruta al archivo de log a monitorizar")
    parser.add_argument("--no-follow", action="store_true",
                        help="Analizar el archivo sin quedarse esperando")
    args = parser.parse_args()

    monitor = LogMonitor()
    monitor.load_default_rules()

    print("\n=== Sistema de Monitorizacion de Logs ===\n")
    monitor.monitor_file(args.logfile, follow=not args.no_follow)

    # Mostramos resumen al salir
    resumen = monitor.get_summary()
    print(f"\n  Resumen: {resumen['total_alertas']} alertas totales")
    print(f"  Criticas: {resumen['criticas']} | Warnings: {resumen['warnings']}")
