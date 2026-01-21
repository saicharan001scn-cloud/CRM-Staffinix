import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, Briefcase, Send, DollarSign, Lock, Info, ShieldX } from 'lucide-react';
import { TeamPerformance } from '@/components/analytics/TeamPerformance';
import { TimeFilter, TimeFilterType } from '@/components/analytics/TimeFilter';
import { DateRange } from 'react-day-picker';
import { subDays, format, differenceInDays } from 'date-fns';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';
import { RoleBasedContent, SuperAdminOnly } from '@/components/layout/RoleBasedContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock data generator based on date range
const generateSubmissionTrend = (dateRange: DateRange | undefined) => {
  if (!dateRange?.from || !dateRange?.to) return [];
  
  const days = differenceInDays(dateRange.to, dateRange.from);
  const dataPoints = Math.min(days, 12);
  const interval = Math.max(1, Math.floor(days / dataPoints));
  
  const data = [];
  for (let i = 0; i < dataPoints; i++) {
    const date = subDays(dateRange.to, (dataPoints - i - 1) * interval);
    data.push({
      name: days <= 14 ? format(date, 'MMM dd') : format(date, 'MMM dd'),
      value: Math.floor(Math.random() * 30) + 35,
    });
  }
  return data;
};

const generateRevenueData = (dateRange: DateRange | undefined) => {
  if (!dateRange?.from || !dateRange?.to) return [];
  
  const days = differenceInDays(dateRange.to, dateRange.from);
  const dataPoints = Math.min(days <= 14 ? 7 : 6, Math.ceil(days / 7));
  
  const data = [];
  for (let i = 0; i < dataPoints; i++) {
    const date = subDays(dateRange.to, (dataPoints - i - 1) * Math.floor(days / dataPoints));
    data.push({
      name: format(date, 'MMM dd'),
      value: Math.floor(Math.random() * 30000) + 40000,
    });
  }
  return data;
};

const vendorPerformance = [
  { name: 'TechStaff', submissions: 156, placements: 23 },
  { name: 'Apex', submissions: 89, placements: 12 },
  { name: 'Global IT', submissions: 67, placements: 8 },
  { name: 'Prime', submissions: 112, placements: 18 },
];

