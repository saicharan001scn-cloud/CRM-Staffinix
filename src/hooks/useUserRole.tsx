import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'super_admin' | 'admin' | 'user' | null;

interface UserRoleState {
  role: AppRole;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  refetch: () => Promise<void>;
}

export function useUserRole(): UserRoleState {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async () => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Use the database function to get user's highest role
      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: user.id });

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('user'); // Default to user role on error
      } else {
        setRole(data as AppRole || 'user');
      }
    } catch (error) {
      console.error('Error in useUserRole:', error);
      setRole('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [user?.id]);

  return {
    role,
    loading,
    isAdmin: role === 'admin' || role === 'super_admin',
    isSuperAdmin: role === 'super_admin',
    refetch: fetchRole,
  };
}

// Hook to log activity
export function useActivityLogger() {
  const { user } = useAuth();

  const logActivity = async (
    action: string,
    entityType?: string,
    entityId?: string,
    details?: Record<string, unknown>
  ) => {
    if (!user) return;

    try {
      const insertData = {
        user_id: user.id,
        action,
        entity_type: entityType || null,
        entity_id: entityId || null,
        details: details ? JSON.parse(JSON.stringify(details)) : null,
        user_agent: navigator.userAgent,
      };
      await supabase.from('activity_logs').insert([insertData]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return { logActivity };
}
