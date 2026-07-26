// app/api/v1/chat/completions/route.ts
// Proxy endpoint universal compatible con OpenAI para integraciones IDE (VS Code, OpenCode).
// Se conecta al backend activo en SentinelX (por defecto Ollama).

import { StreamingTextResponse, OpenAIStream } from 'ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Si no se especifica modelo, usamos qwen3.6 por defecto
    const model = body.model || 'qwen3.6:latest';

    const response = await fetch('http://127.0.0.1:11434/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        model,
        stream: true,
      }),
    });

    if (!response.ok) {
      return new Response(await response.text(), { status: response.status });
    }

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
