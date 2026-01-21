import { ReactNode } from 'react';
import { usePermissions, Permission } from '@/hooks/usePermissions';

interface RoleBasedContentProps {
  children: ReactNode;
  // Show content only if user has specific permission
  requiredPermission?: Permission;
  // Show content only for specific roles
  allowedRoles?: ('super_admin' | 'admin' | 'user')[];
  // Show content only if user does NOT have this role
  excludeRoles?: ('super_admin' | 'admin' | 'user')[];
  // Show content only if user is at least admin
  requireAdmin?: boolean;
  // Show content only for super admin
  requireSuperAdmin?: boolean;
  // Fallback content to show when user doesn't have access
  fallback?: ReactNode;
}

export function RoleBasedContent({
  children,
  requiredPermission,
  allowedRoles,
  excludeRoles,
  requireAdmin,
  requireSuperAdmin,
  fallback = null,
}: RoleBasedContentProps) {
  const { role, loading, hasPermission, isAdmin, isSuperAdmin } = usePermissions();

  if (loading) {
    return null;
  }

  // Check permission if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  // Check allowed roles
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  // Check excluded roles
  if (excludeRoles && role && excludeRoles.includes(role)) {
    return <>{fallback}</>;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>;
  }

  // Check super admin requirement
  if (requireSuperAdmin && !isSuperAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Specific convenience components
export function SuperAdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedContent requireSuperAdmin fallback={fallback}>
      {children}
    </RoleBasedContent>
  );
}

export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedContent requireAdmin fallback={fallback}>
      {children}
    </RoleBasedContent>
  );
}

export function HideFromUsers({ children }: { children: ReactNode }) {
  return (
    <RoleBasedContent excludeRoles={['user']}>
      {children}
    </RoleBasedContent>
  );
}

export function UsersOnly({ children }: { children: ReactNode }) {
  return (
    <RoleBasedContent allowedRoles={['user']}>
      {children}
    </RoleBasedContent>
  );
}
