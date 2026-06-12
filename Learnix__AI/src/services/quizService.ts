import { Quiz } from '../types';

const QUIZ_KEY = 'learnix_quizzes';

export class QuizService {
  private getQuizzes(): Quiz[] {
    const quizzesJson = localStorage.getItem(QUIZ_KEY);
    return quizzesJson ? JSON.parse(quizzesJson) : [];
  }

  private saveQuizzes(quizzes: Quiz[]): void {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(quizzes));
  }

  saveQuizResult(userId: string, score: number, totalQuestions: number, fileName: string): void {
    const quiz: Quiz = {
      id: Date.now().toString(),
      userId,
      score,
      totalQuestions,
      completedDate: new Date().toISOString(),
      fileName,
    };

    const quizzes = this.getQuizzes();
    quizzes.push(quiz);
    this.saveQuizzes(quizzes);
  }

  getUserQuizzes(userId: string): Quiz[] {
    const quizzes = this.getQuizzes();
    return quizzes.filter(q => q.userId === userId);
  }

  getAverageScore(userId: string): number {
    const quizzes = this.getUserQuizzes(userId);
    if (quizzes.length === 0) return 0;

    const totalPercentage = quizzes.reduce((sum, quiz) => {
      return sum + (quiz.score / quiz.totalQuestions) * 100;
    }, 0);

    return Math.round(totalPercentage / quizzes.length);
  }

  getTotalQuizzes(userId: string): number {
    return this.getUserQuizzes(userId).length;
  }
}

export const quizService = new QuizService();
