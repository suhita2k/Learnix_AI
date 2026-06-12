const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// TODO: Replace with your actual Groq API key
// Get your free API key from: https://console.groq.com
const GROQ_API_KEY = 'gsk_YOUR_GROQ_API_KEY_HERE';

export class GroqService {
  private apiKey: string;

  constructor() {
    this.apiKey = GROQ_API_KEY;
  }

  hasApiKey(): boolean {
    return this.apiKey.length > 0 && this.apiKey !== 'gsk_YOUR_GROQ_API_KEY_HERE';
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

  async generateSummary(text: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful study assistant. Generate clear, concise summaries of educational content.',
      },
      {
        role: 'user',
        content: `Please provide a comprehensive summary of the following notes:\n\n${text}`,
      },
    ];

    return await this.chat(messages);
  }

  async generateKeyPoints(text: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful study assistant. Extract key points from educational content.',
      },
      {
        role: 'user',
        content: `Please extract and list the most important points from the following notes:\n\n${text}`,
      },
    ];

    return await this.chat(messages);
  }

  async generate2MarkQuestions(text: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are an expert educator. Generate 2-mark questions with answers from educational content.',
      },
      {
        role: 'user',
        content: `Generate 10 two-mark questions with answers from the following notes. Format each as:\nQ1. [Question]\nA1. [Answer]\n\n${text}`,
      },
    ];

    return await this.chat(messages);
  }

  async generate16MarkQuestions(text: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are an expert educator. Generate detailed 16-mark questions with comprehensive answers.',
      },
      {
        role: 'user',
        content: `Generate 5 sixteen-mark questions with detailed answers from the following notes. Format each as:\nQ1. [Question]\nA1. [Detailed Answer]\n\n${text}`,
      },
    ];

    return await this.chat(messages);
  }

  async generateMCQQuiz(text: string, numQuestions: number = 10): Promise<any[]> {
    const messages = [
      {
        role: 'system',
        content: 'You are an expert educator. Generate multiple choice questions from educational content. Return ONLY a valid JSON array.',
      },
      {
        role: 'user',
        content: `Generate ${numQuestions} multiple choice questions from the following notes. Return ONLY a JSON array with this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

Notes:
${text}`,
      },
    ];

    const response = await this.chat(messages);
    
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Failed to parse MCQ response:', error);
      throw new Error('Failed to generate quiz questions');
    }
  }

  async answerQuestion(question: string, context: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful study assistant. Provide clear, simple explanations to student questions.',
      },
      {
        role: 'user',
        content: context ? `Context: ${context}\n\nQuestion: ${question}` : question,
      },
    ];

    return await this.chat(messages);
  }

  async generateStudyPlan(examDate: string, subjects: string[], currentDate: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are an expert study planner. Create effective study schedules for students.',
      },
      {
        role: 'user',
        content: `Create a study plan from ${currentDate} to ${examDate} for the following subjects: ${subjects.join(', ')}. 
        
Provide a day-by-day schedule with topics to cover, study duration, and breaks. Format the response clearly.`,
      },
    ];

    return await this.chat(messages);
  }
}

export const groqService = new GroqService();
