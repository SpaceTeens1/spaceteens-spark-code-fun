import { useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminLessons from '@/components/admin/AdminLessons';
import AdminMaterials from '@/components/admin/AdminMaterials';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { toast } = useToast();

  // Check if user is authenticated and is an admin
  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    
    // Check if profile is loaded and user is admin
    if (profile && !isAdmin()) {
      toast({
        title: "Access denied",
        description: "You don't have administrator privileges",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, profile, navigate, isAdmin, toast]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    // Force page reload for a clean state
    window.location.href = '/';
  };

  if (!user || !profile || !isAdmin()) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-spaceteens-blue">Spaceteens Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">
              Signed in as {profile.first_name} {profile.last_name}
            </span>
            <Link to="/">
              <Button variant="outline" size="sm">View Website</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        {/* Admin Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/lessons" element={<AdminLessons />} />
            <Route path="/materials" element={<AdminMaterials />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Admin home component
const AdminHome = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-spaceteens-blue">Welcome to the Admin Dashboard</h2>
      <p className="text-gray-600">Use the sidebar to navigate between different sections.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Link to="/admin/courses" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-spaceteens-orange">
            <h3 className="text-lg font-semibold">Courses</h3>
            <p className="text-gray-500 mt-2">Manage all your courses</p>
          </div>
        </Link>
        
        <Link to="/admin/lessons" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-spaceteens-blue">
            <h3 className="text-lg font-semibold">Lessons</h3>
            <p className="text-gray-500 mt-2">Create and organize lessons</p>
          </div>
        </Link>
        
        <Link to="/admin/materials" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-spaceteens-teal">
            <h3 className="text-lg font-semibold">Materials</h3>
            <p className="text-gray-500 mt-2">Upload PDFs, videos, and resources</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
