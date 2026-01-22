import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Loader2 } from 'lucide-react';

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
  
  const isLoading = authLoading || permissionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
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
