import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import { User, Users, Globe, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActivityScope = 'self' | 'team' | 'all';

interface ActivityFilterProps {
  selectedScope: ActivityScope;
  onScopeChange: (scope: ActivityScope) => void;
  activityCounts?: {
    self: number;
    team: number;
    all: number;
  };
}

export function ActivityFilter({
  selectedScope,
  onScopeChange,
  activityCounts,
}: ActivityFilterProps) {
  const { isSuperAdmin, isAdmin } = usePermissions();

  const scopes: { value: ActivityScope; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'self',
      label: 'My Activities',
      icon: <User className="w-4 h-4" />,
      description: 'Actions you performed',
    },
    {
      value: 'team',
      label: "Team's Activities",
      icon: <Users className="w-4 h-4" />,
      description: 'Actions by users you created',
    },
    {
      value: 'all',
      label: 'All Activities',
      icon: <Globe className="w-4 h-4" />,
      description: 'All system activities',
    },
  ];

  // Filter available scopes based on role
  const availableScopes = scopes.filter(scope => {
    if (scope.value === 'all') return isSuperAdmin;
    if (scope.value === 'team') return isAdmin || isSuperAdmin;
    return true;
  });

  return (
    <div className="flex flex-wrap gap-2">
      {availableScopes.map(scope => (
        <Button
          key={scope.value}
          variant={selectedScope === scope.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onScopeChange(scope.value)}
          className={cn(
            'gap-2 transition-all',
            selectedScope === scope.value && 'ring-2 ring-primary/30'
          )}
        >
          {scope.icon}
          {scope.label}
          {activityCounts && (
            <Badge 
              variant="secondary" 
              className={cn(
                'ml-1 text-xs px-1.5 py-0',
                selectedScope === scope.value 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted'
              )}
            >
              {activityCounts[scope.value]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}
