import {
  LayoutDashboard,
  FileUp,
  FileText,
  HelpCircle,
  MessageCircle,
  Calendar,
  X,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Notes', icon: FileUp },
  { id: 'summary', label: 'AI Summary', icon: FileText },
  { id: 'questions', label: 'Question Generator', icon: HelpCircle },
  { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle },
  { id: 'chatbot', label: 'AI Chatbot', icon: MessageCircle },
  { id: 'planner', label: 'Study Planner', icon: Calendar },
];

export function Sidebar({ activePage, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-blue-900 to-blue-950 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-blue-800">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'hover:bg-blue-800 text-blue-100'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="bg-blue-800 rounded-lg p-3 text-sm">
            <p className="font-semibold mb-1">💡 Pro Tip</p>
            <p className="text-blue-200 text-xs">
              Upload your notes to generate summaries, quizzes, and get AI-powered study help!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
