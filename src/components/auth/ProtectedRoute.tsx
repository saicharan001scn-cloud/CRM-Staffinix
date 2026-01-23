import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Only show loading during initial auth check, not on subsequent navigations
  // The App-level Suspense handles lazy-loaded page transitions
  if (loading) {
    return null; // Return null to let parent Suspense handle loading state
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
