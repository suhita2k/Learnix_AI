# API Integration Guide - Connecting Frontend to Spring Boot Backend

This guide explains how to modify the React frontend to connect to your Spring Boot backend instead of using localStorage.

## 🔄 Overview

Currently, the frontend uses localStorage for all data storage. This guide shows how to integrate with the Spring Boot REST API.

## 📦 Prerequisites

1. Spring Boot backend running (see BACKEND_STRUCTURE.md)
2. MySQL database set up (see database-schema.sql)
3. CORS properly configured in backend

## 🔧 Setup

### 1. Install Axios for API calls

```bash
npm install axios
```

### 2. Create API Configuration

Create `src/config/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('learnix_current_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Create Environment File

Create `.env` in root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

For production:
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## 🔄 Updated Services

### Updated authService.ts

```typescript
import api from '../config/api';
import { User } from '../types';

const CURRENT_USER_KEY = 'learnix_current_user';
const JWT_TOKEN_KEY = 'jwt_token';

export class AuthService {
  async register(name: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      
      return {
        success: true,
        message: response.data.message || 'Registration successful',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { token, user } = response.data.data;
      
      // Store token and user data
      localStorage.setItem(JWT_TOKEN_KEY, token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return {
        success: true,
        message: 'Login successful',
        user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password',
      };
    }
  }

  logout(): void {
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && localStorage.getItem(JWT_TOKEN_KEY) !== null;
  }
}

export const authService = new AuthService();
```

### Updated fileService.ts

```typescript
import api from '../config/api';
import { UploadedFile } from '../types';

export class FileService {
  async uploadFile(userId: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        message: 'File uploaded successfully',
        fileId: response.data.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload file',
      };
    }
  }

  async getUserFiles(userId: string): Promise<UploadedFile[]> {
    try {
      const response = await api.get(`/files/user/${userId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  }

  async getFile(fileId: string): Promise<UploadedFile | null> {
    try {
      const response = await api.get(`/files/${fileId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching file:', error);
      return null;
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<boolean> {
    try {
      await api.delete(`/files/${fileId}`, {
        params: { userId },
      });
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

export const fileService = new FileService();
```

### Updated quizService.ts

```typescript
import api from '../config/api';
import { Quiz } from '../types';

export class QuizService {
  async saveQuizResult(
    userId: string,
    score: number,
    totalQuestions: number,
    fileName: string
  ): Promise<void> {
    try {
      await api.post('/quiz/save', {
        userId,
        score,
        totalQuestions,
        fileName,
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  }

  async getUserQuizzes(userId: string): Promise<Quiz[]> {
    try {
      const response = await api.get(`/quiz/user/${userId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
  }

  async getAverageScore(userId: string): Promise<number> {
    try {
      const response = await api.get(`/quiz/stats/${userId}`);
      return response.data.data.averageScore || 0;
    } catch (error) {
      console.error('Error fetching average score:', error);
      return 0;
    }
  }

  async getTotalQuizzes(userId: string): Promise<number> {
    try {
      const response = await api.get(`/quiz/stats/${userId}`);
      return response.data.data.totalQuizzes || 0;
    } catch (error) {
      console.error('Error fetching total quizzes:', error);
      return 0;
    }
  }
}

export const quizService = new QuizService();
```

### Updated groqService.ts

For the Groq service, you have two options:

#### Option A: Call Groq API from Frontend (Current Implementation)
Keep the current implementation - simpler but exposes API key in browser

#### Option B: Call Groq API from Backend (Recommended for Production)

```typescript
import api from '../config/api';

export class GroqService {
  async generateSummary(text: string): Promise<string> {
    try {
      const response = await api.post('/ai/summary', { text });
      return response.data.data.summary;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate summary');
    }
  }

  async generateKeyPoints(text: string): Promise<string> {
    try {
      const response = await api.post('/ai/keypoints', { text });
      return response.data.data.keyPoints;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate key points');
    }
  }

  async generate2MarkQuestions(text: string): Promise<string> {
    try {
      const response = await api.post('/ai/questions/2mark', { text });
      return response.data.data.questions;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate questions');
    }
  }

  async generate16MarkQuestions(text: string): Promise<string> {
    try {
      const response = await api.post('/ai/questions/16mark', { text });
      return response.data.data.questions;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate questions');
    }
  }

  async generateMCQQuiz(text: string, numQuestions: number = 10): Promise<any[]> {
    try {
      const response = await api.post('/ai/quiz', { text, numQuestions });
      return response.data.data.questions;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate quiz');
    }
  }

  async answerQuestion(question: string, context: string): Promise<string> {
    try {
      const response = await api.post('/ai/chat', { question, context });
      return response.data.data.answer;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get answer');
    }
  }

  async generateStudyPlan(
    examDate: string,
    subjects: string[],
    currentDate: string
  ): Promise<string> {
    try {
      const response = await api.post('/ai/study-plan', {
        examDate,
        subjects,
        currentDate,
      });
      return response.data.data.plan;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate study plan');
    }
  }

  // These methods are no longer needed with backend implementation
  hasApiKey(): boolean {
    return true; // Backend handles API key
  }

  setApiKey(apiKey: string): void {
    // Not needed - backend handles API key
  }
}

export const groqService = new GroqService();
```

## 🔄 Component Updates

### Update Dashboard.tsx

```typescript
import { useState, useEffect } from 'react';
import { FileText, Award, TrendingUp } from 'lucide-react';
import { authService } from '../services/authService';
import { fileService } from '../services/fileService';
import { quizService } from '../services/quizService';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalQuizzes: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        const [files, totalQuizzes, averageScore] = await Promise.all([
          fileService.getUserFiles(user.id),
          quizService.getTotalQuizzes(user.id),
          quizService.getAverageScore(user.id),
        ]);

        setStats({
          totalNotes: files.length,
          totalQuizzes,
          averageScore,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Rest of component...
}
```

### Update UploadNotes.tsx

```typescript
import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Calendar } from 'lucide-react';
import { authService } from '../services/authService';
import { fileService } from '../services/fileService';
import { UploadedFile } from '../types';

export function UploadNotes() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    if (!user) return;
    
    try {
      const userFiles = await fileService.getUserFiles(user.id);
      setFiles(userFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Rest of component...
}
```

## 🧪 Testing the Integration

### 1. Test Authentication

```typescript
// In browser console
const authService = new AuthService();

// Test registration
await authService.register('Test User', 'test@example.com', 'password123');

// Test login
await authService.login('test@example.com', 'password123');

// Check if authenticated
console.log(authService.isAuthenticated());
```

### 2. Test File Upload

```typescript
// Upload a file through the UI
// Check network tab to see API calls
// Verify file appears in database
```

### 3. Test AI Features

```typescript
// Use AI Summary feature
// Check backend logs for Groq API calls
// Verify response is properly formatted
```

## 🔍 Debugging

### Common Issues

1. **CORS Errors**
```java
// In Spring Boot SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

2. **Authentication Errors**
- Check JWT token is being sent
- Verify token expiration
- Check backend authentication logic

3. **File Upload Errors**
- Check file size limits (both frontend and backend)
- Verify multipart configuration in Spring Boot
- Check file upload directory permissions

### Network Debugging

Use browser DevTools:
1. Open Network tab
2. Filter by "XHR" or "Fetch"
3. Check request/response for each API call
4. Verify status codes and payloads

## 📊 API Response Format

Standardize API responses:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
```

Backend should return:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Your data here
  }
}
```

Or for errors:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

## 🚀 Deployment Considerations

1. **Update API URL for production**
```env
VITE_API_BASE_URL=https://api.learnix.com/api
```

2. **Enable HTTPS**
- Use SSL certificates
- Update CORS to allow HTTPS origins

3. **Handle API timeouts**
```typescript
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
});
```

4. **Implement retry logic**
```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    if (config && config.retry < 3) {
      config.retry = (config.retry || 0) + 1;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return api(config);
    }
    
    return Promise.reject(error);
  }
);
```

## ✅ Migration Checklist

- [ ] Install axios
- [ ] Create API configuration
- [ ] Update environment variables
- [ ] Update authService
- [ ] Update fileService
- [ ] Update quizService
- [ ] Update groqService (if using backend)
- [ ] Update all components to use async/await
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all features
- [ ] Update documentation

---

This completes the API integration guide. Once you implement the Spring Boot backend, follow this guide to connect your frontend!
