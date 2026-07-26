<div align="center">

# Lucas M.

**Desarrollador enfocado en plataformas de control local, ciberseguridad defensiva y automatización inteligente con IA.**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/lucasmdg)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lucasmdg)

</div>

---

## Sobre mí

Estoy construyendo herramientas y ecosistemas reales que devuelven el control de los sistemas y la privacidad a las manos del usuario. Mi enfoque mezcla **seguridad defensiva**, **IA 100% local (zero-cost)** y **control de infraestructura**, creando plataformas que no dependen de APIs externas, sino que exprimen el hardware local al máximo.

---

## Proyecto Insignia

### 🛡️ [SentinelX](https://github.com/lucasmdg/CIBER/tree/main/SentinelX) — Plataforma de Control Local & SOC Defensivo

SentinelX evolucionó de un dashboard de ciberseguridad a una **plataforma integral que orquesta el ordenador al completo**, inspirada en la interfaz clínica y densa de Bloomberg Terminal y CrowdStrike Falcon.

Construido con **Next.js 14 + TypeScript + Prisma + NextAuth**, incluye:

- **Sophia (IA Local)**: Asistente integrado con soporte de doble backend intercambiable (`Ollama` vía HTTP directo y `llama.cpp` vía proceso gestionado) para usar modelos como DeepSeek-R1 o Llama3 sin enviar datos a la nube. Incluye streaming SSE y gestión de descargas (pull) desde la propia UI.
- **Gestor MCP (Model Context Protocol)**: Registro local, auto-descubrimiento de herramientas y monitorización en vivo (ping JSON-RPC) de servidores MCP para extender las capacidades de la IA.
- **Centro de Control del Sistema**: Telemetría real (gracias a `systeminformation`) de CPU por núcleos, RAM, discos y temperatura cada 3 segundos, más un gestor de procesos activos con capacidad de terminación (kill) directa.
- **Panel de Uso y Rentabilidad**: Tracker de los tokens consumidos en local comparados con el coste equivalente si usaras proveedores cloud (GPT-4o, Claude), visualizando el ahorro real y la rentabilidad del hardware.
- **Puente IDE (Bridge)**: API expuesta que permite a editores como VS Code (vía Continue.dev) o OpenCode conectarse a Sophia y utilizar su backend unificado y sus capacidades MCP.
- **SOC Defensivo Original**: Módulos funcionales como el escáner de postura (UAC, Firewall), monitor de red en vivo, analizador estático de ficheros por entropía, e inteligencia contra la base de datos CISA KEV.

---

### 🔒 [CIBER](https://github.com/lucasmdg/CIBER) — Repositorio de desarrollo técnico

El repositorio paraguas que contiene SentinelX y todos mis experimentos en ciberseguridad, análisis forense, scripting defensivo, y documentación de arquitectura.

---

## Stack principal

| Área | Tecnologías |
|------|-------------|
| **Frontend & Backend** | Next.js 14 App Router, TypeScript, React, TailwindCSS, Node.js |
| **Bases de Datos** | Prisma ORM, SQLite (Turso-ready), PostgreSQL |
| **Inteligencia Artificial** | Ollama, llama.cpp, Vercel AI SDK, MCP (Model Context Protocol) |
| **Seguridad & OS** | `execa` (gestión de procesos hijos), `systeminformation` (telemetría profunda) |
| **Herramientas** | Vitest, Zod, Git, GitHub Actions |

---

<div align="center">
<sub>Este perfil se actualiza activamente. Mis proyectos contienen código y utilidades reales, no simples plantillas.</sub>
</div>
