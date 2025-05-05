
import { NavLink } from 'react-router-dom';
import { BookOpen, Video, FileText, Home } from 'lucide-react';

const AdminSidebar = () => {
  // Navigation items
  const navItems = [
    { icon: <Home />, label: 'Dashboard', to: '/admin' },
    { icon: <BookOpen />, label: 'Courses', to: '/admin/courses' },
    { icon: <FileText />, label: 'Lessons', to: '/admin/lessons' },
    { icon: <Video />, label: 'Materials', to: '/admin/materials' },
  ];

  return (
    <aside className="w-64 bg-spaceteens-blue text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-spaceteens-blue-700">
        <div className="flex items-center justify-center py-3">
          <img 
            src="/lovable-uploads/fc4f4473-476e-4acb-aa0f-a0d8464c80d6.png" 
            alt="Spaceteens Logo" 
            className="w-12 h-12"
          />
          <span className="ml-2 text-xl font-bold">Spaceteens</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  `flex items-center px-6 py-3 text-sm font-medium ${
                    isActive 
                      ? 'bg-spaceteens-teal text-spaceteens-blue' 
                      : 'text-white hover:bg-spaceteens-blue/80'
                  }`
                }
                end={item.to === '/admin'}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-center text-white/70">
        <p>Spaceteens Admin Portal</p>
        <p>© {new Date().getFullYear()} Spaceteens</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
