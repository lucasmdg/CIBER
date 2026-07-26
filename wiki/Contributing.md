# Contribuyendo

Gracias por tu interés en contribuir a CIBER.

## Cómo Contribuir

### 1. Reportar Bugs

Abre un [Bug Report](https://github.com/lucasmdg/CIBER/issues/new?template=bug_report.md) con:
- Pasos para reproducir
- Comportamiento esperado vs real
- Entorno (SO, Python, dependencias)
- Logs o screenshots

### 2. Sugerir Proyectos

Abre un [Feature Request](https://github.com/lucasmdg/CIBER/issues/new?template=feature_request.md) con:
- Descripción del proyecto
- Conceptos de seguridad que cubre
- Dependencias necesarias

### 3. Pull Requests

1. Haz fork del repositorio
2. Crea rama: `git checkout -b feat/nuevo-proyecto`
3. Commitea: `git commit -m 'feat: añadir proyecto X'`
4. Push: `git push origin feat/nuevo-proyecto`
5. Abre un PR

### 4. Documentación

- Mejorar páginas existentes de la Wiki
- Traducir documentación al inglés
- Corregir typos o errores

### 5. Tests

- Añadir tests para proyectos sin cobertura
- Mejorar tests existentes
- Automatizar pruebas manuales

## Guía de Estilo

### Python
- PEP 8, type hints, docstrings
- Máximo 100 caracteres
- snake_case para variables/funciones

### Commits
```
feat: nuevo proyecto de esteganografía
fix: corregir error en cifrado AES
docs: actualizar README
test: añadir tests para Port Scanner
```

## Proceso de Revisión

1. Un mantenedor revisará tu PR en 5 días hábiles
2. Puede solicitar cambios o aclaraciones
3. Una vez aprobado, se mergea a main
4. Tus cambios se incluirán en el próximo release

## Código de Conducta

Este proyecto sigue el [Código de Conducta](../CODE_OF_CONDUCT.md). Todos los participantes deben respetarlo.

## Ver También

- [Desarrollo](Development) — Setup de desarrollo
- [Testing](Testing) — Tests y cobertura
- [FAQ](FAQ) — Preguntas frecuentes
