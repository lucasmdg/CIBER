# Limpiador de Metadatos EXIF de Imágenes

Este proyecto proporciona una herramienta simple y eficaz para eliminar metadatos de archivos de imágenes (como JPEG y PNG). 

## ¿Por qué limpiar los metadatos?

Cuando tomas una fotografía con una cámara digital o un smartphone, se incrustan metadatos denominados **EXIF** (Exchangeable Image File Format). Estos metadatos pueden incluir:

- La marca y modelo de la cámara/teléfono.
- La fecha y hora exacta de la captura.
- Coordenadas GPS exactas de dónde se tomó la foto (geolocalización).
- Ajustes técnicos de la cámara (exposición, flash, etc.).

Compartir imágenes con estos datos expone la privacidad del usuario. Esta herramienta ayuda a mitigar este riesgo eliminando por completo cualquier metadato sensible mediante la copia de los píxeles puros a una nueva imagen sin arrastrar la información EXIF.

## Requisitos

- `Pillow` (librería de manipulación de imágenes de Python)

## Ejecución del Código de Ejemplo

Puedes utilizar el script directamente en tu código Python:

```python
from src.stripper import strip_image_metadata, get_metadata_summary

# Ver metadatos actuales
metadatos = get_metadata_summary("mi_foto.jpg")
print("Metadatos detectados:", metadatos)

# Limpiar metadatos
strip_image_metadata("mi_foto.jpg", "mi_foto_limpia.jpg")
print("Foto limpiada correctamente.")
```

## Pruebas

Para ejecutar la batería de pruebas:

```bash
python -m pytest tests/
```
