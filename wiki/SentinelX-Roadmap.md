# 🗺️ Roadmap Técnico y Mejoras Futuras

Esta página define las prioridades de desarrollo proyectadas para ampliar el alcance técnico y la fidelidad defensiva de **SentinelX**.

---

## 🎯 Prioridad 1: Integración con SIEM Real (API REST)
- **Objetivo**: Permitir que el dashboard reciba logs de auditoría reales en lugar de autogenerar telemetría local de hardware.
- **Implementación**:
  - Exponer un webhook de API seguro (`POST /api/collector`) validado mediante una API Key única.
  - Diseñar un agente recolector liviano en Python o Go para correr en hosts cliente y enviar logs en formato syslog/JSON.

## 🎯 Prioridad 2: Implementación de Escaneo de Puertos Distribuido
- **Objetivo**: Ampliar el Scanner para buscar puertos abiertos en otros activos del inventario de forma defensiva y asíncrona.
- **Implementación**:
  - Utilizar sockets crudos en Node.js para lanzar un escaneo TCP de tipo "SYN" limitado solo a los activos registrados y verificados en la tabla `Asset` (mitigando abusos o escaneos a terceros).

## 🎯 Prioridad 3: Generación de Playbooks de Respuesta (SOAR)
- **Objetivo**: Integrar playbooks de remediación interactivos asociados a las alertas críticas del dashboard.
- **Implementación**:
  - Vincular cada incidente (ej. "Suspected credential abuse") con una serie de pasos automatizables mediante llamadas a APIs externas (ej. llamada a AWS IAM para desactivar claves, bloquear un puerto en el firewall a través de un webhook, etc.).

## 🎯 Prioridad 4: Certificaciones y Cumplimiento de Postura Completo
- **Objetivo**: Mapear los checks de cumplimiento de postura local no solo a recomendaciones generales, sino a normativas internacionales estrictas.
- **Implementación**:
  - Enlazar los resultados del Posture Scanner con controles específicos de las normas **ISO 27001**, **NIST CSF** y **CIS Controls v8**.
