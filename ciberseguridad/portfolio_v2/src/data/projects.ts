export type ProjectLevel = 'basico' | 'intermedio' | 'avanzado' | 'futuro' | 'varios';

export interface Project {
  title: string;
  level: ProjectLevel;
  description: string;
  github: string;
  tags: string[];
}

export const projectsData: Project[] = [
  {
    "title": "Password Locker",
    "level": "basico",
    "description": "Almacén de contraseñas cifrado con Fernet. Permite guardar y recuperar credenciales de forma segura.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/01_password_locker",
    "tags": ["cryptography", "fernet", "CLI"]
  },
  {
    "title": "Port Scanner",
    "level": "basico",
    "description": "Escáner de puertos TCP que identifica servicios abiertos en un host objetivo usando sockets raw.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/02_port_scanner",
    "tags": ["socket", "TCP", "networking"]
  },
  {
    "title": "Hash Cracker",
    "level": "basico",
    "description": "Cracker de hashes MD5 y SHA-256 por diccionario. Demuestra por qué las contraseñas débiles son peligrosas.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/03_hash_cracker_simple",
    "tags": ["hashlib", "MD5", "SHA-256"]
  },
  {
    "title": "Log Analyzer",
    "level": "basico",
    "description": "Analizador de archivos de log que detecta patrones sospechosos como intentos de login fallidos.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/04_log_analyzer",
    "tags": ["regex", "parsing", "logs"]
  },
  {
    "title": "File Integrity Checker",
    "level": "basico",
    "description": "Verifica la integridad de archivos comparando hashes SHA-256 contra una línea base conocida.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/05_file_integrity_checker",
    "tags": ["hashing", "integridad", "forense"]
  },
  {
    "title": "Keylogger Demo",
    "level": "basico",
    "description": "Demostración educativa de captura de teclas. Muestra cómo funcionan los keyloggers por dentro.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/06_basic_keylogger_demo",
    "tags": ["pynput", "educativo", "demo"]
  },
  {
    "title": "Caesar Cipher Tool",
    "level": "basico",
    "description": "Implementación del cifrado César con cifrado, descifrado y fuerza bruta para romperlo.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/07_caesar_cipher_tool",
    "tags": ["criptografia", "clasica", "cesar"]
  },
  {
    "title": "Base64 Encoder/Decoder",
    "level": "basico",
    "description": "Herramienta para codificar y decodificar datos en Base64, formato usado en tokens JWT, emails y más.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/08_base64_encoder_decoder",
    "tags": ["base64", "encoding", "CLI"]
  },
  {
    "title": "Vulnerability Scanner",
    "level": "basico",
    "description": "Escáner básico de cabeceras HTTP de seguridad. Detecta configuraciones inseguras en servidores web.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/09_simple_vulnerability_scanner",
    "tags": ["HTTP", "headers", "requests"]
  },
  {
    "title": "Network Sniffer",
    "level": "basico",
    "description": "Capturador de paquetes de red básico con Scapy. Muestra tráfico en tiempo real a nivel de capa 3.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_basico/10_network_sniffer_basico",
    "tags": ["scapy", "sniffing", "packets"]
  },
  {
    "title": "Password Locker v2",
    "level": "intermedio",
    "description": "Versión mejorada con AES-256, PBKDF2, categorías y fechas de creación para cada entrada.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/01_password_locker_mejorado",
    "tags": ["AES", "PBKDF2", "vault"]
  },
  {
    "title": "Multithreaded Port Scanner",
    "level": "intermedio",
    "description": "Escáner de puertos con 100 hilos simultáneos. Escanea 65.535 puertos en segundos.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/02_multithreaded_port_scanner",
    "tags": ["threading", "queue", "concurrencia"]
  },
  {
    "title": "Directory Bruteforcer",
    "level": "intermedio",
    "description": "Descubrimiento de rutas ocultas en servidores web mediante fuerza bruta con diccionario.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/03_directory_bruteforcer",
    "tags": ["requests", "threading", "wordlist"]
  },
  {
    "title": "Web Login Bruteforce",
    "level": "intermedio",
    "description": "Crackeador de formularios de login web. Prueba combinaciones usuario/contraseña automáticamente.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/04_web_login_bruteforce",
    "tags": ["requests", "POST", "brute-force"]
  },
  {
    "title": "Packet Sniffer Avanzado",
    "level": "intermedio",
    "description": "Sniffer con filtrado por protocolo, detección de credenciales en texto plano y análisis de payloads.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/05_packet_sniffer_avanzado",
    "tags": ["scapy", "deep-inspection", "filtros"]
  },
  {
    "title": "ARP Spoofer Detector",
    "level": "intermedio",
    "description": "Monitoriza el tráfico ARP en tiempo real y detecta ataques de ARP Poisoning comparando MACs.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/06_arp_spoofer_detector",
    "tags": ["scapy", "ARP", "MITM"]
  },
  {
    "title": "Basic IDS System",
    "level": "intermedio",
    "description": "Sistema de Detección de Intrusiones que identifica port scans, SYN floods e ICMP floods en la red.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/07_basic_ids_system",
    "tags": ["IDS", "scapy", "deteccion"]
  },
  {
    "title": "Web Vulnerability Scanner",
    "level": "intermedio",
    "description": "Escáner automático de vulnerabilidades web: cabeceras, XSS reflejado y SQL Injection basado en errores.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/08_web_vulnerability_scanner",
    "tags": ["XSS", "SQLi", "headers"]
  },
  {
    "title": "SSH Bruteforce Tool",
    "level": "intermedio",
    "description": "Herramienta multihilo de fuerza bruta SSH con Paramiko. Prueba contraseñas de un diccionario contra servidores SSH.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/09_ssh_bruteforce_tool",
    "tags": ["paramiko", "SSH", "threading"]
  },
  {
    "title": "Log Monitoring System",
    "level": "intermedio",
    "description": "Sistema de monitorización de logs en tiempo real con reglas de detección, umbrales y ventanas temporales.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_intermedio/10_log_monitoring_system",
    "tags": ["regex", "SIEM", "alertas"]
  },
  {
    "title": "Custom C2 Simulator",
    "level": "avanzado",
    "description": "Simulador de servidor de Comando y Control con registro de agentes, encolado de tareas y exfiltración.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/01_custom_c2_simulator",
    "tags": ["C2", "agentes", "polling"]
  },
  {
    "title": "Mini Metasploit Framework",
    "level": "avanzado",
    "description": "Framework de explotación modular con consola interactiva, módulos de exploit configurables e historial.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/02_mini_metasploit_like_tool",
    "tags": ["exploits", "modular", "consola"]
  },
  {
    "title": "Advanced Password Manager",
    "level": "avanzado",
    "description": "Gestor con AES-256-GCM, PBKDF2 600K iteraciones, generador criptográfico y auditoría de fortaleza.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/03_advanced_password_manager",
    "tags": ["AES-256-GCM", "PBKDF2", "audit"]
  },
  {
    "title": "Network IDS (NIDS)",
    "level": "avanzado",
    "description": "IDS de red con análisis de flujos, Threat Intelligence, detección de exfiltración y reportes JSON.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/04_network_intrusion_detection_system",
    "tags": ["NIDS", "flows", "threat-intel"]
  },
  {
    "title": "Web Pentesting Framework",
    "level": "avanzado",
    "description": "Framework de pentesting web automatizado: reconocimiento, fingerprinting, escaneo SSL y reportes.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/05_web_app_pentesting_framework",
    "tags": ["pentest", "recon", "reporting"]
  },
  {
    "title": "Privilege Escalation Lab",
    "level": "avanzado",
    "description": "Laboratorio que audita SUID, permisos, cron jobs, kernel exploits y PATH hijacking en un sistema.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/06_privilege_escalation_lab",
    "tags": ["privesc", "SUID", "kernel"]
  },
  {
    "title": "Malware Analysis Lab",
    "level": "avanzado",
    "description": "Análisis estático: hashes, entropía de Shannon, extracción de strings y detección automática de IOCs.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/07_malware_analysis_lab",
    "tags": ["malware", "entropia", "IOCs"]
  },
  {
    "title": "Ransomware Simulator",
    "level": "avanzado",
    "description": "Simulador educativo del ciclo completo: cifrado AES-256, nota de rescate y recuperación en entorno seguro.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/08_ransomware_simulator_controlled",
    "tags": ["ransomware", "AES-256", "educativo"]
  },
  {
    "title": "Threat Hunting Lab",
    "level": "avanzado",
    "description": "Caza proactiva de amenazas: fuerza bruta, movimiento lateral, exfiltración y matching de IOCs.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/09_threat_hunting_lab",
    "tags": ["hunting", "correlacion", "IOCs"]
  },
  {
    "title": "Red Team Lab Simulation",
    "level": "avanzado",
    "description": "Ejercicio completo de Red Team: recon, escaneo, explotación, pivoting, exfiltración y reporte final.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/nivel_avanzado/10_red_team_lab_simulation",
    "tags": ["red-team", "pivoting", "6-fases"]
  },
  {
    "title": "Simulador APT",
    "level": "futuro",
    "description": "Agente de Amenaza Persistente Avanzada con evasión de sandbox, persistencia y comunicación C2 cifrada.",
    "github": "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/proyectos_futuros/01_simulador_apt",
    "tags": ["APT", "evasion", "persistencia"]
  },
  {
    "title": "Analizador Malware con IA",
    "level": "futuro",
    "description": "Clasificador de malware usando Machine Learning para detectar archivos maliciosos por comportamiento.",
    "github": "https://github.com/lucasmdg/CIBER",
    "tags": ["ML", "sklearn", "clasificacion"]
  },
  {
    "title": "Red Team Framework",
    "level": "futuro",
    "description": "Framework completo de Red Team con gestión de sesiones remotas, módulos de post-explotación y automatización.",
    "github": "https://github.com/lucasmdg/CIBER",
    "tags": ["framework", "C2", "post-exploit"]
  },
  {
    "title": "QuantumTrade AI",
    "level": "varios",
    "description": "Plataforma web de simulación de bot de trading algorítmico con IA. Dashboard en tiempo real, 16 estrategias, 40+ activos, análisis multi-agente, riesgo institucional. 100% paper trading.",
    "github": "https://github.com/lucasmdg/quantum-trade-ai",
    "tags": ["Next.js", "TypeScript", "Recharts", "Ollama", "Zustand"]
  }
];
