import re
from collections import Counter
import os

def analyze_logs(file_path):
    """
    Analiza un archivo de log y extrae estadísticas.
    """
    if not os.path.exists(file_path):
        print(f"Error: No se encontró el archivo {file_path}")
        return None

    # Expresión regular simple para logs estilo Common Log Format
    # Ejemplo: 127.0.0.1 - - [04/May/2026:10:00:00 +0000] "GET /index.html HTTP/1.1" 200 2326
    log_pattern = r'(?P<ip>\d+\.\d+\.\d+\.\d+).*?"(?P<method>\w+) (?P<path>.*?) HTTP/.*?" (?P<status>\d+)'

    ip_counts = Counter()
    status_counts = Counter()
    suspicious_ips = set()

    try:
        with open(file_path, 'r') as f:
            for line in f:
                match = re.search(log_pattern, line)
                if match:
                    data = match.groupdict()
                    ip = data['ip']
                    status = data['status']
                    
                    ip_counts[ip] += 1
                    status_counts[status] += 1
                    
                    # Identificar comportamiento sospechoso (ej: muchos 404)
                    if status == '404' and ip_counts[ip] > 10:
                        suspicious_ips.add(ip)

        return {
            "ip_counts": ip_counts,
            "status_counts": status_counts,
            "suspicious_ips": suspicious_ips
        }
    except Exception as e:
        print(f"Error al procesar el archivo: {e}")
        return None

def print_report(results):
    if not results:
        return

    print("-" * 50)
    print("REPORTE DE ANÁLISIS DE LOGS")
    print("-" * 50)

    print("\n[+] Top 5 IPs con más peticiones:")
    for ip, count in results['ip_counts'].most_common(5):
        print(f"  {ip}: {count}")

    print("\n[+] Distribución de Estados HTTP:")
    for status, count in results['status_counts'].items():
        print(f"  {status}: {count}")

    if results['suspicious_ips']:
        print("\n[!] IPs sospechosas (Posible escaneo de directorios):")
        for ip in results['suspicious_ips']:
            print(f"  {ip}")
    else:
        print("\n[+] No se detectaron IPs sospechosas.")
    print("-" * 50)

if __name__ == "__main__":
    path = input("Introduce la ruta del archivo de log: ").strip()
    results = analyze_logs(path)
    print_report(results)
