
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signOut, isAdmin, profile } = useAuth();

  useEffect(() => {
    // If user is already logged in and is an admin, redirect to dashboard
    if (profile && isAdmin()) {
      navigate('/admin');
    }
  }, [profile, navigate, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // We need to wait for the profile to be loaded
    setTimeout(async () => {
      if (profile && isAdmin()) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Access denied",
          description: "You don't have administrator privileges",
          variant: "destructive"
        });
        // Sign out since they're not an admin
        await signOut();
      }
      setIsLoading(false);
    }, 1000);
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
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
                  placeholder="••••••••"
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
