export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface UploadedFile {
  id: string;
  userId: string;
  fileName: string;
  uploadDate: string;
  content?: string;
  fileSize: number;
}

export interface Quiz {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  completedDate: string;
  fileName: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  examDate: string;
  subjects: string[];
  schedule: ScheduleItem[];
}

export interface ScheduleItem {
  date: string;
  subject: string;
  topics: string[];
  duration: string;
}
