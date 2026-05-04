import requests
import threading
from queue import Queue
import sys
import os

# Lock para impresión ordenada
print_lock = threading.Lock()

def check_path(url, path):
    """
    Realiza una petición a una ruta específica.
    """
    full_url = f"{url}/{path}"
    try:
        # Usamos HEAD para ser más rápidos (si el servidor lo permite)
        # Si no, caemos a GET
        response = requests.get(full_url, timeout=3, allow_redirects=False)
        
        status = response.status_code
        if status != 404:
            with print_lock:
                msg = f"[+] {status} | /{path}"
                if status in [301, 302]:
                    msg += f" -> {response.headers.get('Location')}"
                print(msg)
                
    except requests.RequestException:
        pass

def worker(url, q):
    """
    Hilo trabajador.
    """
    while not q.empty():
        path = q.get()
        check_path(url, path)
        q.task_done()

def run_bruteforce(target_url, wordlist_path, threads=10, extensions=None):
    if not os.path.exists(wordlist_path):
        print(f"Error: No se encontró el archivo {wordlist_path}")
        return

    if not target_url.startswith('http'):
        target_url = 'http://' + target_url
    if target_url.endswith('/'):
        target_url = target_url[:-1]

    print("-" * 50)
    print(f"Bruteforce iniciado sobre: {target_url}")
    print(f"Diccionario: {wordlist_path} | Hilos: {threads}")
    print("-" * 50)

    q = Queue()
    
    # Cargamos el diccionario en la cola
    try:
        with open(wordlist_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                word = line.strip()
                if word:
                    q.put(word)
                    # Añadir variaciones con extensiones
                    if extensions:
                        for ext in extensions:
                            q.put(f"{word}.{ext}")
    except Exception as e:
        print(f"Error al leer wordlist: {e}")
        return

    # Lanzamos hilos
    for _ in range(threads):
        t = threading.Thread(target=worker, args=(target_url, q))
        t.start()

    q.join()
    print("-" * 50)
    print("Enumeración finalizada.")

if __name__ == "__main__":
    target = input("URL Objetivo (ej: google.com): ").strip()
    w_path = input("Ruta a la wordlist: ").strip()
    exts = input("Extensiones a probar (separadas por coma, ej: php,txt) [Opcional]: ").strip()
    ext_list = [e.strip() for e in exts.split(",")] if exts else None
    
    try:
        t_count = int(input("Número de hilos (defecto 10): ") or 10)
        run_bruteforce(target, w_path, t_count, ext_list)
    except ValueError:
        print("Error: El número de hilos debe ser entero.")
