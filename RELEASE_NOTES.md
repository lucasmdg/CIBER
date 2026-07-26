# Release Notes

## v2.0.0 — Noviembre 2024

### Resumen

Lanzamiento importante del laboratorio CIBER con 37 proyectos completos de ciberseguridad, nueva documentación profesional e infraestructura CI/CD.

### Novedades

**37 Proyectos de Ciberseguridad**
- **10 Básicos**: Fundamentos de cifrado, redes y hacking
- **10 Intermedios**: Automatización, detección y herramientas multihilo
- **10 Avanzados**: Red Team, Blue Team, C2, NIDS, Threat Hunting
- **7 Proyectos Futuros**: Dashboards interactivos HTML/JS + Python

**SentinelX SOC Dashboard**
- Panel de control de seguridad construido con Next.js 14
- Prisma ORM con SQLite/PostgreSQL
- Autenticación segura con NextAuth.js
- Visualización de eventos de seguridad

**Documentación Profesional**
- README con 300+ líneas, badges, tablas de proyectos y arquitectura
- Wiki con 40+ páginas de documentación técnica
- 15 páginas wiki organizativas (Instalación, Quick Start, etc.)

**Infraestructura**
- GitHub Actions CI para Python y SentinelX
- Issue templates (Bug, Feature, Question)
- Pull request template con checklist
- Dependabot para dependencias Python y npm
- EditorConfig y Prettier config

### Cambios Importantes

- Estructura de repositorio reorganizada con niveles claros
- Nueva suite de tests unificada (run_tests.py)
- README completamente reescrito
- Licencia MIT añadida explícitamente

### Problemas Conocidos

- Proyectos de Scapy requieren permisos de administrador
- Algunos tests de red requieren entorno específico
- Windows: WSL2 recomendado para proyectos de red

### Descargas

```bash
git clone https://github.com/lucasmdg/CIBER.git
```

---

**Changelog completo**: [CHANGELOG.md](CHANGELOG.md)
