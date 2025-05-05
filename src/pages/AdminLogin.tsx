
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin authentication - in a real app, use proper authentication
    if (username === 'admin' && password === 'spaceteens123') {
      // Store auth state in session storage
      sessionStorage.setItem('adminAuthenticated', 'true');
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      
      // Navigate to admin dashboard
      navigate('/admin');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-spaceteens-lightblue to-white">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/fc4f4473-476e-4acb-aa0f-a0d8464c80d6.png" 
            alt="Spaceteens Academy Logo" 
            className="w-32 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-spaceteens-blue">Admin Login</h1>
          <p className="text-gray-600 mt-2">Enter your credentials to access the admin area</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Manage your courses, students, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-spaceteens-orange hover:bg-orange-600"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-spaceteens-blue hover:underline">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
