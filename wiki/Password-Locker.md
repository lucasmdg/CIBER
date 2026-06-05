# Password Locker

<span style="background-color: #2ea44f; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">Nivel Básico</span>

## 📝 Descripción
Almacén de contraseñas cifrado con Fernet. Permite guardar y recuperar credenciales de forma segura.

## 🛠️ Arquitectura y Flujo de Datos
```mermaid
graph TD
    A[Usuario] -->|Contraseña Maestra| B(Cifrado Fernet)
    B -->|Guardar/Recuperar| C[Archivo Local cifrado (vault.json)]
```

## 🧠 Explicación Técnica y Conceptos Clave
Este proyecto introduce los conceptos de criptografía simétrica mediante el uso de la biblioteca `cryptography` en Python y la especificación Fernet. Fernet garantiza que los datos cifrados no puedan leerse ni modificarse sin la clave. Utiliza AES en modo CBC con una clave de 128 bits y HMAC para autenticación con SHA-256.

## 💻 Código de Ejemplo o Estructura Lógica
```python
from cryptography.fernet import Fernet

# Generación de clave
key = Fernet.generate_key()
cipher = Fernet(key)

# Cifrado
encrypted = cipher.encrypt(b"MiPasswordSecreto")
print(encrypted)

# Descifrado
decrypted = cipher.decrypt(encrypted)
print(decrypted.decode())
```

## 🔗 Código Fuente y Acceso en GitHub
Puedes ver la implementación completa del código y probar este script directamente accediendo a su carpeta de proyecto:
[Ver código en GitHub](https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/01_password_locker)
