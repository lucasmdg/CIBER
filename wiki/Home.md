# 🛡️ CIBER — Wiki de Ciberseguridad

Bienvenido a la documentación técnica completa del repositorio **CIBER**. Esta Wiki contiene explicaciones detalladas, diagramas de arquitectura, guías de uso y fundamentos teóricos de cada herramienta desarrollada.

---

## 👤 Sobre el Autor

**Lucas Méndez Díez** es un Ingeniero de Telecomunicaciones y Ciberseguridad especializado en FP Superior de Sistemas de Telecomunicaciones e Informáticos (STI). Apasionado por la seguridad ofensiva y defensiva, desarrolla herramientas de seguridad en Python para aprender haciendo.

**Stack técnico principal:**
- 🐍 **Python** — scripting de seguridad, automatización, análisis
- ☕ **Java / C/C++** — desarrollo de bajo nivel y sistemas embebidos
- 🌐 **Redes** — TCP/IP, VLAN, VPN, fibra óptica, sistemas críticos
- 🛡️ **Seguridad** — Red Team, Blue Team, Pentesting, OSINT, forense digital

---

## 🗺️ Ruta de Aprendizaje Recomendada

Este repositorio está diseñado para seguirse de forma progresiva. Cada nivel amplía los conceptos del anterior:

```
┌─────────────────────────────────────────────────────────────┐
│                    RUTA DE APRENDIZAJE                      │
├─────────────────┬───────────────────┬───────────────────────┤
│   🟢 BÁSICO     │  🟡 INTERMEDIO    │    🔴 AVANZADO        │
│   (Semanas 1-4) │  (Semanas 5-10)   │    (Semanas 11-20)    │
├─────────────────┼───────────────────┼───────────────────────┤
│ • Cifrado Fernet│ • AES-256 + PBKDF2│ • AES-256-GCM (AEAD)  │
│ • Sockets TCP   │ • Threading/Queue │ • Frameworks C2       │
│ • MD5 / SHA-256 │ • Scapy avanzado  │ • NIDS con flujos     │
│ • Regex básico  │ • ARP / MITM      │ • Malware estático    │
│ • HTTP headers  │ • SYN Flood IDS   │ • Privilege escalation│
└─────────────────┴───────────────────┴───────────────────────┘
```

---

## 📋 Índice Completo de Proyectos

### 🟢 Nivel Básico

| Proyecto | Concepto Central | Dificultad |
|----------|-----------------|------------|
| [[Password Locker\|Password-Locker]] | Criptografía simétrica Fernet | ⭐ |
| [[Port Scanner\|Port-Scanner]] | Sockets TCP raw | ⭐ |
| [[Hash Cracker\|Hash-Cracker]] | Ataques de diccionario offline | ⭐ |
| [[Log Analyzer\|Log-Analyzer]] | Regex y análisis forense de logs | ⭐⭐ |
| [[File Integrity Checker\|File-Integrity-Checker]] | FIM con hashing SHA-256 | ⭐ |
| [[Keylogger Demo\|Keylogger-Demo]] | Hooks del sistema operativo | ⭐⭐ |
| [[Caesar Cipher Tool\|Caesar-Cipher-Tool]] | Criptografía clásica | ⭐ |
| [[Base64 Encoder/Decoder\|Base64-Encoder-Decoder]] | Esquemas de codificación | ⭐ |
| [[Vulnerability Scanner\|Vulnerability-Scanner]] | Auditoría HTTP básica | ⭐⭐ |
| [[Network Sniffer\|Network-Sniffer]] | Captura de paquetes con Scapy | ⭐⭐ |

### 🟡 Nivel Intermedio

