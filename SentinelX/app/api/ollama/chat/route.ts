import { StreamingTextResponse, OpenAIStream } from 'ai';

// Ollama expone nativamente una API compatible con OpenAI en /v1/chat/completions
// Aprovechamos esto para usar el robusto OpenAIStream del Vercel AI SDK.
export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const response = await fetch('http://127.0.0.1:11434/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'qwen3.6:latest',
        messages,
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
