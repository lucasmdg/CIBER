# Security Policy

## Versiones Soportadas

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| 1.x     | :x:                |

## Reportar una Vulnerabilidad

Este repositorio contiene herramientas educativas de ciberseguridad. Si encuentras una vulnerabilidad de seguridad en el código:

1. **No abras un issue público**
2. Envía un email a **lucasmdz@protonmail.com**
3. Incluye:
   - Descripción clara de la vulnerabilidad
   - Pasos para reproducirla (PoC)
   - Archivos afectados
   - Impacto potencial

### Qué esperar

- **Acuse de recibo** en 48 horas
- **Actualización de estado** cada 5 días hábiles
- **Resolución** en un máximo de 14 días

### Uso Ético

Las herramientas en este repositorio son **exclusivamente educativas**. El uso malicioso de cualquier vulnerabilidad aquí descrita o implementada va en contra de los principios de este proyecto.

### Medidas de Seguridad

- Contraseñas almacenadas con PBKDF2 (600,000 iteraciones)
- Cifrado AES-256-GCM para datos sensibles (AEAD)
- No se incluyen credenciales reales en el código
- Scapy requiere permisos de administrador explícitos
- Las dependencias se auditan regularmente
