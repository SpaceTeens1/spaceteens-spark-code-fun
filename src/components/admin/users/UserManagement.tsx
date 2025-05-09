
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import UserTable from './UserTable';
import CreateUserForm from './CreateUserForm';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_super_admin: boolean;
  created_at?: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const { profile, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure is_super_admin property exists on each user
      const processedUsers = (data || []).map(user => ({
        ...user,
        is_super_admin: user.is_super_admin || false
      })) as User[];
      
      setUsers(processedUsers);
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

  // Check if current user is super admin
  const currentUserIsSuperAdmin = isSuperAdmin();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-spaceteens-blue">User Management</h2>
      </div>

      {currentUserIsSuperAdmin && (
        <CreateUserForm onUserCreated={fetchUsers} />
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">All Users</h3>
        
        <UserTable 
          users={users}
          isLoading={isLoading}
          currentUserIsSuperAdmin={currentUserIsSuperAdmin}
          currentUserId={profile?.id}
          onUsersUpdate={fetchUsers}
        />
      </div>
    </div>
  );
};

export default UserManagement;