| Proyecto | Concepto Central | Dificultad |
|----------|-----------------|------------|
| [[Password Locker v2\|Password-Locker-v2]] | AES-256 con derivación de clave | ⭐⭐⭐ |
| [[Multithreaded Port Scanner\|Multithreaded-Port-Scanner]] | Concurrencia y threading | ⭐⭐ |
| [[Directory Bruteforcer\|Directory-Bruteforcer]] | Reconocimiento web automático | ⭐⭐ |
| [[Web Login Bruteforce\|Web-Login-Bruteforce]] | Automatización de formularios | ⭐⭐ |
| [[Packet Sniffer Avanzado\|Packet-Sniffer-Avanzado]] | Inspección profunda de paquetes | ⭐⭐⭐ |
| [[ARP Spoofer Detector\|ARP-Spoofer-Detector]] | Detección de ataques ARP | ⭐⭐⭐ |
| [[Basic IDS System\|Basic-IDS-System]] | Sistemas de detección de intrusos | ⭐⭐⭐ |
| [[Web Vulnerability Scanner\|Web-Vulnerability-Scanner]] | XSS y SQL Injection | ⭐⭐⭐ |
| [[SSH Bruteforce Tool\|SSH-Bruteforce-Tool]] | Protocolo SSH y Paramiko | ⭐⭐ |
| [[Log Monitoring System\|Log-Monitoring-System]] | SIEM básico y correlación | ⭐⭐⭐ |

### 🔴 Nivel Avanzado

| Proyecto | Concepto Central | Dificultad |
|----------|-----------------|------------|
| [[Custom C2 Simulator\|Custom-C2-Simulator]] | Infraestructura de comando y control | ⭐⭐⭐⭐ |
| [[Mini Metasploit Framework\|Mini-Metasploit-Framework]] | Frameworks de explotación modulares | ⭐⭐⭐⭐ |
| [[Advanced Password Manager\|Advanced-Password-Manager]] | Criptografía autenticada AES-GCM | ⭐⭐⭐⭐ |
| [[Network IDS (NIDS)\|Network-IDS-NIDS]] | Detección avanzada con Threat Intel | ⭐⭐⭐⭐ |
| [[Web Pentesting Framework\|Web-Pentesting-Framework]] | Suite completa de auditoría web | ⭐⭐⭐⭐ |
| [[Privilege Escalation Lab\|Privilege-Escalation-Lab]] | Técnicas de escalada en Linux | ⭐⭐⭐⭐ |
| [[Malware Analysis Lab\|Malware-Analysis-Lab]] | Análisis estático de binarios | ⭐⭐⭐⭐ |
| [[Ransomware Simulator\|Ransomware-Simulator]] | Cifrado masivo de archivos | ⭐⭐⭐⭐ |
| [[Threat Hunting Lab\|Threat-Hunting-Lab]] | Caza proactiva con MITRE ATT&CK | ⭐⭐⭐⭐⭐ |
| [[Red Team Lab Simulation\|Red-Team-Lab-Simulation]] | Ciclo completo de intrusión | ⭐⭐⭐⭐⭐ |

---

## 🔑 Conceptos Fundamentales de Ciberseguridad

Antes de sumergirte en los proyectos, aquí hay una guía rápida de los conceptos más importantes que aparecen en este repositorio:

### 🔐 Criptografía

| Concepto | Qué es | Cuándo se usa |
|----------|--------|---------------|
| **Fernet** | Cifrado simétrico AES-128 CBC + HMAC-SHA256 | Proyectos básicos de password managers |
| **AES-256** | Estándar de cifrado avanzado con clave 256 bits | Password managers intermedios/avanzados |
| **AES-256-GCM** | AES con autenticación integrada (AEAD) | Máxima seguridad, producción real |
| **PBKDF2** | Derivación de clave a partir de contraseña | Convertir contraseñas en claves criptográficas |
| **SHA-256** | Función hash criptográfica de 256 bits | Verificar integridad, almacenar contraseñas |
| **Base64** | Codificación binario→texto ASCII | Transmisión de datos en HTTP, JWT |

