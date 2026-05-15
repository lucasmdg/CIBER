# Sistema de Monitorizacion de Logs en Tiempo Real

## Descripcion
Los logs son el "diario secreto" de cualquier sistema informatico. Cada vez que alguien se conecta, falla al meter su contrasena, o intenta acceder a algo raro, el sistema lo apunta en un archivo de log.

Este proyecto es un vigilante que lee esos logs en tiempo real y, usando reglas de deteccion, te avisa al instante si detecta algo sospechoso. Es la base de lo que en el mundo profesional se llama un SIEM (Security Information and Event Management).

## Que detecta
- **Intentos de login fallidos repetidos**: Alguien probando contrasenas (fuerza bruta).
- **Accesos root/administrador**: Uso de sudo o su que podria ser un escalado de privilegios.
- **Inyecciones SQL en logs web**: Patrones tipicos de ataques SQL Injection.
- **Escaneos de puertos**: Conexiones rechazadas masivas.
- **Accesos a rutas peligrosas**: Intentos de leer /etc/passwd, /etc/shadow, etc.

## Como funciona
1. Lee un archivo de log linea a linea.
2. Compara cada linea contra un conjunto de reglas (expresiones regulares).
3. Cada regla tiene un umbral (threshold) y una ventana de tiempo.
4. Si se supera el umbral en la ventana, genera una alerta.
5. Puede quedarse "escuchando" nuevas lineas (como `tail -f`).

## Requisitos
- Python 3.x (sin dependencias externas)

## Uso
```bash
# Analizar un archivo de log
python src/log_monitor.py --logfile /var/log/auth.log

# Solo analizar sin quedarse esperando
python src/log_monitor.py --logfile mi_log.txt --no-follow
```
