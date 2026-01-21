import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminData } from '@/hooks/useAdminData';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Shield, 
  ShieldCheck,
  Activity,
  LogIn,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';

export function AdminDashboard() {
  const { stats, activityLogs, loginHistory, loading, refetch, users } = useAdminData();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-20 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'Active Users', 
      value: stats?.activeUsers || 0, 
      icon: UserCheck, 
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    { 
      label: 'Suspended', 
      value: stats?.suspendedUsers || 0, 
      icon: UserX, 
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    { 
      label: 'Pending', 
      value: stats?.pendingUsers || 0, 
      icon: Clock, 
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    { 
      label: 'Admins', 
      value: stats?.admins || 0, 
      icon: Shield, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Super Admins', 
      value: stats?.superAdmins || 0, 
      icon: ShieldCheck, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    { 
      label: 'Logins (24h)', 
      value: stats?.recentLogins || 0, 
      icon: LogIn, 
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    { 
      label: 'Activities (24h)', 
      value: stats?.recentActivities || 0, 
      icon: Activity, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">System Overview</h2>
          <p className="text-sm text-muted-foreground">Real-time statistics and monitoring</p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Activity
            </h3>
            <Badge variant="outline" className="text-xs">{activityLogs.length} events</Badge>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activityLogs.slice(0, 10).map((log) => {
              const userProfile = users.find(u => u.user_id === log.user_id);
              return (
                <div key={log.id} className="flex items-start gap-3 p-2 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile?.full_name || userProfile?.email || 'System'} • {format(new Date(log.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
            {activityLogs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </Card>

        {/* Recent Logins */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <LogIn className="w-4 h-4 text-primary" />
              Recent Logins
            </h3>
            <Badge variant="outline" className="text-xs">{loginHistory.length} logins</Badge>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {loginHistory.slice(0, 10).map((login) => {
              const userProfile = users.find(u => u.user_id === login.user_id);
              return (
                <div key={login.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full ${login.success ? 'bg-success/20' : 'bg-destructive/20'} flex items-center justify-center shrink-0`}>
                    {login.success ? (
                      <UserCheck className="w-4 h-4 text-success" />
                    ) : (
                      <UserX className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {userProfile?.full_name || userProfile?.email || 'Unknown User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {login.success ? 'Successful login' : login.failure_reason || 'Failed login'} • {format(new Date(login.login_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <Badge 
                    variant={login.success ? 'default' : 'destructive'} 
                    className="text-[10px] shrink-0"
                  >
                    {login.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              );
            })}
            {loginHistory.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No recent logins</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
