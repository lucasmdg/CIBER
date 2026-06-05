<div align="center">

![CIBER Portada](assets/portada.png)

# 🛡️ CIBER
### Repositorio de Ciberseguridad & Telecomunicaciones

[![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Proyectos](https://img.shields.io/badge/Proyectos-37-green?style=for-the-badge&logo=github)](https://github.com/lucasmdg/CIBER)
[![Wiki](https://img.shields.io/badge/Wiki-Completa-cyan?style=for-the-badge&logo=gitbook)](https://github.com/lucasmdg/CIBER/wiki)
[![Licencia](https://img.shields.io/badge/Uso-Educativo-orange?style=for-the-badge)](https://github.com/lucasmdg/CIBER)

*Una colección progresiva de herramientas y laboratorios de ciberseguridad, desde fundamentos hasta arquitecturas Red Team/Blue Team avanzadas con dashboards interactivos.*

</div>

---

## 🗺️ Estructura del Repositorio

```
CIBER/
├── 🟢 ciberseguridad/nivel_basico/        (10 proyectos fundamentales)
├── 🟡 ciberseguridad/nivel_intermedio/    (10 proyectos de automatización avanzada)
├── 🔴 ciberseguridad/nivel_avanzado/      (10 proyectos de operaciones ofensivas/defensivas)
└── 🚀 ciberseguridad/proyectos_futuros/   (7 dashboards interactivos con UI visual)
```

---

## 🟢 Nivel Básico — *Fundamentos de Ciberseguridad*

| # | Proyecto | Descripción | Stack |
|---|----------|-------------|-------|
| 01 | [Password Locker](ciberseguridad/nivel_basico/01_password_locker) | Almacén cifrado con Fernet | Python, Cryptography |
| 02 | [Port Scanner](ciberseguridad/nivel_basico/02_port_scanner) | Escáner TCP con sockets raw | Python, Socket |
| 03 | [Hash Cracker](ciberseguridad/nivel_basico/03_hash_cracker_simple) | Cracker por diccionario MD5/SHA-256 | Python, Hashlib |
| 04 | [Log Analyzer](ciberseguridad/nivel_basico/04_log_analyzer) | Análisis de logs con regex | Python, Re |
| 05 | [File Integrity Checker](ciberseguridad/nivel_basico/05_file_integrity_checker) | Control de integridad SHA-256 | Python, Hashlib |
| 06 | [Keylogger Demo](ciberseguridad/nivel_basico/06_basic_keylogger_demo) | Captura de teclado educativa | Python, Pynput |
| 07 | [Caesar Cipher](ciberseguridad/nivel_basico/07_caesar_cipher_tool) | Cifrado César + fuerza bruta | Python |
| 08 | [Base64 Tool](ciberseguridad/nivel_basico/08_base64_encoder_decoder) | Codificador/Decodificador Base64 | Python, Base64 |
| 09 | [Vulnerability Scanner](ciberseguridad/nivel_basico/09_simple_vulnerability_scanner) | Auditoría de cabeceras HTTP | Python, Requests |
| 10 | [Network Sniffer](ciberseguridad/nivel_basico/10_network_sniffer_basico) | Captura de paquetes con Scapy | Python, Scapy |

---

## 🟡 Nivel Intermedio — *Automatización y Detección*

| # | Proyecto | Descripción | Stack |
|---|----------|-------------|-------|
| 01 | [Password Locker v2](ciberseguridad/nivel_intermedio/01_password_locker_mejorado) | AES-256 + PBKDF2 | Python, Cryptography |
| 02 | [Multithreaded Port Scanner](ciberseguridad/nivel_intermedio/02_multithreaded_port_scanner) | 100 hilos, 65K puertos | Python, Threading |
| 03 | [Directory Bruteforcer](ciberseguridad/nivel_intermedio/03_directory_bruteforcer) | Descubrimiento de rutas web | Python, Requests |
| 04 | [Web Login Bruteforce](ciberseguridad/nivel_intermedio/04_web_login_bruteforce) | Fuerza bruta en formularios | Python, Requests |
| 05 | [Packet Sniffer Avanzado](ciberseguridad/nivel_intermedio/05_packet_sniffer_avanzado) | Inspección de payloads y credenciales | Python, Scapy |
| 06 | [ARP Spoofer Detector](ciberseguridad/nivel_intermedio/06_arp_spoofer_detector) | Detección de ataques MITM | Python, Scapy |
| 07 | [Basic IDS System](ciberseguridad/nivel_intermedio/07_basic_ids_system) | Detección de port scan y floods | Python, Scapy |
| 08 | [Web Vuln Scanner](ciberseguridad/nivel_intermedio/08_web_vulnerability_scanner) | XSS + SQLi automático | Python, Requests |
| 09 | [SSH Bruteforce](ciberseguridad/nivel_intermedio/09_ssh_bruteforce_tool) | Fuerza bruta multihilo SSH | Python, Paramiko |
| 10 | [Log Monitor System](ciberseguridad/nivel_intermedio/10_log_monitoring_system) | SIEM básico con alertas | Python, Re |

---

## 🔴 Nivel Avanzado — *Red Team / Blue Team Operations*

| # | Proyecto | Descripción | Stack |
|---|----------|-------------|-------|
| 01 | [Custom C2 Simulator](ciberseguridad/nivel_avanzado/01_custom_c2_simulator) | Servidor C2 con agentes y polling | Python, Flask |
| 02 | [Mini Metasploit](ciberseguridad/nivel_avanzado/02_mini_metasploit_like_tool) | Framework de exploits modular CLI | Python |
| 03 | [Advanced Password Manager](ciberseguridad/nivel_avanzado/03_advanced_password_manager) | AES-256-GCM + 600K PBKDF2 | Python, Cryptography |
| 04 | [Network IDS](ciberseguridad/nivel_avanzado/04_network_intrusion_detection_system) | NIDS con flujos y Threat Intel | Python, Scapy |
| 05 | [Web Pentesting Framework](ciberseguridad/nivel_avanzado/05_web_app_pentesting_framework) | Suite modular de auditoría web | Python, Requests |
| 06 | [Privilege Escalation Lab](ciberseguridad/nivel_avanzado/06_privilege_escalation_lab) | Auditoría SUID/cron/kernel | Python |
| 07 | [Malware Analysis Lab](ciberseguridad/nivel_avanzado/07_malware_analysis_lab) | Entropía Shannon + IOCs | Python |
| 08 | [Ransomware Simulator](ciberseguridad/nivel_avanzado/08_ransomware_simulator_controlled) | Cifrado AES-256 controlado | Python, Cryptography |
| 09 | [Threat Hunting Lab](ciberseguridad/nivel_avanzado/09_threat_hunting_lab) | Caza de IOCs con MITRE ATT&CK | Python |
| 10 | [Red Team Lab](ciberseguridad/nivel_avanzado/10_red_team_lab_simulation) | Ciclo completo de intrusión | Python |

---

## 🚀 Proyectos Futuros — *Dashboards Interactivos con UI Visual*

> Consolas web operativas que se abren directamente en el navegador + scripts de backend funcionales en Python.

| # | Proyecto | Dashboard | Backend Python |
|---|----------|-----------|----------------|
| 01 | [Simulador APT](ciberseguridad/proyectos_futuros/01_simulador_apt) | Consola C2 con agentes, terminal y logs | `apt_agent.py` |
| 02 | [Analizador Malware IA](ciberseguridad/proyectos_futuros/02_analizador_malware_ia) | Gauge de amenaza, entropía, tabla APIs | `malware_analyzer.py` |
| 03 | [Red Team Framework](ciberseguridad/proyectos_futuros/03_red_team_framework) | Consola exploits estilo Metasploit | `nexus_framework.py` |
| 04 | [SIEM Dashboard](ciberseguridad/proyectos_futuros/04_siem_dashboard) | Monitor de logs en tiempo real + alertas | `siem_collector.py` |
| 05 | [Honeypots Interactivos](ciberseguridad/proyectos_futuros/05_honeypots_interactivos) | Mapa de ataques live + capturas | `honeypot_runner.py` |
| 06 | [Phishing Manager](ciberseguridad/proyectos_futuros/06_phishing_manager) | Gestor de campañas con plantillas | `phishing_simulator.py` |
| 07 | [Mapeador Superficie Ataque](ciberseguridad/proyectos_futuros/07_mapeador_superficie_ataque) | Topología de red con sonar recon | `surface_mapper.py` |

---

## 📖 Documentación Completa

Para explicaciones detalladas de cada proyecto con **diagramas de arquitectura**, fragmentos de código y guías paso a paso, consulta la [**📚 Wiki del Repositorio**](https://github.com/lucasmdg/CIBER/wiki).

---

<div align="center">

> ⚠️ **Aviso de uso ético**: Todo el contenido de este repositorio tiene exclusivamente propósitos **educativos y de investigación**. Úsalos únicamente en entornos controlados y con autorización explícita.

*By Lucas Méndez Díez — Telecom & Cybersecurity Engineer*

</div>
