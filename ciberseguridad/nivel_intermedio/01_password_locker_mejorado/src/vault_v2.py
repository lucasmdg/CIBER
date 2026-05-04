import os
import json
import base64
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from getpass import getpass
from datetime import datetime

class SecureVault:
    def __init__(self, filename="vault.json"):
        self.filename = filename
        self.salt_size = 16
        self.nonce_size = 12

    def _derive_key(self, master_password, salt):
        """
        Deriva una clave de 32 bytes usando PBKDF2.
        """
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        return kdf.derive(master_password.encode())

    def initialize(self, master_password):
        """
        Crea un nuevo almacén con un salt aleatorio.
        """
        salt = os.urandom(self.salt_size)
        initial_data = {"entries": []}
        self.save(master_password, initial_data, salt)
        print("[+] Almacén inicializado con éxito.")

    def save(self, master_password, data, salt=None):
        """
        Cifra y guarda los datos.
        """
        if salt is None:
            # Si no hay salt, intentamos leerlo del archivo existente
            with open(self.filename, 'r') as f:
                existing = json.load(f)
                salt = base64.b64decode(existing['salt'])

        key = self._derive_key(master_password, salt)
        aesgcm = AESGCM(key)
        nonce = os.urandom(self.nonce_size)
        
        # Ciframos el JSON
        plaintext = json.dumps(data).encode()
        ciphertext = aesgcm.encrypt(nonce, plaintext, None)

        # Estructura del archivo
        vault_structure = {
            "salt": base64.b64encode(salt).decode(),
            "nonce": base64.b64encode(nonce).decode(),
            "ciphertext": base64.b64encode(ciphertext).decode()
        }

        with open(self.filename, 'w') as f:
            json.dump(vault_structure, f)

    def load(self, master_password):
        """
        Carga y descifra los datos.
        """
        if not os.path.exists(self.filename):
            return None

        with open(self.filename, 'r') as f:
            vault_data = json.load(f)

        salt = base64.b64decode(vault_data['salt'])
        nonce = base64.b64decode(vault_data['nonce'])
        ciphertext = base64.b64decode(vault_data['ciphertext'])

        key = self._derive_key(master_password, salt)
        aesgcm = AESGCM(key)

        try:
            plaintext = aesgcm.decrypt(nonce, ciphertext, None)
            return json.loads(plaintext)
        except Exception:
            print("[!] Error: Contraseña maestra incorrecta o datos corruptos.")
            return None

def main_menu():
    vault = SecureVault()
    
    if not os.path.exists(vault.filename):
        print("--- INICIALIZACIÓN ---")
        pwd = getpass("Crea una contraseña maestra: ")
        vault.initialize(pwd)
    
    pwd = getpass("\nIntroduce tu contraseña maestra: ")
    data = vault.load(pwd)
    
    if data is None:
        return

    while True:
        print("\n--- VAULT V2 (INTERMEDIO) ---")
        print("1. Ver contraseñas")
        print("2. Añadir contraseña")
        print("3. Salir")
        choice = input("Selecciona: ")

        if choice == "1":
            if not data['entries']:
                print("El almacén está vacío.")
            for entry in data['entries']:
                print(f"[{entry['category']}] {entry['service']}: {entry['password']} (Creado: {entry['date']})")
        
        elif choice == "2":
            service = input("Servicio/Web: ")
            password = input("Contraseña: ")
            category = input("Categoría (Opcional): ") or "General"
            
            data['entries'].append({
                "service": service,
                "password": password,
                "category": category,
                "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            vault.save(pwd, data)
            print("[+] Guardado.")
            
        elif choice == "3":
            break

if __name__ == "__main__":
    main_menu()