const statusDistribution = [
  { name: 'Available', value: 12, color: 'hsl(var(--success))' },
  { name: 'Bench', value: 8, color: 'hsl(var(--info))' },
  { name: 'Marketing', value: 15, color: 'hsl(var(--warning))' },
  { name: 'Placed', value: 10, color: 'hsl(var(--primary))' },
];

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<TimeFilterType>('weekly');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [hasAnalyticsAccess, setHasAnalyticsAccess] = useState<boolean | null>(null);
  const [loadingAccess, setLoadingAccess] = useState(true);
  
  const { isSuperAdmin, isAdmin, canViewAllAnalytics, canExportAllData } = usePermissions();

  // Check if user has analytics access
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return;
      
      // Admins and Super Admins always have access
      if (isAdmin || isSuperAdmin) {
        setHasAnalyticsAccess(true);
        setLoadingAccess(false);
        return;
      }
      
      // Regular users need can_view_analytics permission
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('can_view_analytics')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        setHasAnalyticsAccess(data?.can_view_analytics || false);
      } catch (error) {
        console.error('Error checking analytics access:', error);
        setHasAnalyticsAccess(false);
      } finally {
        setLoadingAccess(false);
      }
    };
    
    checkAccess();
  }, [user, isAdmin, isSuperAdmin]);

  const submissionTrend = generateSubmissionTrend(dateRange);
  const placementRevenue = generateRevenueData(dateRange);

  // Show access restricted if user doesn't have permission
  if (!loadingAccess && !hasAnalyticsAccess && !isAdmin && !isSuperAdmin) {
    return (
      <MainLayout
        title="Analytics"
        subtitle="Insights and performance metrics"
        showBackButton={false}
      >
        <Card className="p-12 text-center">
          <ShieldX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You don't have permission to view analytics. Contact your administrator to request access.
          </p>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </Card>
      </MainLayout>
    );
  }

  const getFilterLabel = () => {
    switch (activeFilter) {
      case 'weekly':
        return 'Last 7 days';
      case 'monthly':
        return 'Last 30 days';
      case 'quarterly':
        return 'Last 90 days';
      case 'custom':
        return dateRange?.from && dateRange?.to
          ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
          : 'Custom range';
    }
  };

  // Apply restrictions for admins - limit date range options
  const getRestrictedDateRangeOptions = () => {
    if (isSuperAdmin) {
      return ['weekly', 'monthly', 'quarterly', 'custom'] as TimeFilterType[];
    }
    // Admins can only see limited date ranges
    return ['weekly', 'monthly'] as TimeFilterType[];
  };

  const handleExportAll = () => {
    if (!canExportAllData) {
      toast.error("You don't have permission to export all data");
      return;
    }
    toast.success('Exporting all data...');
  };

  return (
    <MainLayout
      title="Analytics"
      subtitle={isAdmin && !isSuperAdmin ? "Team performance metrics" : "Insights and performance metrics"}
      showBackButton={false}
    >
      {/* Admin notice */}
      {isAdmin && !isSuperAdmin && (
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0" />
          <p className="text-sm text-blue-300">
            Viewing team analytics only. Platform-wide statistics are available to Super Admins.
          </p>
        </div>
      )}

      {/* Time Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <TimeFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {getFilterLabel()}
            </Badge>
            <SuperAdminOnly>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportAll}
                className="gap-2"
              >
                Export All Data
              </Button>
            </SuperAdminOnly>
            {isAdmin && !isSuperAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                disabled
                className="gap-2 opacity-50"
              >
                <Lock className="w-3 h-3" />
                Export All Data
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <Badge className="bg-success/20 text-success border-success/30 gap-1">
              <TrendingUp className="w-3 h-3" /> 23%
            </Badge>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {isAdmin && !isSuperAdmin ? '89' : '324'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isAdmin && !isSuperAdmin ? 'Team Submissions' : 'Total Submissions'}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-success" />
            </div>
            <Badge className="bg-success/20 text-success border-success/30 gap-1">
              <TrendingUp className="w-3 h-3" /> 15%
            </Badge>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {isAdmin && !isSuperAdmin ? '8' : '28'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isAdmin && !isSuperAdmin ? 'Team Placements' : 'Placements YTD'}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-warning" />
            </div>
            <Badge className="bg-destructive/20 text-destructive border-destructive/30 gap-1">
              <TrendingDown className="w-3 h-3" /> 5%
            </Badge>
          </div>
          <p className="text-3xl font-bold text-foreground">8.6%</p>
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
        </Card>

        {/* Revenue Card - Hidden from non-super admins */}
        <SuperAdminOnly
          fallback={
            <Card className="p-6 opacity-50 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-lg z-10">
                <div className="text-center">
                  <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Super Admin Only</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">$---K</p>
              <p className="text-sm text-muted-foreground">Revenue YTD</p>
            </Card>
          }
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <Badge className="bg-success/20 text-success border-success/30 gap-1">
                <TrendingUp className="w-3 h-3" /> 31%
              </Badge>
            </div>
            <p className="text-3xl font-bold text-foreground">$333K</p>
            <p className="text-sm text-muted-foreground">Revenue YTD</p>
          </Card>
        </SuperAdminOnly>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {isAdmin && !isSuperAdmin ? 'Team Submission Trend' : 'Submission Trend'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionTrend}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px' 
                  }} 
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue Chart - Super Admin Only */}
        <SuperAdminOnly
          fallback={
            <Card className="p-6 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-card/90 backdrop-blur-sm rounded-lg z-10">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Financial Data Restricted</p>
                  <p className="text-xs text-muted-foreground mt-1">Super Admin access required</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue</h3>
              <div className="h-64 opacity-20">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={placementRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Bar dataKey="value" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          }
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))', 
                      borderRadius: '8px' 
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="value" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </SuperAdminOnly>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {isAdmin && !isSuperAdmin ? 'Your Vendor Performance' : 'Vendor Performance'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px' 
                  }}
                />
                <Bar dataKey="submissions" fill="hsl(var(--info))" radius={[0, 4, 4, 0]} name="Submissions" />
                <Bar dataKey="placements" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} name="Placements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Consultant Status</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team Performance Section */}
      <div className="mt-6">
        <TeamPerformance />
      </div>
    </MainLayout>
  );
}
