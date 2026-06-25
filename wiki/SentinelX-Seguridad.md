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

- **Zod Validation Schema (`lib/security/validation.ts`)**: Todas las cargas útiles de las APIs (JSON) se validan estrictamente mediante esquemas Zod antes de procesarse, garantizando tipado correcto y descartando campos no deseados.
- **Sanitización de Cadenas**: Se aplican filtros de limpieza a los campos textuales para evadir inyecciones de código HTML/JavaScript (mitigación activa de cross-site scripting o XSS).
- **Protección contra Directory Traversal**: Al analizar o procesar archivos en el backend, los nombres de archivos se limpian para eliminar secuencias peligrosas tipo `../`.
