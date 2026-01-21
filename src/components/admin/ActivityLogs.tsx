import { useState } from 'react';
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
import { Search, Activity, Filter, RefreshCw, Download } from 'lucide-react';
import { format } from 'date-fns';

export function ActivityLogs() {
  const { activityLogs, users, loading, refetch } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  // Get unique actions for filter
  const uniqueActions = [...new Set(activityLogs.map(log => log.action))];

  const filteredLogs = activityLogs.filter(log => {
    const user = users.find(u => u.user_id === log.user_id);
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    if (action.includes('created')) return 'bg-success/20 text-success border-success/30';
    if (action.includes('updated')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (action.includes('deleted')) return 'bg-destructive/20 text-destructive border-destructive/30';
    if (action.includes('login')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    return 'bg-muted text-muted-foreground';
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'Details'].join(','),
      ...filteredLogs.map(log => {
        const user = users.find(u => u.user_id === log.user_id);
        return [
          log.created_at,
          user?.email || 'System',
          log.action,
          log.entity_type || '',
          log.entity_id || '',
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
          </div>
        ) : (
          filteredLogs.map((log) => {
            const user = users.find(u => u.user_id === log.user_id);
            return (
              <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={getActionColor(log.action)}>
                        {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      {log.entity_type && (
                        <span className="text-xs text-muted-foreground">
                          on {log.entity_type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{user?.full_name || user?.email || 'System'}</span>
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
      </p>
    </div>
  );
}
