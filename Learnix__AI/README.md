# 🎓 Learnix AI - Smart Study Assistant

> An AI-powered web application that helps students study smarter using Artificial Intelligence.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Quick Links

- [🚀 Live Demo](#) (Deploy to get link)
- [📖 User Guide](USER_GUIDE.md)
- [🔧 API Integration Guide](API_INTEGRATION_GUIDE.md)
- [🚢 Deployment Guide](DEPLOYMENT_GUIDE.md)
- [🎤 Presentation Guide](PRESENTATION_GUIDE.md)
- [📊 Project Summary](PROJECT_SUMMARY.md)

---

## 🌟 What is Learnix AI?

**Learnix AI** is a comprehensive study assistant that leverages cutting-edge artificial intelligence to help students learn more efficiently. Built as a final-year engineering project, it demonstrates the power of AI in education technology.

### Key Highlights

✨ **AI-Powered**: Uses Groq's llama-3.3-70b-versatile model  
📚 **All-in-One**: 7+ features in a single platform  
🎯 **Smart**: Personalized learning experience  
💯 **Free**: Open-source and accessible to all  
🚀 **Modern**: Built with latest technologies  
📱 **Responsive**: Works on all devices

---

An AI-powered web application that helps students study smarter using Artificial Intelligence.

## 🚀 Features

### 1. User Authentication
- Sign Up
- Login
- Logout
- Secure session management

### 2. Upload Notes
- Upload PDF and text files
- View uploaded files
- Delete files
- File size tracking

### 3. AI Summary Generator
- Generate comprehensive summaries from notes
- Extract important key points
- Powered by Groq AI (llama-3.3-70b-versatile)

### 4. AI Question Generator
- Generate 2-mark questions with answers
- Generate 16-mark questions with detailed answers
- Based on uploaded study materials

### 5. AI Quiz Generator
- Create MCQ questions from notes
- Interactive quiz interface
- Score tracking and review
- Performance analytics

### 6. AI Chatbot
- Ask study-related questions
- Get simple explanations
- Real-time AI responses

### 7. Study Planner
- Enter exam date
- Add multiple subjects
- Generate AI-powered study timetable
- Smart scheduling recommendations

### 8. Dashboard
- Total notes uploaded
- Total quizzes completed
- Average score tracking
- Quick access to all features

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons
- **React Router** - Navigation (client-side)

### Backend (To be implemented)
- **Spring Boot** - REST API framework
- **MySQL** - Database
- **Spring Security** - Authentication
- **JPA/Hibernate** - ORM

### AI Integration
- **Groq API** - AI model access
- **Model**: llama-3.3-70b-versatile

## 📁 Project Structure

```
learnix-ai/
├── src/
│   ├── components/
│   │   ├── Chatbot.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Navbar.tsx
│   │   ├── QuestionGenerator.tsx
│   │   ├── QuizGenerator.tsx
│   │   ├── Register.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StudyPlanner.tsx
│   │   ├── SummaryGenerator.tsx
│   │   └── UploadNotes.tsx
│   ├── services/
│   │   ├── authService.ts
│   │   ├── fileService.ts
│   │   ├── groqService.ts
│   │   └── quizService.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── backend-structure/ (Reference for Spring Boot implementation)
├── database/ (SQL schema)
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Groq API key (Get free at https://console.groq.com)

### Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Configure Groq API Key**
   - Get your free API key from [console.groq.com](https://console.groq.com)
   - Open `src/services/groqService.ts`
   - Replace `gsk_YOUR_GROQ_API_KEY_HERE` with your actual API key
   - Save the file

3. **Run the application**
```bash
npm run dev
```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Sign up for an account
   - Start using AI features!

📖 **Detailed Setup:** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for step-by-step instructions

## 🔐 Current Implementation

The current frontend uses **localStorage** for:
- User authentication (demo mode)
- File storage (base64 encoded)
- Quiz results
- Session management

**Note**: This is for demonstration purposes. In production, all data should be managed by the Spring Boot backend with MySQL database.

## 📊 Database Schema (For Backend Implementation)

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Files Table
```sql
CREATE TABLE files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Quiz Table
```sql
CREATE TABLE quiz (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    file_name VARCHAR(255),
    completed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔧 Backend Integration Guide

To integrate with Spring Boot backend:

1. Create REST API endpoints:
   - POST `/api/auth/register`
   - POST `/api/auth/login`
   - POST `/api/auth/logout`
   - POST `/api/files/upload`
   - GET `/api/files/user/{userId}`
   - DELETE `/api/files/{fileId}`
   - POST `/api/quiz/save`
   - GET `/api/quiz/user/{userId}`

2. Update frontend services to call backend APIs instead of localStorage

3. Implement file upload to server storage

4. Add JWT token authentication

5. Configure CORS in Spring Boot

See `backend-structure/` folder for reference Spring Boot code structure.

## 🎨 UI Design

- **Theme**: Dark blue (#1e3a8a)
- **Style**: Modern, clean, professional
- **Responsive**: Mobile-first design
- **Icons**: Lucide React
- **Components**: Custom Tailwind CSS

## 📱 Mobile Responsive

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🤝 Contributing

This is a final-year engineering project. Contributions are welcome!

## 📄 License

This project is for educational purposes.

## 👥 Authors

- Final Year Engineering Student

## 🙏 Acknowledgments

- Groq AI for providing the AI API
- React community
- Tailwind CSS team

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Note**: This is a demonstration project. For production use, implement proper security measures, backend integration, and database management.
