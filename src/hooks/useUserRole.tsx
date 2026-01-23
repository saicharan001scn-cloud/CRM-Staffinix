import { useState, useEffect, createContext, useContext, ReactNode, useCallback, useRef } from 'react';
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

interface UserRoleProviderProps {
  children: ReactNode;
}

const UserRoleContext = createContext<UserRoleState | undefined>(undefined);

export function UserRoleProvider({ children }: UserRoleProviderProps) {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const fetchedUserIdRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchRole = useCallback(async () => {
    if (!user) {
      setRole(null);
      setRoleLoading(false);
      fetchedUserIdRef.current = null;
      return;
    }

    // Skip if already fetched for this user and not a manual refetch
    if (fetchedUserIdRef.current === user.id && role !== null) {
      setRoleLoading(false);
      return;
    }

    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      // Don't set loading to true if we already have a cached role - prevents flicker
      if (fetchedUserIdRef.current !== user.id) {
        setRoleLoading(true);
      }
      
      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: user.id });

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } else {
        setRole(data as AppRole || 'user');
      }
      fetchedUserIdRef.current = user.id;
    } catch (error) {
      console.error('Error in useUserRole:', error);
      setRole('user');
    } finally {
      isFetchingRef.current = false;
      setRoleLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    // Wait for auth to complete before fetching role
    if (authLoading) {
      return;
    }
    
    fetchRole();
  }, [user?.id, authLoading, fetchRole]);

  const value: UserRoleState = {
    role,
    loading: authLoading || roleLoading,
    isAdmin: role === 'admin' || role === 'super_admin',
    isSuperAdmin: role === 'super_admin',
    refetch: async () => {
      fetchedUserIdRef.current = null; // Force refetch
      await fetchRole();
    },
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole(): UserRoleState {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}

// Enhanced activity logger with visibility support
export function useActivityLogger() {
  const { user } = useAuth();
  const { role, isSuperAdmin } = useUserRole();

  const logActivity = async (
    action: string,
    entityType?: string,
    entityId?: string,
    details?: Record<string, unknown>,
    targetUserId?: string
  ) => {
    if (!user) return;

    try {
      // Fetch current user's created_by chain
      let createdByChain: string[] = [];
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_by')
        .eq('user_id', user.id)
        .single();
      
      if (profile?.created_by) {
        createdByChain = [profile.created_by];
      }

      const insertData = {
        user_id: user.id,
        action,
        entity_type: entityType || null,
        entity_id: entityId || null,
        details: details ? JSON.parse(JSON.stringify(details)) : null,
        user_agent: navigator.userAgent,
        // New visibility fields
        visibility_scope: isSuperAdmin ? 'global' : 'team',
        is_super_admin_activity: isSuperAdmin,
        target_user_id: targetUserId || null,
        performer_role: role,
        created_by_chain: createdByChain,
      };
      await supabase.from('activity_logs').insert([insertData]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return { logActivity };
}
