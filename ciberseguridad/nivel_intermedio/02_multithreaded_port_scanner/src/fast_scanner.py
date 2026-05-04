import socket
import threading
from queue import Queue
import time
import sys

# Lock para imprimir en consola de forma ordenada
print_lock = threading.Lock()
open_ports = []

def scan_port(target, port):
    """
    Función base para escanear un puerto.
    """
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        result = s.connect_ex((target, port))
        if result == 0:
            with print_lock:
                print(f"[+] Puerto {port} ABIERTO")
                open_ports.append(port)
        s.close()
    except:
        pass

def threader(target, q):
    """
    Hilo trabajador que consume de la cola.
    """
    while True:
        port = q.get()
        scan_port(target, port)
        q.task_done()

def run_fast_scan(target, start_p, end_p, thread_count=100):
    print("-" * 50)
    print(f"Escaneo rápido sobre: {target}")
    print(f"Hilos: {thread_count} | Rango: {start_p}-{end_p}")
    print("-" * 50)
    
    start_time = time.time()
    q = Queue()

    # Lanzamos los hilos
    for _ in range(thread_count):
        t = threading.Thread(target=threader, args=(target, q))
        t.daemon = True # Se cierra cuando el programa principal termina
        t.start()

    # Llenamos la cola con los puertos
    for port in range(start_p, end_p + 1):
        q.put(port)

    # Esperamos a que la cola se vacíe
    q.join()

    end_time = time.time()
    
    print("-" * 50)
    print(f"Escaneo finalizado en: {round(end_time - start_time, 2)} segundos")
    print(f"Puertos abiertos: {sorted(open_ports)}")
    print("-" * 50)

if __name__ == "__main__":
    target = input("Objetivo (IP/Dominio): ").strip()
    try:
        start_p = int(input("Puerto inicial: ") or 1)
        end_p = int(input("Puerto final: ") or 1024)
        t_count = int(input("Número de hilos (defecto 100): ") or 100)
        
        run_fast_scan(target, start_p, end_p, t_count)
    except ValueError:
        print("Error: Los puertos e hilos deben ser números.")
