
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password',
    });
    
    if (error) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setIsSubmitted(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for a password reset link",
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
          <h1 className="text-3xl font-bold text-spaceteens-blue">Reset Password</h1>
          <p className="text-gray-600 mt-2">We'll email you instructions to reset your password</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
            <form onSubmit={handleReset}>
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
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"
                  className="w-full bg-spaceteens-blue hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4 text-center py-8">
              <div className="bg-green-50 text-green-800 p-4 rounded-md">
                <p className="font-medium">Reset link sent!</p>
                <p className="text-sm mt-1">Check your inbox for further instructions.</p>
              </div>
            </CardContent>
          )}
        </Card>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="text-spaceteens-blue hover:underline">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
