import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { CompanyAdmin } from '@/types/companyAdmin';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  TrendingUp,
  TrendingDown,
  Shield,
  Database,
  HeadphonesIcon,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Circle,
} from 'lucide-react';

interface CompanyOverviewProps {
  admin: CompanyAdmin;
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("bg-muted/30", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-xs mt-1",
                trend.isPositive ? "text-green-400" : "text-red-400"
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{trend.isPositive ? '+' : ''}{trend.value}% this month</span>
              </div>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CompanyOverview({ admin, loading }: CompanyOverviewProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Trial</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      case 'past_due':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Past Due</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getHealthStatus = () => {
    if (admin.company_status === 'active' && admin.account_status === 'active') {
      return { label: 'Good', color: 'text-green-400', icon: <CheckCircle className="h-4 w-4" /> };
    }
    if (admin.company_status === 'trial' || admin.company_status === 'past_due') {
      return { label: 'Warning', color: 'text-amber-400', icon: <AlertTriangle className="h-4 w-4" /> };
    }
    return { label: 'Critical', color: 'text-red-400', icon: <XCircle className="h-4 w-4" /> };
  };

  const health = getHealthStatus();

  // Mock data for demo - these would come from real API
  const mockStats = {
    totalUsers: Math.floor(Math.random() * 50) + 5,
    totalAdmins: Math.floor(Math.random() * 3) + 1,
    activeUsers: Math.floor(Math.random() * 20) + 1,
    userGrowth: Math.floor(Math.random() * 30) - 10,
    totalBilled: `$${(Math.random() * 10000).toFixed(2)}`,
    plan: 'Professional',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    mfaEnabled: Math.random() > 0.5,
    lastBackup: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    openTickets: Math.floor(Math.random() * 5),
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{admin.company_name || 'Unknown Company'}</h2>
            <div className="flex items-center gap-3 mt-1">
              {getStatusBadge(admin.company_status)}
              <span className="text-sm text-muted-foreground">
                ID: {admin.subscription_id?.slice(0, 8) || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <Circle className={cn(
                  "h-2 w-2 fill-current",
                  admin.is_online ? "text-green-400" : "text-gray-400"
                )} />
                Admin {admin.is_online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", 
          health.color === 'text-green-400' ? 'bg-green-500/10' : 
          health.color === 'text-amber-400' ? 'bg-amber-500/10' : 'bg-red-500/10'
        )}>
          <span className={health.color}>{health.icon}</span>
          <span className={cn("font-medium", health.color)}>Account Health: {health.label}</span>
        </div>
      </div>

      {/* Company & Admin Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Company Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Admin Email:</span>
                <span>{admin.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span>N/A</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Address:</span>
                <span>N/A</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span>{admin.created_at ? format(new Date(admin.created_at), 'MMM d, yyyy') : 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Service Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">Current Plan:</span>
                <Badge variant="outline">{mockStats.plan}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">Next Billing:</span>
                <span>{format(mockStats.nextBillingDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">Total Billed:</span>
                <span className="font-medium">{mockStats.totalBilled}</span>
              </div>
              {admin.trial_ends_at && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">Trial Ends:</span>
                  <span className="text-amber-400">
                    {formatDistanceToNow(new Date(admin.trial_ends_at), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={mockStats.totalUsers}
          icon={<Users className="h-5 w-5 text-primary" />}
          trend={{ value: mockStats.userGrowth, isPositive: mockStats.userGrowth > 0 }}
        />
        <StatCard
          label="Total Admins"
          value={mockStats.totalAdmins}
          icon={<Shield className="h-5 w-5 text-primary" />}
        />
        <StatCard
          label="Active Now"
          value={mockStats.activeUsers}
          icon={<Circle className="h-5 w-5 text-green-400 fill-green-400" />}
        />
        <StatCard
          label="Open Tickets"
          value={mockStats.openTickets}
          icon={<HeadphonesIcon className="h-5 w-5 text-primary" />}
        />
      </div>

      {/* Quick Status Indicators */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
          <Shield className={cn("h-4 w-4", mockStats.mfaEnabled ? "text-green-400" : "text-amber-400")} />
          <span className="text-sm">
            MFA: <span className={mockStats.mfaEnabled ? "text-green-400" : "text-amber-400"}>
              {mockStats.mfaEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Last Backup: {formatDistanceToNow(mockStats.lastBackup, { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Last Login: {admin.last_login 
              ? formatDistanceToNow(new Date(admin.last_login), { addSuffix: true })
              : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
}
