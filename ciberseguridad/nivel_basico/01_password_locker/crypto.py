from cryptography.fernet import Fernet
import os

KEY_FILE = "secret.key"

def generate_key():
    """Generates a key and saves it into a file"""
    key = Fernet.generate_key()
    with open(KEY_FILE, "wb") as key_file:
        key_file.write(key)
    return key

def load_key():
    """Loads the key from the current directory named `secret.key`"""
    if not os.path.exists(KEY_FILE):
        return None
    return open(KEY_FILE, "rb").read()

def encrypt_message(message, key):
    """Encrypts a message using the provided key"""
    f = Fernet(key)
    return f.encrypt(message.encode()).decode()

def decrypt_message(encrypted_message, key):
    """Decrypts an encrypted message using the provided key"""
    f = Fernet(key)
    return f.decrypt(encrypted_message.encode()).decode()
