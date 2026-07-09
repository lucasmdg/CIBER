<div align="center">

# Lucas M.

**Desarrollador enfocado en ciberseguridad defensiva, desarrollo seguro de aplicaciones y administración de sistemas de infraestructura crítica.**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/lucasmdg)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lucasmdg)

</div>

---

## Sobre mí

Estoy construyendo experiencia real en la intersección entre desarrollo de software y seguridad defensiva. No aprendo seguridad de forma teórica — construyo herramientas, las rompo, las aseguro, y documento por qué cada decisión se tomó así.

Mi enfoque principal es **seguridad defensiva**: entender cómo funcionan las amenazas para poder detectarlas y mitigarlas, no reproducirlas. Eso implica code review con criterio de seguridad, análisis de configuración, monitorización de comportamiento de red, y construir sistemas que fallen de forma segura.

---

## Proyectos destacados

### 🛡️ [SentinelX](https://github.com/lucasmdg/CIBER/tree/main/SentinelX) — SOC Dashboard defensivo

Dashboard de centro de operaciones de seguridad (SOC) construido con **Next.js 14 + TypeScript + Prisma + NextAuth**.

No es un proyecto de demostración con datos falsos. Tiene lógica real:

- **Scanner de postura**: 6 checks defensivos sobre el host local (headers HTTP, telemetría de hardware, procesos sospechosos, auditoría de dependencias npm, exposición de `.env`). Todo en loopback, sin acceso externo. Cada check incluye evidencia y guía de remediación.
- **Analizador de archivos**: cálculo de entropía de Shannon para detectar archivos cifrados o empaquetados, detección de tipo por magic bytes (no por extensión), hashing SHA-256/MD5, búsqueda de patrones sospechosos (IPs, llamadas de red, APIs de shell).
- **Exportación de reportes con firma de integridad**: los JSON de escaneo incluyen un hash SHA-256 del contenido para verificar que no han sido manipulados post-generación.
- **IOC Reputation Checker**: buscador de IPs, dominios y hashes contra base de datos de reputación (modo demo funcional, arquitectura preparada para VirusTotal/AbuseIPDB en modo real).
- **Score Trend**: gráfico de evolución del score de postura en los últimos 7 días de escaneos.
- **21 tests unitarios** con Vitest cubriendo entropía, hashing, scoring y validación de datos. CI en GitHub Actions.

**Stack técnico:** Next.js 14 App Router · TypeScript estricto · Prisma (SQLite/PostgreSQL) · NextAuth · Recharts · systeminformation · Zod · Vitest

**Modelo de amenazas STRIDE** documentado en [`SECURITY.md`](https://github.com/lucasmdg/CIBER/blob/main/SentinelX/SECURITY.md).

---

### 🔒 [CIBER](https://github.com/lucasmdg/CIBER) — Repositorio de aprendizaje técnico en ciberseguridad

Repositorio de práctica y experimentación. Incluye ejercicios de análisis forense, scripting defensivo, y documentación de decisiones técnicas.

---

## Stack principal

| Área | Tecnologías |
|------|-------------|
| **Lenguajes** | TypeScript, Python, Bash |
| **Frontend** | Next.js, React, TailwindCSS |
| **Backend** | Node.js, Prisma, NextAuth |
| **Seguridad** | Análisis estático, headers HTTP, telemetría de red, STRIDE |
| **Infraestructura** | Docker, GitHub Actions, SQLite/PostgreSQL |
| **Herramientas** | Vitest, Zod, systeminformation |

---

## Áreas de interés

- Seguridad defensiva y análisis de postura
- Desarrollo seguro de aplicaciones (SAST, validación de inputs, gestión de secretos)
- Detección de anomalías en comportamiento de red y procesos
- Documentación técnica con criterio real (threat models, ADRs, trade-offs)

---

<div align="center">
<sub>Este perfil se actualiza activamente. Los proyectos tienen código funcional, no solo READMEs.</sub>
</div>
