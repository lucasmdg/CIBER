# Auditor de Permisos de Archivos y Carpetas Sospechosos

Este proyecto proporciona un script para escanear y auditar los permisos del sistema de archivos en busca de configuraciones inseguras que puedan comprometer la seguridad o facilitar la escalada de privilegios.

## ¿Qué analiza esta herramienta?

1. **Bits SUID y SGID:** Archivos ejecutables que corren con los privilegios del propietario o grupo del archivo, respectivamente. Su mal uso es uno de los vectores principales de escalada de privilegios locales en Linux.
2. **Directorios World-Writable:** Directorios donde cualquier usuario puede escribir. Si no tienen el "Sticky Bit" activo, cualquier usuario podría borrar o modificar archivos pertenecientes a otros.
3. **Archivos de Configuración Sensibles Expuestos:** Comprobación de archivos críticos (`.env`, llaves SSH `id_rsa`, `shadow`, etc.) con permisos de lectura para usuarios o grupos que no sean su propietario.

## Ejecución del Código de Ejemplo

Puedes utilizar el auditor en tus scripts:

```python
from src.auditor import audit_file_permissions, scan_directory

# Auditar un archivo específico
alertas = audit_file_permissions("/etc/shadow")
for alerta in alertas:
    print(f"[ALERTA] {alerta}")

# Escanear un directorio recursivamente
resultados = scan_directory("./mi_proyecto")
for ruta, problemas in resultados.items():
    print(f"Ruta: {ruta}")
    for p in problemas:
        print(f"  - {p}")
```

## Pruebas

Para ejecutar las pruebas:

```bash
python -m pytest tests/
```
