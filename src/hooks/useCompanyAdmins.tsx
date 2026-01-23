import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CompanyAdmin, CompanyAdminFilters } from '@/types/companyAdmin';

export function useCompanyAdmins() {
  const [admins, setAdmins] = useState<CompanyAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CompanyAdminFilters>({
    search: '',
    status: 'all',
  });

  const fetchCompanyAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all users with admin role
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      const adminUserIds = roles?.map(r => r.user_id) || [];

      if (adminUserIds.length === 0) {
        setAdmins([]);
        setLoading(false);
        return;
      }

      // Fetch profiles for these admins
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', adminUserIds);

      if (profilesError) throw profilesError;

      // Fetch company subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from('company_subscriptions')
        .select('*');

      if (subsError) throw subsError;

      // Combine data
      const companyAdmins: CompanyAdmin[] = (profiles || []).map(profile => {
        // Find matching subscription by admin_user_id or company_name
        const subscription = subscriptions?.find(
          s => s.admin_user_id === profile.user_id || 
               s.company_name === profile.company_name
        );

        // Simulate online status based on last_login (within 15 minutes = online)
        const isOnline = profile.last_login 
          ? new Date().getTime() - new Date(profile.last_login).getTime() < 15 * 60 * 1000
          : false;

        return {
          id: profile.id,
          user_id: profile.user_id,
          email: profile.email,
          full_name: profile.full_name,
          company_name: profile.company_name,
          avatar_url: profile.avatar_url,
          last_login: profile.last_login,
          account_status: profile.account_status || 'active',
          created_at: profile.created_at,
          company_status: subscription?.status as CompanyAdmin['company_status'] || 'active',
          trial_ends_at: subscription?.trial_ends_at,
          subscription_id: subscription?.id,
          is_online: isOnline,
        };
      });

      setAdmins(companyAdmins);
    } catch (err) {
      console.error('Error fetching company admins:', err);
      setError('Failed to fetch company admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyAdmins();
  }, [fetchCompanyAdmins]);

  // Filter admins based on search and status
  const filteredAdmins = admins.filter(admin => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        admin.full_name?.toLowerCase().includes(searchLower) ||
        admin.email?.toLowerCase().includes(searchLower) ||
        admin.company_name?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all') {
      if (admin.company_status !== filters.status) return false;
    }

    return true;
  });

  // Get counts for quick filters
  const statusCounts = {
    all: admins.length,
    active: admins.filter(a => a.company_status === 'active').length,
    trial: admins.filter(a => a.company_status === 'trial').length,
    suspended: admins.filter(a => a.company_status === 'suspended').length,
    past_due: admins.filter(a => a.company_status === 'past_due').length,
    cancelled: admins.filter(a => a.company_status === 'cancelled').length,
  };

  // Get admins needing attention (trial ending soon, suspended, past_due)
  const needsAttention = admins.filter(admin => {
    if (admin.company_status === 'suspended' || admin.company_status === 'past_due') {
      return true;
    }
    if (admin.company_status === 'trial' && admin.trial_ends_at) {
      const daysUntilExpiry = Math.ceil(
        (new Date(admin.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 7;
    }
    return false;
  });

  return {
    admins: filteredAdmins,
    allAdmins: admins,
    loading,
    error,
    filters,
    setFilters,
    statusCounts,
    needsAttention,
    refetch: fetchCompanyAdmins,
  };
}
