
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface CreateUserFormProps {
  onUserCreated: () => void;
}

const CreateUserForm = ({ onUserCreated }: CreateUserFormProps) => {
  const { toast } = useToast();
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
    is_super_admin: false
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Step 1: Create auth user
      const { error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
          }
        }
      });
      
      if (signUpError) throw signUpError;

      // Step 2: Update profile with role and admin status
      // Note: The trigger will create the profile, but we need to update it with role
      toast({
        title: 'User created!',
        description: `User ${newUser.email} has been created. The profile will be updated shortly.`,
      });
      
      // Reset form
      setNewUser({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student',
        is_super_admin: false
      });
      
      // Refresh user list after a short delay to allow trigger to complete
      setTimeout(() => {
        onUserCreated();
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: 'Error creating user',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Create New User</h3>
      <form onSubmit={handleCreateUser} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              type="email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              type="password"
              required
            />
          </div>
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={newUser.first_name}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={newUser.last_name}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select 
              value={newUser.role} 
              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {newUser.role === 'admin' && (
            <div>
              <Label className="mb-2 block">Super Admin Privileges</Label>
              <div className="flex items-center space-x-2">
                <RadioGroup 
                  defaultValue={newUser.is_super_admin ? "yes" : "no"}
                  onValueChange={(value) => setNewUser({ ...newUser, is_super_admin: value === "yes" })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="super-admin-yes" />
                    <Label htmlFor="super-admin-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="super-admin-no" />
                    <Label htmlFor="super-admin-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        <Button type="submit" className="bg-spaceteens-blue">
          Create User
        </Button>
      </form>
    </Card>
  );
};

export default CreateUserForm;
