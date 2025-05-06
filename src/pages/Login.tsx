
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

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
    } else {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/dashboard');
    }
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
          <h1 className="text-3xl font-bold text-spaceteens-blue">Student Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access your courses and learning materials</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/reset-password" className="text-xs text-spaceteens-blue hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit"
                className="w-full bg-spaceteens-blue hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className="text-center text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-spaceteens-blue hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-spaceteens-blue hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
