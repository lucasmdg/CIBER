# Instalación

## Requisitos del Sistema

| Requisito | Mínimo | Recomendado |
|-----------|--------|-------------|
| Python | 3.10 | 3.12 |
| pip | 21.x | 24.x |
| Git | 2.30 | 2.43+ |
| RAM | 512 MB | 2 GB |
| Disco | 200 MB | 500 MB |

Soportado en **Windows**, **macOS** y **Linux**.

## Clonar el Repositorio

```bash
git clone https://github.com/lucasmdg/CIBER.git
cd CIBER
```

## Entorno Virtual (Recomendado)

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

## Instalar Dependencias

```bash
pip install -r ciberseguridad/requirements.txt
```

## Verificar Instalación

```bash
cd ciberseguridad
python run_tests.py
# Resultado esperado: 29/29 proyectos pasaron ✓
```

## SentinelX (SOC Dashboard)

```bash
cd SentinelX
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Luego abrir `http://localhost:3000` en el navegador.

## Notas por Plataforma

### Windows
- Los proyectos de red (Scapy) requieren ejecución como Administrador
- Se recomienda WSL2 para proyectos de network sniffing
- Git Bash funciona para scripts Bash

### Linux
- Scapy requiere `sudo` para captura de paquetes
- Instalar dependencias del sistema: `sudo apt-get install python3-tk` (para GUIs)

### macOS
- Scapy puede requerir `chmod` en la interfaz de red
- Usar `python3` en lugar de `python`

## Solución de Problemas

Ver la página de [Troubleshooting](Troubleshooting) para problemas comunes.

## Siguientes Pasos

- [Quick Start](Quick-Start) — Ejecuta tu primer proyecto
- [Arquitectura](Architecture) — Entiende la estructura del repositorio
