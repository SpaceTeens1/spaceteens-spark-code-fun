
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_super_admin: boolean;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const { profile, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
    is_super_admin: false
  });

  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        fetchUsers();
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: 'Error creating user',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleUpdateRole = async (userId: string, role: string, is_super_admin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role, is_super_admin })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'User updated',
        description: 'User role has been updated successfully'
      });

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role, is_super_admin } : user
      ));
      
      setEditUser(null);
    } catch (error: any) {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Check if current user is super admin
  const currentUserIsSuperAdmin = isSuperAdmin();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-spaceteens-blue">User Management</h2>
      </div>

      {currentUserIsSuperAdmin && (
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
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">All Users</h3>
        
        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Super Admin</TableHead>
                {currentUserIsSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {editUser && editUser.id === user.id ? (
                      <Select 
                        value={editUser.role} 
                        onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editUser && editUser.id === user.id ? (
                      <RadioGroup 
                        value={editUser.is_super_admin ? "yes" : "no"}
                        onValueChange={(value) => setEditUser({ ...editUser, is_super_admin: value === "yes" })}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="yes" id={`super-admin-yes-${user.id}`} />
                          <Label htmlFor={`super-admin-yes-${user.id}`} className="text-xs">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="no" id={`super-admin-no-${user.id}`} />
                          <Label htmlFor={`super-admin-no-${user.id}`} className="text-xs">No</Label>
                        </div>
                      </RadioGroup>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.is_super_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_super_admin ? 'Yes' : 'No'}
                      </span>
                    )}
                  </TableCell>
                  {currentUserIsSuperAdmin && (
                    <TableCell className="text-right">
                      {editUser && editUser.id === user.id ? (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateRole(user.id, editUser.role, editUser.is_super_admin)}
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditUser(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditUser({...user})}
                          disabled={user.id === profile?.id} // Prevent editing self
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
