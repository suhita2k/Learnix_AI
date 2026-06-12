import { FileText, Award, TrendingUp } from 'lucide-react';
import { authService } from '../services/authService';
import { fileService } from '../services/fileService';
import { quizService } from '../services/quizService';

export function Dashboard() {
  const user = authService.getCurrentUser();
  const totalNotes = user ? fileService.getUserFiles(user.id).length : 0;
  const totalQuizzes = user ? quizService.getTotalQuizzes(user.id) : 0;
  const averageScore = user ? quizService.getAverageScore(user.id) : 0;

  const stats = [
    {
      title: 'Total Notes Uploaded',
      value: totalNotes,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Quizzes Completed',
      value: totalQuizzes,
      icon: Award,
      color: 'bg-green-500',
    },
    {
      title: 'Average Score',
      value: `${averageScore}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's an overview of your learning progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl shadow-md p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">🚀 Get Started with Learnix AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">1. Upload Your Notes</h3>
            <p className="text-sm text-blue-100">
              Start by uploading your study materials in PDF or text format
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">2. Generate Summaries</h3>
            <p className="text-sm text-blue-100">
              Use AI to create concise summaries and key points
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">3. Practice with Quizzes</h3>
            <p className="text-sm text-blue-100">
              Test your knowledge with AI-generated quizzes
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">4. Plan Your Studies</h3>
            <p className="text-sm text-blue-100">
              Create personalized study schedules for your exams
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Pro Tip: Start with uploading notes
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Upload your study materials first, then use AI features to generate summaries, 
              questions, and quizzes. All AI features are ready to use!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
