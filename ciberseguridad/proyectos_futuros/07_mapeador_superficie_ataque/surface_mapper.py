import socket
import sys
import urllib.request
import urllib.error

def scan_ports(ip, ports):
    """Escanea puertos críticos de forma básica"""
    open_ports = []
    for port in ports:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1.0)
        result = s.connect_ex((ip, port))
        if result == 0:
            open_ports.append(port)
        s.close()
    return open_ports

def audit_http_headers(url):
    """Comprueba la presencia de cabeceras de seguridad HTTP"""
    headers_to_check = ["Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "Strict-Transport-Security"]
    missing_headers = []
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=3.0) as response:
            headers = response.info()
            for h in headers_to_check:
                if h not in headers:
                    missing_headers.append(h)
    except Exception as e:
        return [f"Error al conectar con HTTP: {e}"]
    return missing_headers

def map_surface(domain):
    print("=" * 60)
    print(f"  THREATMAP - RECONNAISSANCE ENGINE")
    print("=" * 60)
    print(f"[*] Escaneando superficie de ataque externa de: {domain}")
    
    # 1. Resolución DNS
    try:
        ip = socket.gethostbyname(domain)
        print(f"[+] IP Resuelta: {ip}")
    except socket.gaierror:
        print(f"[-] Error: No se pudo resolver el dominio '{domain}'.")
        return

    # 2. Escaneo de Puertos
    critical_ports = [21, 22, 25, 53, 80, 443, 8080]
    print(f"[*] Escaneando puertos críticos: {critical_ports}...")
    open_ports = scan_ports(ip, critical_ports)
    
    if open_ports:
        print(f"[!] Puertos abiertos detectados: {open_ports}")
    else:
        print("[+] Ningún puerto de la lista crítica está abierto.")

    # 3. Auditoría Web si tiene puerto 80 o 443
    url = f"http://{domain}"
    if 443 in open_ports:
        url = f"https://{domain}"
        
    if 80 in open_ports or 443 in open_ports:
        print(f"[*] Analizando cabeceras de seguridad web en {url}...")
        missing = audit_http_headers(url)
        if missing:
            print(f"[!] Cabeceras de seguridad HTTP ausentes: {missing}")
        else:
            print("[+] El servidor web tiene todas las cabeceras de seguridad configuradas.")
    
    # 4. Evaluación de Riesgo Heurística
    risk = "BAJO"
    risk_reasons = []
    
    if 22 in open_ports:
        risk_reasons.append("Puerto SSH expuesto públicamente.")
        risk = "MEDIO"
    if 21 in open_ports:
        risk_reasons.append("Puerto FTP expuesto (riesgo de texto claro).")
        risk = "MEDIO"
    if 8080 in open_ports:
        risk_reasons.append("Puerto alternativo HTTP 8080 abierto (posible panel dev).")
        risk = "ALTO"
    if len(open_ports) > 4:
        risk_reasons.append("Superficie de puertos demasiado amplia abierta.")
        risk = "ALTO"

    print("\n" + "=" * 50)
    print("  REPORTE FINAL DE SUPERFICIE DE ATAQUE")
    print("=" * 50)
    print(f"  Host: {domain} ({ip})")
    print(f"  NIVEL DE RIESGO: {risk}")
    if risk_reasons:
        print("  Razones:")
        for r in risk_reasons:
            print(f"    - {r}")
    else:
        print("    - No se encontraron factores de riesgo críticos.")
    print("=" * 50)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Usar un host de ejemplo si no se especifica ninguno
        map_surface("google.com")
    else:
        map_surface(sys.argv[1])
