import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

interface OperationalRouteProps {
  children: ReactNode;
}

/**
 * OperationalRoute - Protects operational pages from Super Admin access
 * 
 * Super Admins should focus on platform management, not company operations.
 * This route component redirects Super Admins to their platform dashboard.
 * 
 * Protected pages:
 * - Consultants
 * - Jobs
 * - Vendors
 * - Submissions
 * - Email Automation
 * - AI Assistant
 */
export function OperationalRoute({ children }: OperationalRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isSuperAdmin, loading: permissionsLoading } = usePermissions();
  
  // Combined loading check - return null to let parent Suspense handle it
  // This prevents flickering between different loading states
  if (authLoading || permissionsLoading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect Super Admin away from operational pages
  if (isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
