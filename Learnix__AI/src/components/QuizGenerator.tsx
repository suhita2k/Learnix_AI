import { useState } from 'react';
import { HelpCircle, Award, RotateCcw } from 'lucide-react';
import { authService } from '../services/authService';
import { fileService } from '../services/fileService';
import { groqService } from '../services/groqService';
import { quizService } from '../services/quizService';
import { MCQQuestion } from '../types';

export function QuizGenerator() {
  const [selectedFile, setSelectedFile] = useState('');
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = authService.getCurrentUser();
  const files = user ? fileService.getUserFiles(user.id) : [];

  const startQuiz = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    if (!groqService.hasApiKey()) {
      alert('Please configure your Groq API key in the code (src/services/groqService.ts)');
      return;
    }

    const file = fileService.getFile(selectedFile);
    if (!file || !file.content) {
      alert('File content not found');
      return;
    }

    setLoading(true);

    try {
      const quizQuestions = await groqService.generateMCQQuiz(file.content, 10);
      setQuestions(quizQuestions);
      setCurrentQuestion(0);
      setSelectedAnswers([]);
      setShowResults(false);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const score = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    if (user) {
      const file = fileService.getFile(selectedFile);
      quizService.saveQuizResult(user.id, score, questions.length, file?.fileName || 'Quiz');
    }

    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setSelectedFile('');
  };

  const calculateScore = () => {
    return questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-6xl font-bold text-blue-900 my-6">{percentage}%</p>
          <p className="text-xl text-gray-600 mb-8">
            You scored {score} out of {questions.length} questions
          </p>

          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 mx-auto"
          >
            <RotateCcw className="h-5 w-5" />
            Take Another Quiz
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Review Answers</h3>
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                  <p className="font-semibold mb-3">
                    {index + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = userAnswer === optionIndex;
                      const isCorrectAnswer = question.correctAnswer === optionIndex;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded ${
                            isCorrectAnswer
                              ? 'bg-green-200 font-semibold'
                              : isUserAnswer
                              ? 'bg-red-200'
                              : 'bg-white'
                          }`}
                        >
                          {option}
                          {isCorrectAnswer && ' ✓'}
                          {isUserAnswer && !isCorrectAnswer && ' ✗'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const question = questions[currentQuestion];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz</h1>
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-600">
                Progress: {currentQuestion + 1}/{questions.length}
              </span>
              <span className="text-sm font-semibold text-gray-600">
                Answered: {selectedAnswers.filter(a => a !== undefined).length}/{questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-900 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Generator</h1>
        <p className="text-gray-600">
          Generate and take AI-powered quizzes from your notes
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Select a File</h2>
        
        {files.length === 0 ? (
          <p className="text-gray-600">No files uploaded yet. Upload some notes first!</p>
        ) : (
          <>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a file...</option>
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.fileName}
                </option>
              ))}
            </select>

            <button
              onClick={startQuiz}
              disabled={loading || !selectedFile}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <HelpCircle className="h-5 w-5" />
              {loading ? 'Generating Quiz...' : 'Start Quiz (10 Questions)'}
            </button>
          </>
        )}
      </div>

      {!groqService.hasApiKey() && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <p className="text-sm text-yellow-700">
            ⚠️ Please configure your Groq API key in <code className="bg-yellow-100 px-1 rounded">src/services/groqService.ts</code> to use this feature
          </p>
        </div>
      )}
    </div>
  );
}
