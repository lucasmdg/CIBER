import sys
import crypto
import storage

def print_usage():
    print("Usage:")
    print("  python main.py init                     - Initialize the vault with a new key")
    print("  python main.py add <service> <password> - Add a new password")
    print("  python main.py get <service>            - Retrieve a password")
    print("  python main.py list                     - List all services")

def main():
    if len(sys.argv) < 2:
        print_usage()
        return

    command = sys.argv[1]

    if command == "init":
        key = crypto.generate_key()
        print(f"Vault initialized. Key saved to {crypto.KEY_FILE}")
        return

    key = crypto.load_key()
    if not key:
        print("Error: Vault not initialized. Run 'python main.py init' first.")
        return

    vault = storage.load_vault()

    if command == "add":
        if len(sys.argv) < 4:
            print("Usage: python main.py add <service> <password>")
            return
        service = sys.argv[2]
        password = sys.argv[3]
        encrypted_pw = crypto.encrypt_message(password, key)
        vault[service] = encrypted_pw
        storage.save_vault(vault)
        print(f"Password for '{service}' added successfully.")

    elif command == "get":
        if len(sys.argv) < 3:
            print("Usage: python main.py get <service>")
            return
        service = sys.argv[2]
        if service in vault:
            decrypted_pw = crypto.decrypt_message(vault[service], key)
            print(f"Password for '{service}': {decrypted_pw}")
        else:
            print(f"Error: Service '{service}' not found.")

    elif command == "list":
        if not vault:
            print("Vault is empty.")
        else:
            print("Stored services:")
            for service in vault:
                print(f" - {service}")

    else:
        print(f"Unknown command: {command}")
        print_usage()

if __name__ == "__main__":
    main()
