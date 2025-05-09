
import { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_super_admin: boolean;
  created_at?: string;
}

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  currentUserIsSuperAdmin: boolean;
  currentUserId?: string;
  onUsersUpdate: () => void;
}

const UserTable = ({ users, isLoading, currentUserIsSuperAdmin, currentUserId, onUsersUpdate }: UserTableProps) => {
  const { toast } = useToast();
  const [editUser, setEditUser] = useState<User | null>(null);

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

      setEditUser(null);
      onUsersUpdate(); // Trigger refetch of user data
    } catch (error: any) {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  return (
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
                    disabled={user.id === currentUserId} // Prevent editing self
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
  );
};

export default UserTable;
