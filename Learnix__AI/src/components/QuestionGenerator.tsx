import { useState } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import { fileService } from '../services/fileService';
import { groqService } from '../services/groqService';

export function QuestionGenerator() {
  const [selectedFile, setSelectedFile] = useState('');
  const [twoMarkQuestions, setTwoMarkQuestions] = useState('');
  const [sixteenMarkQuestions, setSixteenMarkQuestions] = useState('');
  const [loading, setLoading] = useState(false);
  const user = authService.getCurrentUser();
  const files = user ? fileService.getUserFiles(user.id) : [];

  const generate2Mark = async () => {
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
    setTwoMarkQuestions('');

    try {
      const result = await groqService.generate2MarkQuestions(file.content);
      setTwoMarkQuestions(result);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generate16Mark = async () => {
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
    setSixteenMarkQuestions('');

    try {
      const result = await groqService.generate16MarkQuestions(file.content);
      setSixteenMarkQuestions(result);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Generator</h1>
        <p className="text-gray-600">
          Generate exam-style questions with answers from your notes
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Select a File</h2>
        
        {files.length === 0 ? (
          <p className="text-gray-600">No files uploaded yet. Upload some notes first!</p>
        ) : (
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
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={generate2Mark}
            disabled={loading || !selectedFile}
            className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <HelpCircle className="h-5 w-5" />
            {loading ? 'Generating...' : 'Generate 2-Mark Questions'}
          </button>
          
          <button
            onClick={generate16Mark}
            disabled={loading || !selectedFile}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-5 w-5" />
            {loading ? 'Generating...' : 'Generate 16-Mark Questions'}
          </button>
        </div>
      </div>

      {twoMarkQuestions && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            2-Mark Questions & Answers
          </h2>
          <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg space-y-4">
            {twoMarkQuestions}
          </div>
        </div>
      )}

      {sixteenMarkQuestions && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            16-Mark Questions & Answers
          </h2>
          <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg space-y-6">
            {sixteenMarkQuestions}
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
