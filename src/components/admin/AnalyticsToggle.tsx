import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useActivityLogger } from '@/hooks/useUserRole';
import { Lock, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AppRole } from '@/types/admin';

interface AnalyticsToggleProps {
  userId: string;
  userRole?: AppRole;
  currentState: boolean;
  createdBy?: string | null;
  onChange?: (enabled: boolean) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

export function AnalyticsToggle({
  userId,
  userRole,
  currentState,
  createdBy,
  onChange,
  disabled = false,
  showLabel = false,
}: AnalyticsToggleProps) {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = usePermissions();
  const { logActivity } = useActivityLogger();
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(currentState);

  // Determine if current user can modify this user's analytics access
  const isInheritedAccess = userRole === 'admin' || userRole === 'super_admin';
  const canModify = isSuperAdmin || (isAdmin && createdBy === user?.id);
  const isLocked = isInheritedAccess || (!canModify && !isSuperAdmin);

  const handleToggle = async (checked: boolean) => {
    if (isLocked || disabled || loading) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          can_view_analytics: checked,
          analytics_access_granted_by: user?.id,
          analytics_access_granted_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      setEnabled(checked);
      onChange?.(checked);
      
      await logActivity(
        checked ? 'granted_analytics_access' : 'revoked_analytics_access',
        'user',
        userId,
        { new_value: checked }
      );

      toast.success(checked ? 'Analytics access granted' : 'Analytics access revoked');
    } catch (error) {
      console.error('Error toggling analytics access:', error);
      toast.error('Failed to update analytics access');
    } finally {
      setLoading(false);
    }
  };

  const getTooltipContent = () => {
    if (isInheritedAccess) {
      return 'Analytics access is inherited from role (Admins always have access)';
    }
    if (!canModify) {
      return 'You can only manage users you created';
    }
    return enabled ? 'Revoke analytics access' : 'Grant analytics access';
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          {showLabel && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BarChart2 className="w-3 h-3" />
              Analytics
            </span>
          )}
          <div className="relative">
            {isLocked ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs">
                <Lock className="w-3 h-3" />
                <span>Inherited</span>
              </div>
            ) : (
              <Switch
                checked={isInheritedAccess || enabled}
                onCheckedChange={handleToggle}
                disabled={disabled || loading || isLocked}
                className={`
                  ${enabled ? 'bg-success' : 'bg-muted'}
                  ${loading ? 'opacity-50 cursor-wait' : ''}
                `}
              />
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{getTooltipContent()}</p>
      </TooltipContent>
    </Tooltip>
  );
}
