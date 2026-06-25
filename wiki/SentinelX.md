# 🛸 SentinelX – Portal de Documentación

Bienvenido a la Wiki técnica de **SentinelX**, un Security Operations Center (SOC) dashboard defensivo y educativo construido sobre **Next.js 14, TypeScript, TailwindCSS y Prisma**. 

Este proyecto fue diseñado con el objetivo de demostrar capacidades técnicas sólidas de desarrollo full‑stack bajo principios de **Security by Design** (Diseño Seguro), implementando telemetría en tiempo real sobre el sistema local, análisis estático de archivos, monitorización de red e integración con fuentes de inteligencia de amenazas.

---

## 🗺️ Índice de Contenidos

Para explorar la documentación a fondo, utiliza los siguientes enlaces:

1. **[[Home e Introducción|SentinelX]]** (Esta página)
2. **[[Arquitectura y Diseño de Datos|SentinelX-Arquitectura]]**: Flujos de datos, componentes clave y diseño de la base de datos local (SQLite) y remota (Turso).
3. **[[Guía de Instalación y Despliegue|SentinelX-Instalacion]]**: Instrucciones paso a paso para levantar el proyecto localmente con npm o Docker, y desplegar en Vercel.
4. **[[Módulos Funcionales en Detalle|SentinelX-Modulos]]**: Funcionamiento detallado del Dashboard, Scanner de Postura, Monitor de Red, Analizador de Archivos y Threat Intel.
5. **[[Controles de Seguridad y Hardening|SentinelX-Seguridad]]**: Implementación de RBAC, logs de auditoría, sanitización de entradas, rate-limiting y cabeceras de seguridad.
6. **[[Integración DevSecOps|SentinelX-DevSecOps]]**: Workflows de CI/CD en GitHub Actions, linters de seguridad, análisis SAST de vulnerabilidades y secretos.
7. **[[Roadmap Técnico|SentinelX-Roadmap]]**: Próximas mejoras prioritarias y ampliaciones lógicas del sistema.

---

## 🚦 Estado Actual del Proyecto (Transparencia de Portfolio)

Para fines de evaluación técnica, es importante detallar qué características son interactivas y consumen datos reales frente a simulaciones:

| Componente | Tipo de Datos | Descripción Técnica |
|------------|---------------|---------------------|
| **Dashboard Executive** | 🟢 Real (DB) | KPIs de score, alertas activas y conteos de CVEs calculados al vuelo mediante consultas directas a Prisma en el servidor. |
| **Monitoreo de Red** | 🟢 Real (Live) | Extrae interfaces, conexiones TCP/UDP activas y estadísticas de tráfico local al vuelo usando la librería `systeminformation`. |
| **Scanner de Postura** | 🟢 Real (Live) | Ejecuta escaneos reales y de solo lectura de configuración local del host y del servidor en puerto 3000 con efecto de terminal asíncrona. |
| **Analizador de Archivos** | 🟢 Real (Live) | Calcula hashes SHA-256/MD5, entropía de Shannon, extrae headers PE e identifica patrones sospechosos en archivos subidos. |
| **Threat Intel** | 🟡 Híbrido | Consume feeds públicos en tiempo real de **CISA KEV** y **MITRE ATT&CK** con caché local de 24 horas. Los actores de amenazas son sintéticos. |
| **Attack Paths** | 🔴 Simulado | Representación gráfica e interactiva de rutas lógicas mediante `React Flow` basadas en plantillas de tabletop exercises. |
| **Reports** | 🟢 Real | Generación y descarga directa en el navegador de reportes analíticos de seguridad consolidados en formato PDF (usando `jsPDF`). |
