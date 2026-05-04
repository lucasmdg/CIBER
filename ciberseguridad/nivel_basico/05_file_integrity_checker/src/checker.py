import hashlib
import json
import os
import sys

def calculate_hash(file_path):
    """
    Calcula el hash SHA-256 de un archivo.
    """
    sha256_hash = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            # Leemos en bloques para manejar archivos grandes
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except Exception as e:
        print(f"Error al calcular hash de {file_path}: {e}")
        return None

def create_baseline(directory, baseline_file):
    """
    Escanea el directorio y guarda los hashes en el baseline.
    """
    baseline = {}
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            file_hash = calculate_hash(file_path)
            if file_hash:
                # Usamos rutas relativas para portabilidad
                rel_path = os.path.relpath(file_path, directory)
                baseline[rel_path] = file_hash
    
    with open(baseline_file, 'w', encoding='utf-8') as f:
        json.dump(baseline, f, indent=4)
    print(f"[+] Baseline creado exitosamente en {baseline_file}")

def verify_integrity(directory, baseline_file):
    """
    Compara los archivos actuales con el baseline.
    """
    if not os.path.exists(baseline_file):
        print(f"Error: No se encontró el archivo baseline {baseline_file}")
        return

    with open(baseline_file, 'r', encoding='utf-8') as f:
        baseline = json.load(f)

    current_files = {}
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            file_hash = calculate_hash(file_path)
            if file_hash:
                rel_path = os.path.relpath(file_path, directory)
                current_files[rel_path] = file_hash

    print("-" * 50)
    print("REPORTE DE INTEGRIDAD")
    print("-" * 50)

    # Detectar cambios y eliminaciones
    for file, original_hash in baseline.items():
        if file not in current_files:
            print(f"[!] ELIMINADO: {file}")
        elif current_files[file] != original_hash:
            print(f"[!] MODIFICADO: {file}")
        else:
            # Archivo OK (opcional mostrar)
            pass

    # Detectar archivos nuevos
    for file in current_files:
        if file not in baseline:
            print(f"[+] NUEVO:     {file}")

    print("-" * 50)

if __name__ == "__main__":
    print("FILE INTEGRITY CHECKER")
    print("1. Crear Baseline")
    print("2. Verificar Integridad")
    choice = input("Selecciona una opción: ")
    
    target_dir = input("Introduce el directorio a monitorear: ").strip()
    b_file = "baseline.json"

    if choice == "1":
        create_baseline(target_dir, b_file)
    elif choice == "2":
        verify_integrity(target_dir, b_file)
    else:
        print("Opción no válida.")
