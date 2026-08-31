# Auditor de Fortaleza de Contraseñas y Generador Seguro

Este proyecto evalúa la robustez de las contraseñas calculando su entropía de Shannon, verificando la presencia de patrones de caracteres y cruzándolas con una base de datos local de contraseñas débiles comunes. También proporciona un generador criptográficamente seguro de contraseñas.

## Características

- **Cálculo de Entropía:** Determina los bits de entropía teóricos basados en el conjunto de caracteres utilizado.
- **Análisis de Diccionario:** Detección de contraseñas comúnmente filtradas o extremadamente fáciles de adivinar.
- **Generador Seguro:** Utiliza el módulo `secrets` de Python para garantizar aleatoriedad de grado criptográfico.

## Ejecución del Código de Ejemplo

Puedes importar las funciones y utilizarlas en tus scripts interactivos:

```python
from src.auditor import audit_password, generate_secure_password

# Auditar
resultado = audit_password("MiClaveSegura2026!")
print(resultado)

# Generar
nueva_clave = generate_secure_password(length=16)
print(f"Nueva clave segura: {nueva_clave}")
```

## Pruebas

Para ejecutar los tests de este proyecto, corre:

```bash
python -m pytest tests/
```
