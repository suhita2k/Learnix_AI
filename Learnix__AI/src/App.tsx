import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { UploadNotes } from './components/UploadNotes';
import { SummaryGenerator } from './components/SummaryGenerator';
import { QuestionGenerator } from './components/QuestionGenerator';
import { QuizGenerator } from './components/QuizGenerator';
import { Chatbot } from './components/Chatbot';
import { StudyPlanner } from './components/StudyPlanner';
import { authService } from './services/authService';

type Page = 'dashboard' | 'upload' | 'summary' | 'questions' | 'quiz' | 'chatbot' | 'planner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setShowLogin(false)}
        />
      );
    } else {
      return (
        <Register 
          onSwitchToLogin={() => setShowLogin(true)}
        />
      );
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <UploadNotes />;
      case 'summary':
        return <SummaryGenerator />;
      case 'questions':
        return <QuestionGenerator />;
      case 'quiz':
        return <QuizGenerator />;
      case 'chatbot':
        return <Chatbot />;
      case 'planner':
        return <StudyPlanner />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar 
          activePage={currentPage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
