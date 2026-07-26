# Quick Start

Esta guía te lleva de cero a ejecutar tu primer proyecto de ciberseguridad en 5 minutos.

## Prerrequisitos

Asegúrate de haber [instalado CIBER](Installation) correctamente.

## Paso 1: Activar el Entorno Virtual

```bash
cd CIBER
# Linux/Mac:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate
```

## Paso 2: Ejecutar un Proyecto Nivel Básico

### Password Locker (Cifrado Fernet)

```bash
python ciberseguridad/nivel_basico/01_password_locker/password_locker.py
```

Este proyecto te permite almacenar y recuperar contraseñas usando cifrado simétrico Fernet.

### Port Scanner (Sockets TCP)

```bash
python ciberseguridad/nivel_basico/02_port_scanner/port_scanner.py
```

Escanea los puertos abiertos en una dirección IP.

### Hash Cracker (Ataque de Diccionario)

```bash
python ciberseguridad/nivel_basico/03_hash_cracker_simple/hash_cracker.py
```

Prueba a romper hashes MD5/SHA-256 usando un diccionario.

## Paso 3: Ejecutar los Tests

```bash
cd ciberseguridad
python run_tests.py
```

Si ves `29/29 proyectos pasaron ✓`, todo está funcionando correctamente.

## Paso 4: Explorar Proyectos Interactivos

```bash
# Abrir dashboard en el navegador:
start ciberseguridad/proyectos_futuros/01_simulador_apt/index.html

# Ejecutar analizador de malware:
python ciberseguridad/proyectos_futuros/02_analizador_malware_ia/malware_analyzer.py

# Lanzar el framework de explotación:
python ciberseguridad/proyectos_futuros/03_red_team_framework/nexus_framework.py
```

## ¿Qué Sigue?

Según tu nivel:

| Tu experiencia | Empieza aquí |
|---------------|--------------|
| Principiante en Python | Nivel Básico (proyectos 01-10) |
| Python básico + redes | Nivel Intermedio (proyectos 11-20) |
| Seguridad ofensiva/defensiva | Nivel Avanzado (proyectos 21-30) |
| Desarrollo web + seguridad | SentinelX SOC Dashboard |

## Referencia Rápida

```bash
# Todos los proyectos se ejecutan igual:
python ruta/al/proyecto/script.py

# Los proyectos de red requieren sudo (Linux/Mac):
sudo python ruta/al/proyecto/script.py

# Para ver la ayuda de un proyecto:
python ruta/al/proyecto/script.py --help
```

## Siguientes Pasos

- [Arquitectura](Architecture) — Cómo está organizado el repositorio
- [Guía de Proyectos](Home) — Lista completa de proyectos
