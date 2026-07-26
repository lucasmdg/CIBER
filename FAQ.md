# Preguntas Frecuentes

## General

### ¿Qué es CIBER?
Es un laboratorio de ciberseguridad con 37 proyectos prácticos en Python, organizados en 3 niveles de dificultad. Incluye herramientas de cifrado, análisis de red, detección de intrusiones, simulación Red Team y un dashboard SOC (SentinelX).

### ¿Es gratis?
Sí. Completamente open source bajo licencia MIT.

### ¿Puedo usar estas herramientas en producción?
No sin antes auditarlas. Son herramientas educativas. Úsalas solo en entornos controlados.

### ¿Necesito conocimientos previos?
Se recomienda Python básico. Los proyectos nivel básico empiezan desde cero.

## Instalación

### ¿Funciona en Windows?
Los proyectos de red (Scapy) funcionan mejor en Linux o WSL2. El resto funciona en cualquier SO.

### ¿Cómo instalo las dependencias?
```bash
pip install -r ciberseguridad/requirements.txt
```

### ¿Qué hago si un proyecto de red no funciona?
Ejecuta con permisos de administrador:
```bash
sudo python proyecto.py   # Linux/Mac
# Windows: Ejecutar como Administrador
```

## Proyectos

### ¿Por qué algunos proyectos tienen tests y otros no?
Los tests cubren los proyectos que tienen lógica comprobable. Proyectos de red (sniffers, C2) requieren entornos específicos.

### ¿Cómo ejecuto un proyecto específico?
```bash
python ciberseguridad/nivel_basico/01_password_locker/password_locker.py
```

### ¿Cómo ejecuto todos los tests?
```bash
cd ciberseguridad
python run_tests.py
```

## Seguridad

### ¿Es legal usar estas herramientas?
Depende del contexto. Usarlas en sistemas propios o con autorización es legal. Usarlas sin permiso es delito.

### ¿Las contraseñas están seguras en el password manager?
Los proyectos usan PBKDF2 con 600,000 iteraciones y AES-256-GCM. Es seguro para aprendizaje, pero audítalo antes de uso real.

### ¿Puedo contribuir con mi propio proyecto?
Sí. Revisa [CONTRIBUTING.md](CONTRIBUTING.md).

## SentinelX

### ¿Qué necesito para ejecutar SentinelX?
Node.js 18+, npm. Ver [README de SentinelX](SentinelX/README.md).

### ¿SentinelX es seguro para producción?
Usa NextAuth.js y Prisma. Requiere configuración adicional (HTTPS, variables de entorno) para producción.

## Otros

### ¿Cómo reporto un bug?
Abre un [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md).

### ¿Cómo sugiero un proyecto nuevo?
Abre un [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md).

### ¿Hay planes para una versión en inglés?
Sí, está en el roadmap.

### ¿Puedo traducir la documentación?
Por supuesto. Las contribuciones de traducción son bienvenidas.
