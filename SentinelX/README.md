<div align="center">

# SentinelX

**Plataforma de Control Local & SOC Defensivo de Nueva Generación**
<br/>
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Ollama](https://img.shields.io/badge/Ollama-Local_AI-white?style=for-the-badge&logo=ollama)

SentinelX ha evolucionado de un simple dashboard de seguridad a un **centro de control integral y orquestador del sistema**, impulsado por IA local (**Sophia**) y herramientas del Model Context Protocol (MCP). Diseñado con estética clínica, densa y de alto contraste inspirada en CrowdStrike Falcon y Bloomberg Terminal.

</div>

---

## ⚡ Capacidades Core

### 🤖 Sophia: IA Local (Zero-Cost, Zero-API)
Asistente integrado 100% en local. Soporta **doble backend intercambiable**:
- **Ollama**: Integración HTTP directa con streaming, soporte de visión y modelos Llama, Mistral, DeepSeek-R1.
- **llama.cpp (llama-server)**: Proceso gestionado internamente (arranque/parada) para modelos GGUF personalizados sin límites de contexto.
- Panel completo de control de modelos (pull directo desde la UI) y selector de backend.

### 🔌 Gestor MCP (Model Context Protocol)
- Registro y gestión de servidores MCP locales.
- Auto-descubrimiento de herramientas mediante JSON-RPC over HTTP.
- *Ping* en vivo para comprobar disponibilidad y latencia.

### 💻 Centro de Control del Sistema (Telemetría Real)
- Monitorización en tiempo real de CPU (por núcleo), RAM, Disco y Temperaturas mediante *systeminformation*.
- Visor de procesos activos con opción de **terminación forzada (Kill PID)** con modal de confirmación.
- Análisis de servicios locales en Windows/Linux.

### 💰 Panel de Uso y Rentabilidad
- Tracker de consumo de tokens por backend (input/output) y tiempo de inferencia.
- Visualización histórica en *AreaCharts*.
- Comparador en tiempo real: te muestra exactamente cuánto habrías pagado en proveedores cloud (GPT-4o, Claude 3.5) frente a **0.00€** en SentinelX.

### 🛡️ SOC Defensivo Original
- **Posture Scanner**: Auditoría real de configuraciones del OS, firewall, UAC, etc.
- **Network Monitor**: Conexiones de red activas en vivo.
- **File Analyzer**: Análisis estático de malware por entropía y simulaciones YARA.
- **Threat Intel**: Integración real con el *CISA KEV (Known Exploited Vulnerabilities)*.

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: Prisma ORM + SQLite (Turso-ready)
- **Estilos**: TailwindCSS, `lucide-react`, componentes radix-ui inspirados en *shadcn/ui*
- **Telemetría**: `systeminformation`
- **IA**: Vercel AI SDK (`ai`), API HTTP directa para streaming SSE
- **Gestión de Procesos**: `execa` v9

## 🚀 Instalación y Despliegue

```bash
# 1. Clonar y dependencias
git clone https://github.com/lucasmdg/CIBER.git
cd CIBER/SentinelX
npm install

# 2. Configurar Base de datos
# Asegúrate de tener SQLite y Prisma configurados
npx prisma generate
npx prisma db push
npx prisma db seed

# 3. Levantar backends locales (opcional pero recomendado)
# Arranca Ollama en tu máquina local (localhost:11434)
ollama serve

# 4. Iniciar plataforma
npm run dev
```

### Configuración de llama-server (.env)
Si deseas usar `llama.cpp` directamente sin Ollama:
```env
LLAMACPP_BIN="llama-server.exe" # O ruta absoluta al binario
LLAMACPP_MODELS_DIR="C:\Users\tu-usuario\models"
LLAMACPP_MODEL="C:\Users\tu-usuario\models\modelo-Q4.gguf"
```

## 🔌 Integración IDE (VS Code & OpenCode)
Sophia actúa como un puente (Bridge) para tu IDE favorito:
- **API Base Compatible OpenAI**: `http://localhost:3000/api/llamacpp` (o `/api/ollama`)
- Endpoint unificado de descubrimiento: `GET /api/bridge/status`
- Puedes apuntar extensiones como *Continue.dev* o *OpenCode* a estos endpoints y chatear con los modelos gestionados por SentinelX de forma transparente.

---
> Proyecto desarrollado por [Lucas](https://github.com/lucasmdg) como ecosistema de control local y SOC privado.
