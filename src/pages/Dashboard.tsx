
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/');
  };

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/fc4f4473-476e-4acb-aa0f-a0d8464c80d6.png" 
              alt="Spaceteens Logo" 
              className="h-10 w-10"
            />
            <h1 className="ml-3 text-xl font-semibold text-spaceteens-blue">Student Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, {profile.first_name || 'Student'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-spaceteens-blue">My Courses</h2>
          <p className="text-gray-600 mt-1">Explore your enrolled courses and continue learning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Course Cards - Will be replaced with real data later */}
          <Card className="overflow-hidden flex flex-col">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Course Image</p>
            </div>
            <CardContent className="flex-grow p-4">
              <h3 className="font-semibold text-lg">Introduction to Robotics</h3>
              <p className="text-gray-600 text-sm mt-2">
                Learn the basics of robotics and start building your first robot.
              </p>
              <div className="mt-4">
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-spaceteens-teal h-full rounded-full w-1/3"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">33% Complete</p>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4 border-t">
              <Button className="w-full">Continue Learning</Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden flex flex-col">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Course Image</p>
            </div>
            <CardContent className="flex-grow p-4">
              <h3 className="font-semibold text-lg">Coding Adventures</h3>
              <p className="text-gray-600 text-sm mt-2">
                Fun coding adventures for beginners. Learn programming concepts through interactive games.
              </p>
              <div className="mt-4">
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-spaceteens-teal h-full rounded-full w-1/5"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">20% Complete</p>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4 border-t">
              <Button className="w-full">Continue Learning</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-spaceteens-blue">Explore More Courses</h2>
          <p className="text-gray-600 mt-1">Discover and enroll in new courses</p>
          
          <div className="mt-6">
            <Link to="/">
              <Button className="bg-spaceteens-orange hover:bg-orange-600">
                Browse All Courses
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
