import socket
import threading
import time

LOG_FILE = "honeypot_activity.log"

def log_event(port, ip, payload):
    time_str = time.strftime('%Y-%m-%d %H:%M:%S')
    log_entry = f"[{time_str}] [PORT {port}] IP: {ip} - Input: '{payload}'\n"
    print(f"[!] INTRUSIÓN CAPTURADA: {log_entry.strip()}")
    with open(LOG_FILE, "a") as f:
        f.write(log_entry)

def handle_client(client_socket, port, ip):
    client_socket.settimeout(3.0)
    try:
        if port == 22:
            # Banner SSH
            client_socket.sendall(b"SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.1\r\n")
            # Recibir credenciales
            data = client_socket.recv(1024).decode('utf-8', errors='ignore').strip()
            log_event(port, ip, data)
        elif port == 80:
            # Petición HTTP
            data = client_socket.recv(1024).decode('utf-8', errors='ignore').strip()
            first_line = data.split('\n')[0] if data else "Conexión vacía"
            log_event(port, ip, first_line)
            # Responder con un servidor web simulado
            response = "HTTP/1.1 200 OK\r\nServer: Apache/2.4.41 (Ubuntu)\r\nContent-Type: text/html\r\n\r\n<html><body><h1>It Works!</h1></body></html>"
            client_socket.sendall(response.encode())
        elif port == 3306:
            # Simular MySQL Handshake
            client_socket.sendall(b"\x0a5.7.29-0ubuntu0.18.04.1\x00\x0a\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00")
            data = client_socket.recv(1024).decode('utf-8', errors='ignore').strip()
            log_event(port, ip, data)
    except Exception as e:
        log_event(port, ip, f"Error en lectura de datos: {e}")
    finally:
        client_socket.close()

def start_honeypot(port):
    # Usar sockets en IPv4
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        s.bind(('0.0.0.0', port))
        s.listen(5)
        print(f"[+] Decoy Honeypot escuchando en puerto {port}...")
        while True:
            client, addr = s.accept()
            ip = addr[0]
            # Lanzar hilo independiente para no bloquear el puerto
            t = threading.Thread(target=handle_client, args=(client, port, ip))
            t.daemon = True
            t.start()
    except Exception as e:
        print(f"[-] Error al inicializar el puerto {port}: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("  SENTRY SEÑUELO HONEYPOT ENGINE")
    print("=" * 60)
    print(f"[*] Guardando logs en {LOG_FILE}\n")

    # Iniciar escuchadores en puertos de prueba no root para evitar problemas de permisos
    # SSH simulado en 2222, HTTP en 8080, MySQL en 33060
    ports = [2222, 8080, 33060]
    
    threads = []
    for port in ports:
        t = threading.Thread(target=start_honeypot, args=(port,))
        t.daemon = True
        threads.append(t)
        t.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[-] Deteniendo Honeypots.")
