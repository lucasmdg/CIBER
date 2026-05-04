import hashlib
import sys
import os

def crack_hash(target_hash, wordlist_path, hash_type='md5'):
    """
    Intenta romper un hash usando un ataque de diccionario.
    """
    if not os.path.exists(wordlist_path):
        print(f"Error: No se encontró el archivo {wordlist_path}")
        return None

    try:
        with open(wordlist_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                word = line.strip()
                
                # Generamos el hash de la palabra actual
                if hash_type == 'md5':
                    current_hash = hashlib.md5(word.encode()).hexdigest()
                elif hash_type == 'sha256':
                    current_hash = hashlib.sha256(word.encode()).hexdigest()
                else:
                    print(f"Error: Tipo de hash '{hash_type}' no soportado.")
                    return None

                # Comparamos
                if current_hash == target_hash:
                    return word
        return None
    except Exception as e:
        print(f"Ocurrió un error: {e}")
        return None

if __name__ == "__main__":
    print("-" * 50)
    print("HASH CRACKER SIMPLE")
    print("-" * 50)

    t_hash = input("Introduce el hash objetivo: ").strip()
    w_list = input("Ruta al diccionario (wordlist): ").strip()
    h_type = input("Tipo de hash (md5/sha256) [defecto md5]: ").strip().lower() or 'md5'

    print(f"\nIniciando ataque de diccionario sobre {t_hash}...")
    
    result = crack_hash(t_hash, w_list, h_type)

    if result:
        print(f"\n[+] ÉXITO: Contraseña encontrada: {result}")
    else:
        print("\n[-] No se pudo encontrar la contraseña en el diccionario proporcionado.")
