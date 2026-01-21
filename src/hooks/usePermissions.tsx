import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';

export type Permission = 
  | 'view_admin_panel'
  | 'view_analytics'
  | 'view_all_users'
  | 'view_own_users'
  | 'create_super_admin'
  | 'create_admin'
  | 'create_user'
  | 'edit_any_user'
  | 'edit_own_users'
  | 'delete_any_user'
  | 'delete_own_users'
  | 'suspend_any_user'
  | 'suspend_own_users'
  | 'view_system_settings'
  | 'view_billing'
  | 'export_all_data'
  | 'view_all_analytics'
  | 'view_team_analytics'
  | 'override_admin_changes'
  | 'manage_roles';

// Permission matrix by role
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: [
    'view_admin_panel',
    'view_analytics',
    'view_all_users',
    'create_super_admin',
    'create_admin',
    'create_user',
    'edit_any_user',
    'delete_any_user',
    'suspend_any_user',
    'view_system_settings',
    'view_billing',
    'export_all_data',
    'view_all_analytics',
    'override_admin_changes',
    'manage_roles',
  ],
  admin: [
    'view_admin_panel',
    'view_analytics',
    'view_own_users',
    'create_admin',
    'create_user',
    'edit_own_users',
    'delete_own_users',
    'suspend_own_users',
    'view_team_analytics',
  ],
  user: [
    // Regular users have minimal permissions
  ],
};

export interface PermissionContext {
  role: 'super_admin' | 'admin' | 'user' | null;
  loading: boolean;
  hasPermission: (permission: Permission) => boolean;
  canAccessAdminPanel: boolean;
  canViewAnalytics: boolean;
  canViewAllUsers: boolean;
  canCreateSuperAdmin: boolean;
  canCreateAdmin: boolean;
  canCreateUser: boolean;
  canEditAnyUser: boolean;
  canDeleteAnyUser: boolean;
  canSuspendAnyUser: boolean;
  canViewSystemSettings: boolean;
  canExportAllData: boolean;
  canViewAllAnalytics: boolean;
  canOverrideAdminChanges: boolean;
  canManageRoles: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isRegularUser: boolean;
  getRoleBadgeStyles: () => { bg: string; text: string; border: string };
  getRoleLabel: () => string;
}

export function usePermissions(): PermissionContext {
  const { user } = useAuth();
  const { role, loading, isAdmin, isSuperAdmin } = useUserRole();

  const permissions = useMemo(() => {
    if (!role) return [];
    return ROLE_PERMISSIONS[role] || [];
  }, [role]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const getRoleBadgeStyles = () => {
    switch (role) {
      case 'super_admin':
        return { 
          bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20', 
          text: 'text-amber-400', 
          border: 'border-amber-500/30' 
        };
      case 'admin':
        return { 
          bg: 'bg-blue-500/20', 
          text: 'text-blue-400', 
          border: 'border-blue-500/30' 
        };
      default:
        return { 
          bg: 'bg-muted', 
          text: 'text-muted-foreground', 
          border: 'border-muted' 
        };
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return {
    role: role as 'super_admin' | 'admin' | 'user' | null,
    loading,
    hasPermission,
    canAccessAdminPanel: hasPermission('view_admin_panel'),
    canViewAnalytics: hasPermission('view_analytics'),
    canViewAllUsers: hasPermission('view_all_users'),
    canCreateSuperAdmin: hasPermission('create_super_admin'),
    canCreateAdmin: hasPermission('create_admin'),
    canCreateUser: hasPermission('create_user'),
    canEditAnyUser: hasPermission('edit_any_user'),
    canDeleteAnyUser: hasPermission('delete_any_user'),
    canSuspendAnyUser: hasPermission('suspend_any_user'),
    canViewSystemSettings: hasPermission('view_system_settings'),
    canExportAllData: hasPermission('export_all_data'),
    canViewAllAnalytics: hasPermission('view_all_analytics'),
    canOverrideAdminChanges: hasPermission('override_admin_changes'),
    canManageRoles: hasPermission('manage_roles'),
    isSuperAdmin,
    isAdmin,
    isRegularUser: !isAdmin && !isSuperAdmin,
    getRoleBadgeStyles,
    getRoleLabel,
  };
}
