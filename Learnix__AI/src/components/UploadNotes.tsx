import { useState } from 'react';
import { Upload, FileText, Trash2, Calendar } from 'lucide-react';
import { authService } from '../services/authService';
import { fileService } from '../services/fileService';
import { UploadedFile } from '../types';

export function UploadNotes() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const user = authService.getCurrentUser();

  const loadFiles = () => {
    if (user) {
      setFiles(fileService.getUserFiles(user.id));
    }
  };

  useState(() => {
    loadFiles();
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setMessage('');

    const result = await fileService.uploadFile(user.id, file);
    
    if (result.success) {
      setMessage('File uploaded successfully!');
      loadFiles();
    } else {
      setMessage(result.message);
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = (fileId: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this file?')) {
      const success = fileService.deleteFile(fileId, user.id);
      if (success) {
        setMessage('File deleted successfully');
        loadFiles();
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Notes</h1>
        <p className="text-gray-600">
          Upload your study materials to use with AI features
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload your notes
          </h3>
          <p className="text-gray-600 mb-4">
            PDF, TXT files supported (Max 10MB)
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <span className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 cursor-pointer inline-block">
              {uploading ? 'Uploading...' : 'Choose File'}
            </span>
          </label>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Uploaded Files</h2>
        
        {files.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No files uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 truncate" title={file.fileName}>
                  {file.fileName}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(file.uploadDate)}
                  </div>
                  <div>{formatFileSize(file.fileSize)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
