
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('spaceteens.eg@gmail.com');
  const [password, setPassword] = useState('spaceteens123');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signOut, isAdmin, profile, cleanupAuthState } = useAuth();

  useEffect(() => {
    // Clean up any existing auth state on component mount
    cleanupAuthState();

    // If user is already logged in and is an admin, redirect to dashboard
    if (profile && isAdmin()) {
      navigate('/admin');
    }
  }, [profile, navigate, isAdmin, cleanupAuthState]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // First attempt to sign out to clear any existing sessions
    try {
      await signOut();
    } catch (error) {
      console.log('Pre-login signout error (non-critical):', error);
    }

    const { error, user } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    
    // After successful login, ensure the role is set to admin
    if (user) {
      // Update the profile to be an admin and super admin
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: 'admin',
            is_super_admin: true
          })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
        
        // Wait a moment for the profile to update before checking admin status
        setTimeout(async () => {
          toast({
            title: 'Login successful',
            description: 'Welcome to the admin dashboard',
          });
          navigate('/admin');
          setIsLoading(false);
        }, 1000);
      } catch (updateError: any) {
        toast({
          title: 'Error updating privileges',
          description: updateError.message,
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } else {
      toast({
        title: 'Login failed',
        description: "Couldn't complete login process",
        variant: 'destructive',
      });
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-spaceteens-blue">Admin Login</h1>
          <p className="text-gray-600 mt-2">Enter your credentials to access the admin area</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Manage your courses, students, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleLogin}
              className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700">
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700">
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
              disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-spaceteens-blue hover:underline">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
