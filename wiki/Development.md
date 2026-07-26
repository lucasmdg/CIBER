# Desarrollo

Guía para contribuir al desarrollo del laboratorio CIBER.

## Entorno de Desarrollo

### Prerrequisitos

- Python 3.10+
- Git
- pip
- Editor de código (VS Code recomendado)

### Setup

```bash
git clone https://github.com/lucasmdg/CIBER.git
cd CIBER
python -m venv .venv
source .venv/bin/activate
pip install -r ciberseguridad/requirements.txt
pip install flake8 black pytest
```

## Estructura de un Proyecto Nuevo

```
ciberseguridad/nivel_xx/XX_nombre_proyecto/
├── proyecto.py              # Código principal
├── tests/
│   └── test_proyecto.py     # Tests
├── README.md                # Documentación
└── requirements.txt         # Dependencias adicionales (opcional)
```

## Convenciones de Código

### Python

- **PEP 8** — seguir las guías de estilo de Python
- **Type Hints** — todas las funciones deben tener tipos
- **Docstrings** — en español o inglés, explicando qué hace la función
- **Máximo 100 caracteres** por línea
- **snake_case** para variables y funciones
- **CLASE** en PascalCase

### Ejemplo

```python
import hashlib
from typing import Optional


def crack_hash(
    target_hash: str,
    wordlist_path: str,
    algorithm: str = "md5",
) -> Optional[str]:
    """Intenta romper un hash usando un diccionario.

    Args:
        target_hash: Hash objetivo a romper
        wordlist_path: Ruta al archivo de diccionario
        algorithm: Algoritmo de hash (md5, sha256)

    Returns:
        La contraseña encontrada o None
    """
    with open(wordlist_path, "r", encoding="utf-8") as f:
        for word in f:
            word = word.strip()
            if algorithm == "md5":
                computed = hashlib.md5(word.encode()).hexdigest()
            else:
                computed = hashlib.sha256(word.encode()).hexdigest()
            if computed == target_hash:
                return word
    return None
```

## Tests

- Usar `pytest` o `unittest`
- Los tests deben estar en `tests/test_proyecto.py`
- Ejecutar `python run_tests.py` antes de abrir un PR

## Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: añadir nuevo proyecto de esteganografía
fix: corregir error de cifrado en AES-256
docs: actualizar documentación de Password Locker
test: añadir tests para Port Scanner
refactor: mejorar rendimiento de Hash Cracker
```

## Pull Requests

1. Forkear el repositorio
2. Crear rama: `git checkout -b feat/nuevo-proyecto`
3. Hacer cambios
4. Verificar tests: `python run_tests.py`
5. Committear: `git commit -m 'feat: ...'`
6. Push: `git push origin feat/nuevo-proyecto`
7. Abrir PR usando la [plantilla](../.github/PULL_REQUEST_TEMPLATE.md)

## Documentación

- Cada proyecto debe tener su página en la Wiki
- Incluir diagrama de arquitectura (formato Mermaid)
- Explicar conceptos de seguridad relevantes
- Mantener el README.md actualizado

## Ver También

- [Testing](Testing) — Tests y cómo ejecutarlos
- [Contributing](Contributing) — Guía de contribución
- [FAQ](FAQ) — Preguntas frecuentes
