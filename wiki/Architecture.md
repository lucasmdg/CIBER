# Arquitectura

## Estructura del Repositorio

```
CIBER/
├── ciberseguridad/                  # Proyectos Python
│   ├── nivel_basico/                # 10 proyectos fundamentales
│   │   ├── 01_password_locker/
│   │   ├── 02_port_scanner/
│   │   └── ... (hasta 10)
│   ├── nivel_intermedio/            # 10 proyectos automatización
│   │   ├── 01_password_locker_mejorado/
│   │   ├── 02_multithreaded_port_scanner/
│   │   └── ... (hasta 10)
│   ├── nivel_avanzado/              # 10 proyectos Red/Blue Team
│   │   ├── 01_custom_c2_simulator/
│   │   ├── 02_mini_metasploit_like_tool/
│   │   └── ... (hasta 10)
│   ├── proyectos_futuros/           # 7 dashboards interactivos
│   ├── pruebas_claude/              # Tests internos
│   ├── run_tests.py                 # Suite de tests unificada
│   └── requirements.txt             # Dependencias Python
├── SentinelX/                       # SOC Dashboard (Next.js)
│   ├── src/                         # Código fuente React/TypeScript
│   ├── prisma/                      # Esquema de base de datos
│   └── package.json
├── sentinel-cli/                    # CLI de SentinelX
├── wiki/                            # Documentación GitHub Wiki
├── assets/                          # Imágenes y recursos
├── .github/                         # Templates y CI/CD
├── README.md
└── LICENSE
```

## Pipeline de Aprendizaje

```
┌────────────────────────────────────────────────────────────────┐
│                    RUTA DE APRENDIZAJE CIBER                    │
├────────────┬───────────────┬──────────────┬────────────────────┤
│  BÁSICO    │  INTERMEDIO   │  AVANZADO    │  PROYECTOS FUTUROS │
│  (Sem 1-4) │  (Sem 5-10)   │  (Sem 11-20) │  (Sem 21+)         │
├────────────┼───────────────┼──────────────┼────────────────────┤
│ Fernet     │ AES-256+PBKDF2│ AES-256-GCM  │ Dashboards HTML/JS │
│ TCP Socket │ Thread/Queue  │ C2 Framework │ SIEM tiempo real   │
│ Hashing    │ Scapy DPI     │ NIDS flujos  │ Análisis IA        │
│ Regex      │ ARP/MITM      │ Malware      │ Consola web        │
│ HTTP Audit │ SYN Flood IDS │ Priv Esc     │ Honeypots          │
└────────────┴───────────────┴──────────────┴────────────────────┘
```

## Organización por Proyecto

Cada proyecto sigue una estructura consistente:

```
proyecto/
├── script.py              # Código principal del proyecto
├── tests/                 # Tests unitarios (si aplica)
│   └── test_script.py
├── README.md              # Documentación del proyecto
└── assets/                # Recursos específicos (opcional)
```

## Flujo de Datos (Ejemplo: Password Locker)

```
┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────┐
│  Usuario  │───▶│  Python CLI  │───▶│  Fernet  │───▶│  JSON    │
│ (input)   │    │  (script)   │    │  (crypt) │    │  (store) │
└──────────┘    └──────────────┘    └──────────┘    └──────────┘
                      │                  │               │
                      ▼                  ▼               ▼
                 Menú interactivo   Clave derivada   vault.json
                 (agregar/ver)      (password→key)   (cifrado)
```

## Tecnologías por Nivel

| Nivel | Criptografía | Redes | Automatización |
|-------|-------------|-------|----------------|
| Básico | Fernet, SHA-256 | Sockets raw | Síncrono |
| Intermedio | AES-256-CBC, PBKDF2 | Scapy, HTTP | Threading |
| Avanzado | AES-256-GCM (AEAD) | C2, NIDS, DPI | Frameworks |
| SentinelX | NextAuth.js, HTTPS | API REST | Next.js + Prisma |

## Principios de Diseño

- **Cada proyecto es independiente** — no requiere otros proyectos para funcionar
- **Complejidad progresiva** — cada nivel introduce nuevos conceptos
- **Código comentado** — explicaciones en español para aprender
- **Tests automatizados** — verificación de funcionamiento correcto
- **Documentación completa** — cada proyecto tiene su página en la Wiki

## Ver También

- [Home](Home) — Lista completa de proyectos
- [Desarrollo](Development) — Contribuir al repositorio
- [Testing](Testing) — Tests y cobertura
