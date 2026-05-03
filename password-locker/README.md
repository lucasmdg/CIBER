# Password Locker

A simple and secure local password manager built with Python.

## Prerequisites

You need to have Python installed and the `cryptography` library:

```bash
pip install cryptography
```

## Setup

1. Clone or copy the folder.
2. Initialize the vault:
   ```bash
   python main.py init
   ```
   This will create a `secret.key` file. **Keep this file safe!** Without it, you cannot recover your passwords.

## Usage

### Adding a password
```bash
python main.py add my_email my_password123
```

### Retrieving a password
```bash
python main.py get my_email
```

### Listing all services
```bash
python main.py list
```

## Security Note

This tool stores your passwords in `vault.json` in an encrypted format using AES (Fernet). The security depends entirely on the secrecy of your `secret.key`.
