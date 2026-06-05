# Advanced Password Manager

<span style="background-color: #2ea44f; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">Nivel Avanzado</span>

## 📝 Descripción
Gestor con AES-256-GCM, PBKDF2 600K iteraciones, generador criptográfico y auditoría de fortaleza.

## 🛠️ Arquitectura y Flujo de Datos
```mermaid
graph TD
    A[Contraseña Maestra] -->|PBKDF2 600k iteraciones| B[Clave Simétrica]
    C[Base de Datos de Contraseñas] -->|Cifrar con AES-GCM (Autenticado)| D[JSON + Nonce + Tag]
```

## 🧠 Explicación Técnica y Conceptos Clave
Esta versión avanzada implementa criptografía simétrica autenticada mediante AES en modo GCM (Galois/Counter Mode). Este modo no solo cifra los datos, sino que proporciona verificación de integridad y autenticidad (AEAD) impidiendo modificaciones silenciosas del archivo. Se configuran 600,000 iteraciones en PBKDF2 de acuerdo con los estándares actuales de OWASP.

## 💻 Código de Ejemplo o Estructura Lógica
```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

key = AESGCM.generate_key(bit_length=256)
aesgcm = AESGCM(key)
nonce = os.urandom(12)
data = b"Mis passwords confidenciales"
encrypted_data = aesgcm.encrypt(nonce, data, None)
```

## 🔗 Código Fuente y Acceso en GitHub
Puedes ver la implementación completa del código y probar este script directamente accediendo a su carpeta de proyecto:
[Ver código en GitHub](https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/03_advanced_password_manager)
