import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

export function AdminRoute({ children, requireSuperAdmin = false }: AdminRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, isAdmin, isSuperAdmin } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = requireSuperAdmin ? isSuperAdmin : isAdmin;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. 
            {requireSuperAdmin 
              ? ' Super Admin privileges are required.' 
              : ' Admin privileges are required.'}
          </p>
          <p className="text-sm text-muted-foreground">
            Current role: <span className="font-medium text-foreground capitalize">{role || 'User'}</span>
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
