# Contribuyendo a CIBER

Gracias por tu interés en contribuir a este laboratorio de ciberseguridad.

## Código de Conducta

Este proyecto sigue el [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, esperamos que lo respetes.

## ¿Cómo Contribuir?

### Reportar Bugs

Abre un [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) incluyendo:
- Pasos para reproducir el error
- Comportamiento esperado vs real
- Entorno (SO, Python version, dependencias)
- Logs o screenshots

### Sugerir Proyectos

Abre un [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) con:
- Descripción del proyecto/herramienta
- Conceptos de ciberseguridad que cubre
- Dependencias necesarias

### Pull Requests

1. Haz fork del repositorio
2. Crea una rama: `git checkout -b feat/nuevo-proyecto`
3. Commitea: `git commit -m 'feat: añadir nuevo proyecto X'`
4. Push: `git push origin feat/nuevo-proyecto`
5. Abre un Pull Request

### Guía de Estilo

**Python**:
- Usar `snake_case` para variables y funciones
- Tipos documentados con type hints
- Docstrings en español o inglés
- Máximo 100 caracteres por línea
- Seguir PEP 8

**Commits**: Usar [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: añadir escáner de puertos multihilo
fix: corregir error en cifrado AES-256
docs: actualizar documentación de Password Locker
```

### Tests

- Todo proyecto nuevo debe incluir tests
- Ejecutar `python run_tests.py` antes de abrir un PR
- Mantener cobertura sobre 80%

### Documentación

- Cada proyecto debe tener su página en la Wiki
- Incluir diagrama de arquitectura (Mermaid)
- Explicar los conceptos de seguridad relevantes

## ¿Dudas?

Abre un [Discussion](https://github.com/lucasmdg/CIBER/discussions) o consulta la [FAQ](FAQ.md).
