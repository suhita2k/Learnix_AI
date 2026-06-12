import { LogOut, Menu, X, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../services/authService';

interface NavbarProps {
  onLogout: () => void;
  onToggleSidebar?: () => void;
}

export function Navbar({ onLogout, onToggleSidebar }: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-blue-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <GraduationCap className="h-8 w-8" />
            <span className="text-xl font-bold">Learnix AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-md hover:bg-blue-700"
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden bg-blue-800 px-4 py-3 space-y-2">
          <div className="text-sm py-2">Welcome, {user?.name}</div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
