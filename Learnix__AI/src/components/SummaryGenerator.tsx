import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import { fileService } from '../services/fileService';
import { groqService } from '../services/groqService';

export function SummaryGenerator() {
  const [selectedFile, setSelectedFile] = useState('');
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const user = authService.getCurrentUser();
  const files = user ? fileService.getUserFiles(user.id) : [];

  const generateSummary = async () => {
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
    setSummary('');

    try {
      const result = await groqService.generateSummary(file.content);
      setSummary(result);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateKeyPoints = async () => {
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
    setKeyPoints('');

    try {
      const result = await groqService.generateKeyPoints(file.content);
      setKeyPoints(result);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Summary Generator</h1>
        <p className="text-gray-600">
          Generate summaries and key points from your notes using AI
        </p>
      </div>

      {!groqService.hasApiKey() && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Groq API Key Not Configured
              </h3>
              <p className="text-sm text-yellow-700 mb-2">
                To use AI features, you need to add your Groq API key to the code.
              </p>
              <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                <li>Get a free API key from <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">console.groq.com</a></li>
                <li>Open <code className="bg-yellow-100 px-1 rounded">src/services/groqService.ts</code></li>
                <li>Replace <code className="bg-yellow-100 px-1 rounded">gsk_YOUR_GROQ_API_KEY_HERE</code> with your actual API key</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </div>
        </div>
      )}

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
            onClick={generateSummary}
            disabled={loading || !selectedFile}
            className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-5 w-5" />
            {loading ? 'Generating...' : 'Generate Summary'}
          </button>
          
          <button
            onClick={generateKeyPoints}
            disabled={loading || !selectedFile}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FileText className="h-5 w-5" />
            {loading ? 'Generating...' : 'Generate Key Points'}
          </button>
        </div>
      </div>

      {summary && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Summary
          </h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
              {summary}
            </div>
          </div>
        </div>
      )}

      {keyPoints && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Key Points
          </h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
              {keyPoints}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
