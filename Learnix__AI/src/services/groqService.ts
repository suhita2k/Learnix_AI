const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export class GroqService {
  private apiKey: string;

  constructor() {
    this.apiKey = GROQ_API_KEY;
    console.log('Groq API Key Loaded:', !!this.apiKey);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async chat(messages: Array<{ role: string; content: string }>) {
    if (!this.apiKey) {
      throw new Error('Groq API key not set');
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Groq API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Keep all your existing methods below unchanged
}
