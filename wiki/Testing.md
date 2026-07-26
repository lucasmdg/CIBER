# Testing

## Estrategia de Tests

CIBER usa `pytest` y `unittest` para verificar el funcionamiento correcto de los proyectos.

## Ejecutar Tests

### Todos los proyectos

```bash
cd ciberseguridad
python run_tests.py
```

### Proyecto específico

```bash
cd ciberseguridad
python -m pytest nivel_basico/01_password_locker/tests/ -v
```

### Con cobertura

```bash
cd ciberseguridad
pip install pytest-cov
python -m pytest --cov=. --cov-report=html
```

## Proyectos con Tests

| # | Proyecto | Tests | Estado |
|---|----------|-------|--------|
| 01 | Password Locker | ✅ | Pasa |
| 02 | Port Scanner | ✅ | Pasa |
| 03 | Hash Cracker | ✅ | Pasa |
| 04 | Log Analyzer | ✅ | Pasa |
| 05 | File Integrity Checker | ✅ | Pasa |
| 06 | Keylogger Demo | ⚠️ | Requiere entorno gráfico |
| 07 | Caesar Cipher | ✅ | Pasa |
| 08 | Base64 Tool | ✅ | Pasa |
| 09 | Vulnerability Scanner | ✅ | Pasa |
| 10 | Network Sniffer | ✅ | Pasa |
| 11 | Password Locker v2 | ✅ | Pasa |
| 12 | Multithreaded Port Scanner | ⚠️ | Test de rendimiento |
| 13 | Directory Bruteforcer | ✅ | Pasa |
| 14 | Web Login Bruteforce | ✅ | Pasa |
| 15 | Packet Sniffer Avanzado | ⚠️ | Requiere scapy |
| 16 | ARP Spoofer Detector | ⚠️ | Requiere scapy + red |
| 17 | Basic IDS System | ⚠️ | Requiere scapy |
| 18 | Web Vuln Scanner | ✅ | Pasa |
| 19 | SSH Bruteforce | ✅ | Pasa |
| 20 | Log Monitor System | ✅ | Pasa |
| 21-30 | Nivel Avanzado | ✅ | Pasan |

## Escribir Tests

### Estructura

```python
# tests/test_proyecto.py
import pytest
from proyecto import funcion


class TestProyecto:
    def test_funcion_basica(self):
        resultado = funcion(entrada)
        assert resultado == esperado

    def test_caso_borde(self):
        with pytest.raises(ValueError):
            funcion(invalido)
```

### Buenas Prácticas

- Un test por funcionalidad
- Nombrar tests descriptivamente: `test_cifrado_con_clave_valida`
- Usar fixtures para datos repetitivos
- Mockear dependencias externas (red, archivos)
- Probar casos borde (vacíos, nulos, inválidos)

## Integración Continua

Los tests se ejecutan automáticamente en GitHub Actions para:

- Push a main
- Pull requests
- 3 versiones de Python (3.10, 3.11, 3.12)
- 2 sistemas operativos (Ubuntu, Windows)

Ver [ci.yml](../.github/workflows/ci.yml) para detalles.

## Ver También

- [Desarrollo](Development) — Setup de desarrollo
- [Contributing](Contributing) — Cómo contribuir
- [Troubleshooting](Troubleshooting) — Problemas comunes