**¿Por qué es importante PBKDF2?**
```python
# SIN PBKDF2 — Peligroso para producción:
key = hashlib.sha256(password.encode()).digest()  # Demasiado rápido, vulnerable a GPU

# CON PBKDF2 — Seguro:
kdf = PBKDF2HMAC(algorithm=SHA256(), length=32, salt=salt, iterations=600_000)
key = kdf.derive(password.encode())  # Tarda ~1 segundo, inviable para fuerza bruta
```

### 🌐 Redes y Protocolos

| Protocolo | Puerto | Uso en este repo |
|-----------|--------|-----------------|
| **TCP** | Varía | Port Scanner, Sniffer |
| **SSH** | 22 | SSH Bruteforce, Honeypot |
| **HTTP/S** | 80/443 | Web scanners, Phishing |
| **ARP** | L2 | ARP Spoofing Detector |
| **DNS** | 53 | Surface Mapper |
| **MySQL** | 3306 | Honeypot DB |

**¿Cómo funciona el escaneo de puertos?**
```
┌─────────┐   SYN    ┌──────────┐
│ Scanner │ ──────►  │  Puerto  │
│         │   SYN-ACK│  Abierto │ ◄── Puerto ABIERTO
│         │ ◄──────  │          │
└─────────┘          └──────────┘

┌─────────┐   SYN    ┌──────────┐
│ Scanner │ ──────►  │  Puerto  │
│         │    RST   │  Cerrado │ ◄── Puerto CERRADO
│         │ ◄──────  │          │
└─────────┘          └──────────┘
```

### 🦠 Conceptos de Malware

| Término | Definición |
|---------|-----------|
| **C2 (Command & Control)** | Servidor que controla agentes instalados en máquinas comprometidas |
| **Beacon/Polling** | El agente llama periódicamente al C2 para recibir órdenes |
| **Exfiltración** | Robo y transmisión de datos sensibles fuera de la organización |
| **Persistencia** | Técnicas para sobrevivir a reinicios del sistema |
| **IOC** | Indicador de Compromiso — IP, hash, URL asociada a malware conocido |
| **Entropía Shannon** | Medida de aleatoriedad de datos. Alta entropía → posible cifrado/empaquetado |
| **SUID** | Bit de Unix que permite ejecutar un archivo con privilegios del propietario |

---

## 🛠️ Prerrequisitos Técnicos

Para ejecutar los proyectos de este repositorio necesitas:

```bash
# Sistema operativo:
# ✓ Linux (recomendado para proyectos de red)
# ✓ Windows con WSL2
# ✓ macOS

# Python 3.10 o superior:
python --version  # Debe mostrar 3.10+

# Dependencias principales:
pip install cryptography    # Criptografía (Fernet, AES, PBKDF2)
pip install scapy           # Captura y análisis de paquetes
pip install requests        # Peticiones HTTP
pip install paramiko        # Cliente SSH en Python
pip install flask           # Servidor web para C2

# Para proyectos de red (Scapy requiere privilegios):
sudo python tu_script.py    # En Linux/Mac
# En Windows: ejecutar como Administrador
```

---

## ⚖️ Marco Ético y Legal

> **IMPORTANTE**: El conocimiento de ciberseguridad es una herramienta. Como toda herramienta, puede usarse de forma responsable o irresponsable.

**✅ Usos PERMITIDOS:**
- Auditar tus propios sistemas y redes
- Entornos de laboratorio controlados (máquinas virtuales, redes aisladas)
- CTF (Capture The Flag) y plataformas de práctica como HackTheBox, TryHackMe
- Con autorización escrita explícita del propietario del sistema

**❌ Usos PROHIBIDOS:**
- Atacar sistemas sin autorización expresa — **es delito en España (Art. 264 CP)**
- Interceptar tráfico de redes ajenas
- Exfiltrar datos de terceros
- Cualquier uso malicioso o con ánimo de perjudicar

---

*Esta wiki es mantenida activamente. Para sugerencias o correcciones, abre un Issue en el repositorio principal.*
