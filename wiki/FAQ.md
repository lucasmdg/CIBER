# Preguntas Frecuentes

## General

### ¿Qué es CIBER?
Laboratorio de ciberseguridad con 37 proyectos Python prácticos, desde cifrado básico hasta simulación Red Team.

### ¿Es gratis?
Sí, completamente open source bajo licencia MIT.

### ¿Necesito conocimientos previos?
Python básico es suficiente. Los proyectos nivel básico enseñan desde cero.

## Instalación

### ¿Funciona en Windows?
Sí, pero los proyectos de red (Scapy) funcionan mejor en Linux o WSL2.

### ¿Cómo instalo las dependencias?
```bash
pip install -r ciberseguridad/requirements.txt
```

### ¿Por qué algunos tests fallan?
Posibles causas:
- Falta de permisos de administrador (proyectos de red)
- Puerto ocupado (port scanner)
- Falta de conexión a internet (vulnerability scanner)

## Proyectos

### ¿Cómo ejecuto un proyecto?
```bash
python ciberseguridad/nivel_basico/01_password_locker/password_locker.py
```

### ¿Cómo ejecuto los tests?
```bash
cd ciberseguridad && python run_tests.py
```

## Seguridad

### ¿Es legal?
Depende del uso. En sistemas propios o con autorización: sí. Sin permiso: delito.

### ¿Puedo usar el password manager para contraseñas reales?
Los proyectos son educativos. No recomendado para producción sin auditoría.

## Contribución

### ¿Cómo contribuyo?
Revisa [CONTRIBUTING.md](../CONTRIBUTING.md).

### ¿Puedo añadir mi propio proyecto?
Sí. Abre un PR siguiendo la guía de contribución.

## Ver También

- [Troubleshooting](Troubleshooting) — Solución de problemas comunes
- [Quick Start](Quick-Start) — Primeros pasos
