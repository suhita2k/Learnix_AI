const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export class GroqService {
  private apiKey: string;

  constructor() {
    this.apiKey = GROQ_API_KEY;
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async chat(messages: Array<{ role: string; content: string }>) {
    if (!this.apiKey) {
      throw new Error('Groq API key not configured');
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
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

  async generateSummary(text: string): Promise<string> {
    return this.chat([
      {
        role: 'system',
        content:
          'You are a helpful study assistant. Generate clear, concise summaries of educational content.',
      },
      {
        role: 'user',
        content: `Please provide a comprehensive summary of the following notes:\n\n${text}`,
      },
    ]);
  }

  async generateKeyPoints(text: string): Promise<string> {
    return this.chat([
      {
        role: 'system',
        content:
          'You are a helpful study assistant. Extract key points from educational content.',
      },
      {
        role: 'user',
        content: `Please extract and list the most important points from the following notes:\n\n${text}`,
      },
    ]);
  }

  async generate2MarkQuestions(text: string): Promise<string> {
    return this.chat([
      {
        role: 'system',
        content:
          'You are an expert educator. Generate 2-mark questions with answers.',
      },
      {
        role: 'user',
        content: `Generate 10 two-mark questions with answers from:\n\n${text}`,
      },
    ]);
  }

  async generate16MarkQuestions(text: string): Promise<string> {
    return this.chat([
      {
        role: 'system',
        content:
          'You are an expert educator. Generate 16-mark questions with detailed answers.',
      },
      {
        role: 'user',
        content: `Generate 5 sixteen-mark questions with detailed answers from:\n\n${text}`,
      },
    ]);
  }

  async answerQuestion(
    question: string,
    context: string
  ): Promise<string> {
    return this.chat([
      {
        role: 'system',
        content:
          'You are a helpful study assistant. Provide clear explanations.',
      },
      {
        role: 'user',
        content: context
          ? `Context: ${context}\n\nQuestion: ${question}`
          : question,
      },
    ]);
  }
  async generateMCQQuiz(text: string, numQuestions: number = 10): Promise<any[]> {
  const response = await this.chat([
    {
      role: 'system',
      content: `Generate multiple choice questions.
Return ONLY valid JSON.
Do not include markdown.
Format:

[
  {
    "question": "Question?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0
  }
]`
    },
    {
      role: 'user',
      content: `Generate ${numQuestions} MCQ questions from:\n\n${text}`
    }
  ]);

  try {
    const cleanedResponse = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('MCQ Parse Error:', error);
    console.error('Response:', response);
    throw new Error('Failed to generate MCQ quiz');
  }
}

  async generateStudyPlan(
    examDate: string,
    subjects: string[],
    currentDate: string
  ): Promise<string> {
    return this.chat([
      {
        role: 'system',
        content:
          'You are an expert study planner. Create effective study schedules.',
      },
      {
        role: 'user',
        content: `Create a study plan from ${currentDate} to ${examDate} for: ${subjects.join(
          ', '
        )}`,
      },
    ]);
  }
}

export const groqService = new GroqService();
