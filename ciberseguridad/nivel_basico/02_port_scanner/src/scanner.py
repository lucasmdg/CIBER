import socket
import sys
from datetime import datetime

def scan_port(target, port):
    """
    Intenta conectarse a un puerto específico en el objetivo.
    Retorna True si el puerto está abierto, False de lo contrario.
    """
    try:
        # Creamos un socket TCP (AF_INET = IPv4, SOCK_STREAM = TCP)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # Establecemos un timeout corto para no esperar demasiado
        s.settimeout(0.5)
        # Intentamos conectar. connect_ex retorna 0 si la conexión fue exitosa
        result = s.connect_ex((target, port))
        s.close()
        return result == 0
    except Exception:
        return False

def run_scanner(target, start_port, end_port):
    print("-" * 50)
    print(f"Escaneando objetivo: {target}")
    print(f"Escaneo iniciado a las: {datetime.now()}")
    print("-" * 50)

    open_ports = []
    try:
        for port in range(start_port, end_port + 1):
            if scan_port(target, port):
                print(f"Puerto {port}: ABIERTO")
                open_ports.append(port)
    except KeyboardInterrupt:
        print("\nEscaneo interrumpido por el usuario.")
        sys.exit()
    except socket.gaierror:
        print("\nNo se pudo resolver el nombre del host.")
        sys.exit()
    except socket.error:
        print("\nNo se pudo conectar al servidor.")
        sys.exit()

    print("-" * 50)
    print(f"Escaneo finalizado.")
    print(f"Puertos abiertos encontrados: {open_ports}")
    print("-" * 50)

if __name__ == "__main__":
    # Configuración por defecto o mediante argumentos
    if len(sys.argv) >= 2:
        target = sys.argv[1]
    else:
        target = input("Introduce la IP o dominio a escanear (ej: 127.0.0.1): ")

    try:
        start_p = int(input("Puerto inicial (ej: 1): ") or 1)
        end_p = int(input("Puerto final (ej: 1024): ") or 1024)
        run_scanner(target, start_p, end_p)
    except ValueError:
        print("Error: Los puertos deben ser números enteros.")
