# Analizador de Cabeceras de Correo (.eml)

Este proyecto proporciona un analizador sintáctico y heurístico para ficheros de correo electrónico (`.eml`) capaz de identificar anomalías y posibles ataques de suplantación (email spoofing) a nivel básico.

## Funcionalidades

- **Detección de Discrepancias:** Compara las cabeceras `From` (remitente declarado), `Return-Path` (dirección de retorno de errores) y `Reply-To` para identificar si el correo real proviene de un servidor/dominio diferente.
- **Análisis de Autenticación:** Extrae el estado de comprobaciones de seguridad estándar como **SPF**, **DKIM** y **DMARC** a partir de las cabeceras `Authentication-Results`.
- **Ruta de Servidores (Hops):** Parsea las cabeceras `Received` para listar de forma estructurada los saltos de red e IPs por los que ha viajado el correo electrónico.
- **Score de Amenaza:** Genera una puntuación acumulativa de riesgo para indicar si el correo es sospechoso o malicioso.

## Ejecución del Código de Ejemplo

Puedes utilizar el script directamente en tu código para auditar archivos `.eml`:

```python
from src.analyzer import analyze_email_headers

# Cargar el archivo .eml como cadena de texto
with open("correo_sospechoso.eml", "r", encoding="utf-8") as f:
    contenido = f.read()

# Analizar
reporte = analyze_email_headers(contenido)

print("Detalles del correo:")
print(f"  De: {reporte['from']}")
print(f"  Subject: {reporte['subject']}")
print(f"  Nivel de riesgo: {reporte['threat_score']}/10")
print(f"  ¿Es sospechoso?: {'SÍ' if reporte['suspicious'] else 'NO'}")
print("  Anomalías:")
for anomalia in reporte['anomalies']:
    print(f"    - {anomalia}")
```

## Pruebas

Para ejecutar las pruebas asociadas al proyecto:

```bash
python -m pytest tests/
```
