// lib/bridge/vscode-opencode.ts
// Protocolo y utilidades para la integración de Sophia con VS Code y OpenCode.

export interface BridgeStatusResponse {
  system: "SentinelX-Sophia";
  version: "1.0.0";
  endpoints: {
    chat: string;
    models: string;
  };
  backends: {
    ollama: {
      available: boolean;
      models: string[];
    };
    llamacpp: {
      available: boolean;
      models: string[];
    };
  };
}

export function getBridgeConfigInfo() {
  return `
### Configuración para OpenCode
OpenCode soporta endpoints compatibles con OpenAI nativamente.
Dado que Sophia expone estos endpoints, puedes configurar OpenCode así:
1. Ve a la configuración de proveedores en OpenCode.
2. Añade un proveedor tipo "OpenAI compatible".
3. URL Base: http://localhost:3000/api/llamacpp (o /api/ollama)
4. Modelo: Elige el que prefieras de la lista.

### Configuración para VS Code (Extensión Genérica)
Cualquier extensión que soporte OpenAI-compatibles (ej. Continue.dev) puede apuntar a Sophia:
- API Base: http://localhost:3000/api/ollama
- Model: qwen3.6:latest (u otro activo)
`;
}
