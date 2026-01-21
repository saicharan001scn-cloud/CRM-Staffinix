import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminData } from '@/hooks/useAdminData';
import { usePermissions } from '@/hooks/usePermissions';
import { ActivityFilter, ActivityScope } from './ActivityFilter';
import { Search, Activity, Filter, RefreshCw, Download, Crown, Shield, User } from 'lucide-react';
import { format } from 'date-fns';

export function ActivityLogs() {
  const { activityLogs, users, loading, refetch } = useAdminData();
  const { isSuperAdmin, isAdmin } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [activityScope, setActivityScope] = useState<ActivityScope>('self');

  // Get unique actions for filter
  const uniqueActions = [...new Set(activityLogs.map(log => log.action))];

  // Filter logs based on activity scope and role
  const scopeFilteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      // Hide super admin activities from non-super admins
      if (!isSuperAdmin && (log as any).is_super_admin_activity) {
        return false;
      }

      // Apply scope filter
      switch (activityScope) {
        case 'self':
          return log.user_id === users.find(u => u.email)?.user_id;
        case 'team':
          // Show activities by users created by current admin
          // Or activities on users created by current admin
          return true; // RLS handles this at the database level
        case 'all':
          return isSuperAdmin; // Only super admins can see all
        default:
          return true;
      }
    });
  }, [activityLogs, activityScope, isSuperAdmin, users]);

  const filteredLogs = scopeFilteredLogs.filter(log => {
    const user = users.find(u => u.user_id === log.user_id);
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  // Calculate activity counts for filter badges
  const activityCounts = useMemo(() => ({
    self: activityLogs.filter(log => !((log as any).is_super_admin_activity && !isSuperAdmin)).length,
    team: activityLogs.filter(log => !((log as any).is_super_admin_activity && !isSuperAdmin)).length,
    all: isSuperAdmin ? activityLogs.length : 0,
  }), [activityLogs, isSuperAdmin]);

  const getActionColor = (action: string) => {
    if (action.includes('created')) return 'bg-success/20 text-success border-success/30';
    if (action.includes('updated')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (action.includes('deleted')) return 'bg-destructive/20 text-destructive border-destructive/30';
    if (action.includes('login')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (action.includes('granted') || action.includes('analytics')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (action.includes('revoked') || action.includes('suspended')) return 'bg-warning/20 text-warning border-warning/30';
    return 'bg-muted text-muted-foreground';
  };

  const getPerformerIcon = (log: any) => {
    const performerRole = log.performer_role;
    if (performerRole === 'super_admin') {
      return <Crown className="w-4 h-4 text-amber-400" />;
    }
    if (performerRole === 'admin') {
      return <Shield className="w-4 h-4 text-blue-400" />;
    }
    return <User className="w-4 h-4 text-muted-foreground" />;
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'Visibility', 'Details'].join(','),
      ...filteredLogs.map(log => {
        const user = users.find(u => u.user_id === log.user_id);
        return [
          log.created_at,
          user?.email || 'System',
          log.action,
          log.entity_type || '',
          log.entity_id || '',
          (log as any).visibility_scope || 'team',
          JSON.stringify(log.details || {}),
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Activity Scope Filter */}
      <ActivityFilter
        selectedScope={activityScope}
        onScopeChange={setActivityScope}
        activityCounts={activityCounts}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>
                  {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <Card className="divide-y divide-border">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No activity logs found</p>
            <p className="text-sm mt-1">
              {activityScope === 'self' && 'Try switching to Team or All activities'}
              {activityScope === 'team' && 'No team activity yet'}
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const user = users.find(u => u.user_id === log.user_id);
            const targetUser = (log as any).target_user_id 
              ? users.find(u => u.user_id === (log as any).target_user_id)
              : null;
            
            return (
              <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    (log as any).performer_role === 'super_admin'
                      ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20'
                      : (log as any).performer_role === 'admin'
                      ? 'bg-blue-500/20'
                      : 'bg-primary/20'
                  }`}>
                    {getPerformerIcon(log)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className={getActionColor(log.action)}>
                        {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      {log.entity_type && (
                        <span className="text-xs text-muted-foreground">
                          on {log.entity_type}
                        </span>
                      )}
                      {(log as any).is_super_admin_activity && (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                          Super Admin
                        </Badge>
                      )}
                      {(log as any).visibility_scope === 'private' && (
                        <Badge variant="outline" className="text-xs">
                          Private
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{user?.full_name || user?.email || 'System'}</span>
                      {targetUser && (
                        <span className="text-muted-foreground">
                          {' → '}<span className="text-foreground">{targetUser.full_name || targetUser.email}</span>
                        </span>
                      )}
                      {log.details && typeof log.details === 'object' && (
                        <span className="text-muted-foreground">
                          {' — '}
                          {Object.entries(log.details)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}</span>
                      {log.ip_address && <span>IP: {log.ip_address}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </Card>

      {/* Pagination hint */}
      <p className="text-xs text-muted-foreground text-center">
        Showing {filteredLogs.length} of {activityLogs.length} activities
        {!isSuperAdmin && ' (filtered by your permissions)'}
      </p>
    </div>
  );
}
