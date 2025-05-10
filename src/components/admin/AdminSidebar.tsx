
import { NavLink } from 'react-router-dom';
import { BookOpen, Video, FileText, Home, Users, FileQuestion, Sparkles } from 'lucide-react';

const AdminSidebar = () => {
  // Navigation items
  const navItems = [
    { icon: <Home />, label: 'Dashboard', to: '/admin' },
    { icon: <BookOpen />, label: 'Courses', to: '/admin/courses' },
    { icon: <FileText />, label: 'Lessons', to: '/admin/lessons' },
    { icon: <Video />, label: 'Materials', to: '/admin/materials' },
    { icon: <Users />, label: 'Users', to: '/admin/users' },
    { icon: <FileQuestion />, label: 'Quizzes', to: '/admin/quizzes' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-spaceteens-blue to-spaceteens-blue/90 text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-center py-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/fc4f4473-476e-4acb-aa0f-a0d8464c80d6.png" 
              alt="Spaceteens Logo" 
              className="w-12 h-12"
            />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-spaceteens-orange animate-pulse" />
          </div>
          <span className="ml-2 text-xl font-bold">Spaceteens</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-white text-spaceteens-blue shadow-md' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`
                }
                end={item.to === '/admin'}
              >
                <span className="mr-3 text-spaceteens-teal">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-center text-white/70 border-t border-white/10">
        <p>Spaceteens Admin Portal</p>
        <p>© {new Date().getFullYear()} Spaceteens</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
