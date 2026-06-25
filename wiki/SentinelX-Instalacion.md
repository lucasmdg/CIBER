# 💻 Guía de Instalación y Levantamiento Local

Sigue estos pasos para clonar, configurar e iniciar **SentinelX** en tu entorno de desarrollo local. No se asume ninguna pre-configuración en el host más allá de tener instalado Node.js.

---

## 📋 Requisitos Previos

- **Node.js**: Versión `v20.10.0` o superior (se recomienda Node 22+).
- **npm**: Versión `v10` o superior.
- **Git**: Para clonar el repositorio principal.

---

## 🛠️ Levantamiento Paso a Paso (Modo Local)

### 1. Clonar el repositorio y entrar al subdirectorio
Abre tu terminal y clona el repositorio consolidado de ciberseguridad, y luego posiciónate en la carpeta del proyecto de SentinelX:
```bash
git clone https://github.com/lucasmdg/CIBER.git
cd CIBER/SentinelX
```

### 2. Instalar dependencias
Instala los paquetes requeridos por Next.js y el motor de telemetría local:
```bash
npm install
```

### 3. Configurar variables de entorno
Crea tu archivo de entorno a partir de la plantilla provista:
```bash
cp .env.example .env
```
*Nota: Si estás en Windows PowerShell, puedes usar:*
```powershell
Copy-Item .env.example .env
```

Por defecto, la plantilla viene pre-configurada para usar **SQLite** como motor local de base de datos (`DATABASE_URL="file:./dev.db"`), por lo que no necesitas levantar bases de datos externas en este punto.

### 4. Sincronizar y Poblar la Base de Datos
Genera el cliente local de Prisma y empuja el esquema relacional sobre el archivo SQLite `dev.db`:
```bash
npx prisma generate
npx prisma db push
```

A continuación, ejecuta los scripts de siembra para poblar la base de datos con activos sintéticos y los usuarios de prueba:
```bash
npm run db:seed
npx tsx prisma/seed-users.ts
```

### 5. Iniciar el Servidor de Desarrollo
Lanza el servidor local en modo desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en **http://localhost:3000**.

---

## 🐳 Levantamiento con Docker (Alternativo)

Si prefieres levantar el dashboard dentro de un contenedor aislado con PostgreSQL, puedes utilizar la configuración Docker Compose incluida:

```bash
# Iniciar servicios en segundo plano
docker-compose up -d
```
Esto levantará:
1. Una base de datos PostgreSQL persistente.
2. La aplicación Node.js compilada y expuesta en el puerto `3000`.

---

## 🔑 Credenciales de Acceso Demo

Puedes iniciar sesión en la pantalla de login (`http://localhost:3000/login`) con cualquiera de estos roles de prueba:

- **Analista de Seguridad (Lectura general, escaneos estáticos)**:
  - Usuario: `analyst@sentinelx.local`
  - Contraseña: `SentinelX-Demo-2026`
- **Ingeniero de Seguridad (Escritura de activos, remediación de vulns)**:
  - Usuario: `engineer@sentinelx.local`
  - Contraseña: `SentinelX-Demo-2026`
- **Administrador del SOC (Control total, visualización de logs de auditoría)**:
  - Usuario: `admin@sentinelx.local`
  - Contraseña: `SentinelX-Demo-2026`
