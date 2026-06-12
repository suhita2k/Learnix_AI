import { useState } from 'react';
import { Calendar, Plus, X, Sparkles } from 'lucide-react';
import { groqService } from '../services/groqService';

export function StudyPlanner() {
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState<string[]>(['']);
  const [studyPlan, setStudyPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const addSubject = () => {
    setSubjects([...subjects, '']);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const generatePlan = async () => {
    if (!examDate) {
      alert('Please select an exam date');
      return;
    }

    const validSubjects = subjects.filter(s => s.trim());
    if (validSubjects.length === 0) {
      alert('Please add at least one subject');
      return;
    }

    if (!groqService.hasApiKey()) {
      alert('Please configure your Groq API key in the code (src/services/groqService.ts)');
      return;
    }

    setLoading(true);
    setStudyPlan('');

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const plan = await groqService.generateStudyPlan(examDate, validSubjects, currentDate);
      setStudyPlan(plan);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Planner</h1>
        <p className="text-gray-600">
          Create an AI-powered study schedule for your exams
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Subjects
              </label>
              <button
                onClick={addSubject}
                className="flex items-center gap-1 text-sm text-blue-900 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" />
                Add Subject
              </button>
            </div>
            
            <div className="space-y-2">
              {subjects.map((subject, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => updateSubject(index, e.target.value)}
                    placeholder={`Subject ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {subjects.length > 1 && (
                    <button
                      onClick={() => removeSubject(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-5 w-5" />
            {loading ? 'Generating Plan...' : 'Generate Study Plan'}
          </button>
        </div>
      </div>

      {studyPlan && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Your Study Plan
          </h2>
          <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-6 rounded-lg">
            {studyPlan}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> Stick to this schedule, take regular breaks, and adjust as needed based on your progress!
            </p>
          </div>
        </div>
      )}

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
