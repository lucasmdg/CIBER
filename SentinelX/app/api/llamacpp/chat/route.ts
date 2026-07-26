import { StreamingTextResponse, OpenAIStream } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages, temperature } = await req.json();
    
    const host = process.env.LLAMACPP_HOST || '127.0.0.1';
    const port = process.env.LLAMACPP_PORT || '8080';

    const response = await fetch(`http://${host}:${port}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        stream: true,
        temperature: temperature || 0.7,
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
