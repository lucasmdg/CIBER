import time
import re
import os
import random

# Simular la generación de logs
MOCK_LOG_FILE = "simulated_auth.log"

log_templates = [
    "Jun 05 19:40:12 server sshd[1024]: Accepted password for root from 192.168.1.50 port 54322 ssh2",
    "Jun 05 19:40:15 server sshd[1028]: Failed password for invalid user admin from 203.0.113.88 port 59012 ssh2",
    "Jun 05 19:40:17 server sshd[1028]: Failed password for invalid user admin from 203.0.113.88 port 59015 ssh2",
    "Jun 05 19:40:19 server sshd[1028]: Failed password for invalid user admin from 203.0.113.88 port 59020 ssh2",
    "Jun 05 19:40:22 server web_proxy[2033]: SQL Injection signature detected in URL query from 198.51.100.44",
    "Jun 05 19:40:25 server kernel: [1024.4] TCP Port Scan detected from 192.168.1.102 on ports 80-100",
    "Jun 05 19:40:28 server dhcpd[1122]: DHCPREQUEST for 192.168.1.15 from 00:11:22:33:44:55 via eth0"
]

def generate_mock_logs():
    """Escribe logs de forma continua en el archivo simulated_auth.log para el análisis"""
    with open(MOCK_LOG_FILE, "a") as f:
        log = random.choice(log_templates)
        f.write(log + "\n")

def monitor_logs():
    print("=" * 60)
    print("  AEGIS SIEM ENGINE - LOG COLLECTOR MONITOR")
    print("=" * 60)
    print(f"[*] Analizando {MOCK_LOG_FILE} en tiempo real...")
    
    # Crear archivo si no existe
    if not os.path.exists(MOCK_LOG_FILE):
        with open(MOCK_LOG_FILE, "w") as f:
            f.write("# Aegis Log System Initialized\n")

    # Guardar intentos fallidos por IP para detección de brute-force
    failed_attempts = {}

    with open(MOCK_LOG_FILE, "r") as f:
        # Ir al final
        f.seek(0, 2)
        
        while True:
            # Generar un log para la simulación
            generate_mock_logs()
            
            line = f.readline()
            if not line:
                time.sleep(1)
                continue

            line = line.strip()
            print(f"[LOG] {line}")

            # 1. Detección de Fuerza Bruta SSH
            if "Failed password" in line:
                match = re.search(r"from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", line)
                if match:
                    ip = match.group(1)
                    failed_attempts[ip] = failed_attempts.get(ip, 0) + 1
                    if failed_attempts[ip] >= 3:
                        print(f"\n[!!! ALERTA DE SEGURIDAD !!!] FUERZA BRUTA DETECTADA desde IP {ip} (Intentos fallidos: {failed_attempts[ip]})\n")
                        failed_attempts[ip] = 0 # Reiniciar contador tras alerta

            # 2. Detección de Inyección SQL
            elif "SQL Injection" in line:
                match = re.search(r"from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", line)
                if match:
                    ip = match.group(1)
                    print(f"\n[!!! ALERTA DE SEGURIDAD !!!] INTENTO DE SQL INJECTION desde IP {ip} detectado por WAF.\n")

            # 3. Detección de Port Scan
            elif "TCP Port Scan" in line:
                match = re.search(r"from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", line)
                if match:
                    ip = match.group(1)
                    print(f"\n[!!! ALERTA DE SEGURIDAD !!!] ESCANEO DE PUERTOS (RECON) detectado desde IP {ip}.\n")

            time.sleep(1.5)

if __name__ == "__main__":
    try:
        monitor_logs()
    except KeyboardInterrupt:
        print("\n[-] Deteniendo SIEM collector.")
        if os.path.exists(MOCK_LOG_FILE):
            os.remove(MOCK_LOG_FILE)
