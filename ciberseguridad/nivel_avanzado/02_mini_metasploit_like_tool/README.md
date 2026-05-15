# Mini Exploit Framework (estilo Metasploit)

## Descripcion
Este proyecto implementa un framework de explotacion modular inspirado en Metasploit. Tiene una arquitectura de modulos (exploits) que se pueden cargar, configurar y ejecutar desde una consola interactiva.

## Arquitectura
- **Exploit (clase base)**: Define la interfaz que todos los modulos deben seguir.
- **Modulos concretos**: FTPAnonExploit, HTTPHeaderExploit, SMBEnumExploit.
- **ExploitFramework**: El gestor central que organiza modulos, opciones e historial.
- **Consola interactiva**: Interfaz de texto al estilo `msf >`.

## Uso
```bash
python src/exploit_framework.py
```
