import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';
import type { 
  UserWithRole, 
  ActivityLog, 
  LoginHistory, 
  AdminStats,
  AppRole,
  AccountStatus 
} from '@/types/admin';

export function useAdminData() {
  const { user } = useAuth();
  const { isAdmin, isSuperAdmin } = useUserRole();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;

    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const userRoles = roles?.filter(r => r.user_id === profile.user_id) || [];
        const highestRole = userRoles.sort((a, b) => {
          const order: Record<string, number> = { super_admin: 1, admin: 2, user: 3 };
          return (order[a.role] || 4) - (order[b.role] || 4);
        })[0];

        return {
          ...profile,
          account_status: (profile.account_status as AccountStatus) || 'active',
          role: (highestRole?.role as AppRole) || 'user',
          roles: userRoles.map(r => ({
            ...r,
            role: r.role as AppRole
          })),
        };
      });

      setUsers(usersWithRoles);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
  }, [isAdmin]);

  const fetchActivityLogs = useCallback(async (limit = 50) => {
    if (!isAdmin) return;

    try {
      const { data, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (logsError) throw logsError;
      setActivityLogs((data || []).map(log => ({
        ...log,
        details: typeof log.details === 'object' && log.details !== null 
          ? log.details as Record<string, unknown> 
          : null,
      })));
    } catch (err) {
      console.error('Error fetching activity logs:', err);
    }
  }, [isAdmin]);

  const fetchLoginHistory = useCallback(async (limit = 50) => {
    if (!isAdmin) return;

    try {
      const { data, error: historyError } = await supabase
        .from('login_history')
        .select('*')
        .order('login_at', { ascending: false })
        .limit(limit);

      if (historyError) throw historyError;
      setLoginHistory(data || []);
    } catch (err) {
      console.error('Error fetching login history:', err);
    }
  }, [isAdmin]);

  const calculateStats = useCallback(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const stats: AdminStats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.account_status === 'active').length,
      suspendedUsers: users.filter(u => u.account_status === 'suspended').length,
      pendingUsers: users.filter(u => u.account_status === 'pending').length,
      admins: users.filter(u => u.role === 'admin').length,
      superAdmins: users.filter(u => u.role === 'super_admin').length,
      recentLogins: loginHistory.filter(l => new Date(l.login_at) > last24h).length,
      recentActivities: activityLogs.filter(a => new Date(a.created_at) > last24h).length,
    };

    setStats(stats);
  }, [users, loginHistory, activityLogs]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchUsers(), fetchActivityLogs(), fetchLoginHistory()]);
    setLoading(false);
  }, [fetchUsers, fetchActivityLogs, fetchLoginHistory]);

  useEffect(() => {
    if (isAdmin && user) {
      refetch();
    }
  }, [isAdmin, user]);

  useEffect(() => {
    calculateStats();
  }, [users, loginHistory, activityLogs, calculateStats]);

  // Update user status
  const updateUserStatus = async (userId: string, status: AccountStatus) => {
    if (!isSuperAdmin) {
      setError('Only super admins can update user status');
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ account_status: status })
        .eq('user_id', userId);

      if (error) throw error;

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: 'updated_user_status',
        entity_type: 'user',
        entity_id: userId,
        details: { new_status: status },
      });

      await fetchUsers();
      return true;
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
      return false;
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, newRole: AppRole) => {
    if (!isSuperAdmin) {
      setError('Only super admins can update user roles');
      return false;
    }

    try {
      // Delete existing roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole,
          assigned_by: user?.id,
        });

      if (error) throw error;

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: 'updated_user_role',
        entity_type: 'user',
        entity_id: userId,
        details: { new_role: newRole },
      });

      await fetchUsers();
      return true;
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
      return false;
    }
  };

  return {
    users,
    activityLogs,
    loginHistory,
    stats,
    loading,
    error,
    refetch,
    updateUserStatus,
    updateUserRole,
    isSuperAdmin,
  };
}
