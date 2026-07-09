# 🔌 Módulos Funcionales de la Aplicación

Esta página detalla el alcance, las llamadas técnicas y las justificaciones de diseño de cada uno de los paneles integrados en **SentinelX**.

---

## 📊 1. Dashboard Principal (Overview)
- **Alcance**: Panel ejecutivo consolidado de KPIs e historial reciente.
- **Funcionamiento**: Realiza consultas directas mediante Prisma (`prisma.asset.count`, `prisma.vulnerability.count`, etc.) para calcular en tiempo real el **Security Score** global de la infraestructura y el volumen de alertas activas.
- **Actividad Reciente**: Un feed de auditoría en vivo que hace polling cada 10 segundos a la API `/api/audit`, permitiendo visualizar en tiempo real qué acciones está ejecutando cada analista (ej. creación de activos, análisis de archivos, etc.).

---

## 📡 2. Monitor de Red Local (`/network`)
- **Alcance**: Telemetría activa de red local del propio host OS.
- **Funcionamiento**: Llama a `/api/network/scan` cada 5 segundos. Utiliza la librería `systeminformation` para obtener la velocidad y estado de las interfaces de red físicas y listar todas las conexiones TCP/UDP abiertas en el host (`si.networkConnections()`).
- **Visualización**: Un gráfico de barras dinámico en `Recharts` muestra los KB/s de subida y descarga.

> [!IMPORTANT]
> ### 🛡️ Por qué esto es Defensivo (Red)
> Este módulo es **100% de solo lectura y local**. 
> - **Sin escaneos externos**: No realiza barridos ARP ni escaneos de puertos (como `nmap`) hacia direcciones de la red local o internet.
> - **Sin interferencia**: Únicamente consulta el estado interno del kernel local para listar qué sockets del host están abiertos y alertar si hay conexiones externas establecidas (`ESTABLISHED`) a puertos no estándar, lo cual ayuda a detectar balizas de persistencia o tráfico C2 (Command & Control) activo desde el propio host sin invadir redes ajenas.

---

## 🖥️ 3. Escáner de Postura de Seguridad (`/posture`)
- **Alcance**: Comprobación del cumplimiento de directivas básicas locales y configuración del servidor web.
- **Funcionamiento**: Llama a `/api/scanner`. Al presionar el botón de escaneo, una consola interactiva simula secuencialmente la carga de submódulos y las fases de análisis con un retraso dinámico de **60-120 ms por línea** para imitar el comportamiento de un terminal real.
- **Checks Reales**:
  - Estado de cabeceras HTTP de seguridad (CSP, XSTS, X-Frame-Options, Referrer-Policy).
  - Telemetría de hardware (CPU > 85%, RAM libre < 10%) para alertar sobre denegación de servicio o procesos de criptominería.
  - Procesos activos blacklistados clásicos (`nc`, `mimikatz`, `cobaltstrike`, etc.).
  - Vulnerabilidades del árbol de dependencias (`npm audit --json`).
  - Fuga pública del archivo de configuración secreta (`/.env`).

> [!IMPORTANT]
> ### 🛡️ Por qué esto es Defensivo (Scanner)
> Este scanner fue estructurado rigurosamente bajo el principio de **no-intrusión**:
> - **Validación de Loopback**: Las peticiones de headers HTTP y fugas de `.env` están limitadas estrictamente a `localhost` y rangos RFC1918 (redes privadas).
> - **Solo lectura de configuración**: No altera políticas del host, no escribe archivos y no desactiva servicios. Evalúa el estado actual y emite guías de remediación claras, demostrando criterio preventivo ante un reclutador.

---

## 📁 4. Analizador Estático de Archivos (`/analyze`)
- **Alcance**: Inspección segura y cálculo heurístico sobre muestras de archivos.
- **Funcionamiento**: Interfaz drag‑and‑drop interactiva compatible con archivos de hasta 10 MB. El backend calcula hashes SHA-256/MD5, detecta el tipo por *magic bytes* (hex signatures) en lugar de la extensión del archivo, calcula la **entropía de Shannon** (alertando sobre archivos empaquetados o cifrados si la entropía es > 7.0), y corre expresiones regulares en búsqueda de IPs, URLs de descarga y APIs de shell o red sospechosas.
- **Historial con Limpieza**: El listado de análisis se guarda en Prisma y cada registro cuenta con un botón de borrado individual que invoca `DELETE /api/analyze/file/[id]` para mantener la base de datos de auditoría limpia.

---

## 🧠 5. Threat Intelligence (`/threats`)
- **Feeds Públicos**: Consume directamente el feed de CISA KEV (Known Exploited Vulnerabilities) y la matriz MITRE ATT&CK.
- **Caché contra Abuse**: Las respuestas de las llamadas HTTP a CISA y MITRE se almacenan de forma serializada en la tabla `ExternalCache` de Prisma y se invalidan automáticamente cada 24 horas, optimizando tiempos de carga y previniendo bloqueos de IP.
- **Buscador de IOCs**: Buscador reactivo donde el analista introduce IPs, hashes o dominios y se realiza un escaneo cruzado contra la base de datos local y el feed KEV.

---

## ⚙️ 6. Decisiones de Diseño y Trade-offs Técnicos

### Base de Datos: SQLite Local vs PostgreSQL Remoto
- **Decisión**: Se configuró SQLite por defecto en el archivo de Prisma.
- **Trade-off**: Facilita la portabilidad ("cero configuración" al clonar el repo) y permite la ejecución de pruebas unitarias locales ultrarrápidas sin depender de servicios externos en Docker. El trade-off es la falta de concurrencia a gran escala en producción, lo cual es mitigable modificando la cadena de conexión en `.env` hacia PostgreSQL/Turso cuando el proyecto escala.

### Procesamiento de Archivos: In-Memory vs Almacenamiento en Disco
- **Decisión**: Los archivos subidos se procesan directamente como un Buffer en memoria (`Buffer.from(arrayBuffer)`) y luego se descartan, guardando únicamente el metadato en base de datos.
- **Trade-off**: Elimina el riesgo de inyección de malware persistente en el sistema host (Directory Traversal o carga de payloads ejecutables). El trade-off es que no se pueden realizar análisis de flujo profundo multipaso sobre el binario almacenado, pero garantiza la naturaleza 100% defensiva de la consola.

### Almacenamiento de Caché de Threat Intel (CISA & MITRE)
- **Decisión**: Uso de caché local serializada en base de datos con TTL (Time To Live) de 24 horas.
- **Trade-off**: Evita el bloqueo por rate-limiting de las APIs públicas de CISA/MITRE y acelera drásticamente el renderizado del dashboard para el usuario. El trade-off es que la información de CVEs recién publicados puede tener un desfase máximo de un día.

