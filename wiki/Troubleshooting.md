# Troubleshooting

Solución a problemas comunes al usar CIBER.

## Instalación

### "pip: command not found"
```bash
python -m pip install -r requirements.txt
```

### "ModuleNotFoundError"
```bash
pip install -r ciberseguridad/requirements.txt
```

### Error de permisos en Linux/Mac
```bash
pip install --user -r ciberseguridad/requirements.txt
```

## Ejecución

### "Permission denied" en proyectos de red
```bash
# Linux/Mac:
sudo python proyecto.py

# Windows: Ejecutar como Administrador
```

### "Address already in use"
Otro programa está usando el puerto. Cambia el puerto en el código o cierra el otro programa.

### "No module named scapy"
```bash
pip install scapy
# En Linux puede requerir:
sudo apt-get install python3-scapy
```

## Tests

### Tests fallan en Windows
- Scapy requiere WinPcap o Npcap instalado
- Ejecutar terminal como Administrador
- Usar WSL2 para proyectos de red

### "pytest not found"
```bash
pip install pytest
```

## SentinelX

### Error de Prisma
```bash
cd SentinelX
npx prisma generate
npx prisma db push
```

### Error de NextAuth
```bash
# Configurar variables de entorno:
cp .env.example .env.local
# Editar .env.local con valores reales
```

### Puerto 3000 en uso
```bash
npx next dev -p 3001
```

## Generales

### El script se congela
- Port Scanner: reducir número de puertos
- SSH Bruteforce: reducir número de intentos
- Hash Cracker: usar diccionario más pequeño

### Caracteres extraños en consola
Windows: ejecutar `chcp 65001` para UTF-8

### El antivirus bloquea el script
Los proyectos de seguridad pueden activar falsos positivos. Añadir exclusión en el antivirus.

## Reportar un Problema

Si el problema persiste:
1. Busca en [issues existentes](https://github.com/lucasmdg/CIBER/issues)
2. Abre un nuevo [Bug Report](https://github.com/lucasmdg/CIBER/issues/new?template=bug_report.md)

## Ver También

- [FAQ](FAQ) — Preguntas frecuentes
- [Instalación](Installation) — Guía de instalación
- [Quick Start](Quick-Start) — Primeros pasos
