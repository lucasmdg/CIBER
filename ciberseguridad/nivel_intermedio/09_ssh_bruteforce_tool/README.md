# Herramienta de Fuerza Bruta SSH

## Descripcion
SSH (Secure Shell) es el protocolo mas utilizado para conectarse a servidores remotos de forma segura. Esta herramienta demuestra como un atacante puede intentar adivinar contrasenas probando miles de combinaciones de un diccionario.

La idea es sencilla pero poderosa: si tu contrasena es "admin123", el atacante solo necesita un diccionario que contenga esa palabra. Por eso, usar contrasenas fuertes o autenticacion por clave publica es tan critico.

## Como funciona
1. Se conecta al servidor SSH objetivo.
2. Lee un archivo de diccionario (una lista de posibles contrasenas).
3. Prueba cada contrasena una por una (o varias a la vez usando hilos).
4. Si alguna funciona, la muestra en pantalla y para.

## Tecnicas utilizadas
- **Multithreading**: Varios hilos prueban contrasenas en paralelo para ir mas rapido.
- **Paramiko**: Libreria de Python para conexiones SSH.
- **Cola (Queue)**: Estructura de datos para repartir el trabajo entre los hilos.

## Requisitos
- Python 3.x
- paramiko (`pip install paramiko`)

## Uso
```bash
python src/ssh_brute.py
```

## Aviso Legal
Esta herramienta es EXCLUSIVAMENTE para uso educativo y pruebas en laboratorios controlados. Atacar servidores SSH sin autorizacion es un delito grave.
