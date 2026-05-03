import json
import os

VAULT_FILE = "vault.json"

def load_vault():
    """Loads the vault from the JSON file"""
    if not os.path.exists(VAULT_FILE):
        return {}
    try:
        with open(VAULT_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return {}

def save_vault(data):
    """Saves the vault data to the JSON file"""
    with open(VAULT_FILE, "w") as f:
        json.dump(data, f, indent=4)
