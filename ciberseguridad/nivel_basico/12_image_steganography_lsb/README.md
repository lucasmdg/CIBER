# Herramienta de Esteganografía en Imágenes (LSB)

Esta herramienta permite ocultar y extraer mensajes de texto en imágenes en formato PNG utilizando la técnica LSB (Least Significant Bit - Bit Menos Significativo).

## ¿Cómo funciona LSB?

Una imagen en color está compuesta por píxeles, y cada píxel por tres componentes cromáticos: Rojo (R), Verde (G) y Azul (B). Cada canal suele ocupar 8 bits (valores de 0 a 255). 

La esteganografía LSB reemplaza el bit de menor peso de estos valores cromáticos con los bits del mensaje secreto. Al alterar únicamente el bit menos significativo, el cambio en el color del píxel es prácticamente imperceptible para el ojo humano, permitiendo ocultar información sin alterar visiblemente la imagen.

## Requisitos

- `Pillow` (instalada por defecto en este entorno)

## Ejecución del Código de Ejemplo

Puedes utilizar el script importando las funciones en tu código:

```python
from src.steg import hide_message, reveal_message

# Ocultar mensaje
hide_message("imagen_original.png", "Mi mensaje ultra secreto", "imagen_con_secreto.png")

# Revelar mensaje
mensaje_oculto = reveal_message("imagen_con_secreto.png")
print(f"Mensaje recuperado: {mensaje_oculto}")
```

## Pruebas

Para ejecutar las pruebas del proyecto:

```bash
python -m pytest tests/
```
