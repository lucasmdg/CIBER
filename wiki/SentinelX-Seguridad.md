# 🛡️ Medidas de Seguridad y Hardening

SentinelX no es solo un dashboard que muestra datos de seguridad; está construido de forma segura aplicando principios de **Secure Development Lifecycle (SDLC)**.

---

## 🔒 1. Control de Acceso Basado en Roles (RBAC)

Para evitar la escalada de privilegios y accesos inapropiados a las APIs, implementamos validación estricta de roles a nivel de endpoint:
- **Roles Definidos**: `viewer`, `analyst`, `engineer`, `admin`.
- **Estructura Lógica (`lib/rbac/roles.ts`)**:
  Declara una matriz de permisos explícitos:
  - `viewer`: Solo lectura básica (`assets:read`, `vulns:read`).
  - `analyst`: Lectura extendida + ejecución de escaneos (`posture:scan`, `audit:read`).
  - `engineer`: Remediación e inventario (`assets:write`, `vulns:write`).
  - `admin`: Control absoluto del sistema (`*`).

A nivel de API, cada controlador valida la sesión e invoca la utilidad de comprobación:
```typescript
const session = await getServerSession(authOptions);
if (!can(session?.user?.role, "assets:write")) {
  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}
```

---

## 📝 2. Logs de Auditoría Inmutables

Cada acción de modificación o escaneo en el SOC se registra de forma síncrona en la base de datos a través del servicio `audit` (`lib/audit/logger.ts`):
- **Campos registrados**: Actor (email del usuario), acción ejecutada (ej. `posture.scan`), target (ID del activo o archivo), IP de origen, User-Agent de la sesión y metadatos complementarios en formato JSON.
- **Visualización restringida**: Solo los usuarios con rol `admin` u `analyst` pueden acceder a estos logs a través del widget de actividad en tiempo real del dashboard.

---

## ⚡ 3. Rate-Limiting Defensivo

Para prevenir ataques de fuerza bruta y ataques automatizados de denegación de servicio a las APIs más costosas (como el escáner de postura o el analizador de archivos), se implementa un sistema de rate-limiting:
- **Controlador**: `lib/security/rate-limit.ts`.
- **Umbral**: Configurable mediante variables de entorno en el archivo `.env` (`RATE_LIMIT_WINDOW_MS` y `RATE_LIMIT_MAX`).
- **Comportamiento**: Al superar el límite, la API responde inmediatamente con un código `HTTP 429 Too Many Requests`.

---

## 🔍 4. Validación estricta y Sanitización de Datos

- **Protección contra Directory Traversal**: Al analizar o procesar archivos en el backend, los nombres de archivos se limpian para eliminar secuencias peligrosas tipo `../`.

---

## 🕵️ 5. Ejecución Segura y Análisis de Privilegios (Simulador de Postura)

### Diseño 100% Read-Only (Lectura)
El **Scanner de Postura** de SentinelX ha sido diseñado bajo el principio de **Mínimo Privilegio**. El escáner es **100% pasivo e instructivo**:
1. **Límites de Red**: Solo realiza solicitudes HTTP hacia interfaces locales (`localhost`, `127.0.0.1` o rangos RFC1918).
2. **Telemetría del Host**: Lee el estado de sockets abiertos, porcentaje de carga de CPU y memoria RAM. No altera la configuración de red, no cierra puertos ni modifica las directivas de seguridad locales del sistema.
3. **No-Offensive Policy**: No inyecta payloads, no realiza escaneos de vulnerabilidades activas ni ejecuta exploits.

### Análisis del Peor Caso: Privilegios Excesivos
Si SentinelX se ejecutara con privilegios del sistema excesivos (ej: como usuario `root` en Linux o `Administrator` en Windows):
- **Impacto Potencial**: Un fallo o inyección en el analizador de archivos o en los comandos de telemetría de `systeminformation` podría permitir a un atacante que comprometa el servidor web de Next.js ejecutar comandos con privilegios totales sobre la máquina host (Command Injection).
- **Medidas de Mitigación**:
  - **Ejecución sin Privilegios**: La aplicación web se ejecuta por defecto dentro de un contenedor Docker en modo de usuario no-root (`node`).
  - **Sanitización de Comandos**: Ninguna entrada del usuario (como el `target` URL del escáner) se interpola directamente en una shell de comandos (`exec`/`spawn`). El control de target se valida mediante expresiones regulares para verificar únicamente dominios válidos o IPs RFC1918 antes de cualquier resolución.
  - **Entorno Aislado**: El analizador estático opera exclusivamente en buffers binarios en memoria, asegurando que las muestras no se escriban en disco en formato ejecutable.

