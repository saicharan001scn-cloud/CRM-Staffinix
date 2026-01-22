import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Activity, 
  Server, 
  Shield,
  Plus,
  Bell,
  FileText,
  RefreshCw,
  Crown,
  UserPlus,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface PlatformStats {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  adminCount: number;
  regularUserCount: number;
  newUsersThisMonth: number;
  activeSessionsToday: number;
}

interface RecentActivity {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  user_email?: string;
}

export function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlatformStats>({
    totalCompanies: 0,
    activeCompanies: 0,
    totalUsers: 0,
    adminCount: 0,
    regularUserCount: 0,
    newUsersThisMonth: 0,
    activeSessionsToday: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    setLoading(true);
    try {
      // Fetch user counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, created_at, account_status');

      // Fetch role counts
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role');

      // Fetch recent activity
      const { data: activity, error: activityError } = await supabase
        .from('activity_logs')
        .select('id, action, entity_type, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch login history for active sessions
      const { data: logins, error: loginsError } = await supabase
        .from('login_history')
        .select('id')
        .gte('login_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (profiles && roles) {
        const adminCount = roles.filter(r => r.role === 'admin').length;
        const superAdminCount = roles.filter(r => r.role === 'super_admin').length;
        const userCount = roles.filter(r => r.role === 'user').length;
        
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);
        
        const newThisMonth = profiles.filter(p => 
          new Date(p.created_at) >= thisMonthStart
        ).length;

        const activeProfiles = profiles.filter(p => p.account_status === 'active').length;

        setStats({
          totalCompanies: adminCount, // Each admin represents a "company" in this model
          activeCompanies: adminCount,
          totalUsers: profiles.length,
          adminCount: adminCount + superAdminCount,
          regularUserCount: userCount,
          newUsersThisMonth: newThisMonth,
          activeSessionsToday: logins?.length || 0,
        });
      }

      if (activity) {
        setRecentActivity(activity);
      }
    } catch (error) {
      console.error('Error fetching platform data:', error);
    } finally {
      setLoading(false);
    }
  };

  const platformMetrics = [
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      icon: Building2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      description: 'Active admin accounts'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      description: 'All platform users'
    },
    {
      title: 'Platform Admins',
      value: stats.adminCount,
      icon: Shield,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      description: 'Admin & Super Admin'
    },
    {
      title: 'New This Month',
      value: stats.newUsersThisMonth,
      icon: UserPlus,
      color: 'text-success',
      bg: 'bg-success/10',
      description: 'User registrations'
    },
  ];

  const systemHealth = {
    apiUptime: '99.9%',
    avgResponse: '120ms',
    activeSessions: stats.activeSessionsToday,
    storageUsed: '45GB',
  };

  const quickActions = [
    { label: 'Add New Company', icon: Plus, action: () => navigate('/admin?tab=users') },
    { label: 'Send Announcement', icon: Bell, action: () => {} },
    { label: 'View System Logs', icon: FileText, action: () => navigate('/admin?tab=activity') },
    { label: 'Manage Roles', icon: Shield, action: () => navigate('/admin?tab=roles') },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-4" />
              <div className="h-8 bg-muted rounded w-1/3" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview Banner */}
      <Card className="p-6 bg-gradient-to-r from-amber-500/10 via-primary/10 to-blue-500/10 border-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Platform Overview</h2>
              <p className="text-sm text-muted-foreground">
                Super Admin Dashboard • Managing {stats.totalCompanies} companies
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPlatformData}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Platform Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {platformMetrics.map((metric, index) => (
          <Card 
            key={metric.title} 
            className="p-6 animate-slide-up opacity-0"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{metric.title}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </div>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", metric.bg)}>
                <metric.icon className={cn("w-5 h-5", metric.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">System Health</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">API Uptime</span>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                {systemHealth.apiUptime}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Avg Response</span>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                {systemHealth.avgResponse}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Active Sessions</span>
              </div>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                {systemHealth.activeSessions}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Storage Used</span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {systemHealth.storageUsed}
              </Badge>
            </div>
          </div>
        </Card>

        {/* User Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">User Distribution</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Regular Users</span>
                <span className="text-sm font-medium">{stats.regularUserCount}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalUsers > 0 ? (stats.regularUserCount / stats.totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Administrators</span>
                <span className="text-sm font-medium">{stats.adminCount}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalUsers > 0 ? (stats.adminCount / stats.totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Growth This Month</span>
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  +{stats.newUsersThisMonth} users
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="w-full justify-start gap-3 h-10"
                onClick={action.action}
              >
                <action.icon className="w-4 h-4 text-muted-foreground" />
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Platform Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Recent Platform Activity</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin?tab=activity')}
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.entity_type} • {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </Card>

      {/* Confidentiality Notice */}
      <Card className="p-4 border-amber-500/30 bg-amber-500/5">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Data Privacy Notice</p>
            <p className="text-xs text-muted-foreground">
              Individual company analytics and operational data are confidential. 
              This dashboard shows only platform-level aggregated metrics.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
