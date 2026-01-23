import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Clock,
  Shield,
  BarChart2,
  Crown,
  Users,
  Briefcase,
  Send,
  TrendingUp
} from 'lucide-react';
import type { UserWithRole } from '@/types/admin';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

interface AdminStats {
  totalEmployees: number;
  activeEmployees: number;
  totalSubmissions: number;
  totalPlacements: number;
  recentActivity: number;
}

export function UserProfileModal({ open, onOpenChange, userId }: UserProfileModalProps) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (open && userId) {
      fetchUser();
    }
  }, [open, userId]);

  const fetchUser = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      const highestRole = roles?.sort((a, b) => {
        const order: Record<string, number> = { super_admin: 1, admin: 2, user: 3 };
        return (order[a.role] || 4) - (order[b.role] || 4);
      })[0];

      const userWithRole = {
        ...profile,
        role: highestRole?.role || 'user',
        roles: roles || [],
      } as UserWithRole;

      setUser(userWithRole);

      // Fetch admin-specific stats if user is an admin
      if (highestRole?.role === 'admin') {
        await fetchAdminStats(userId, profile.company_name);
      } else {
        setAdminStats(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async (adminId: string, companyName: string | null) => {
    try {
      // Fetch employees created by this admin
      const { data: employees, error: empError } = await supabase
        .from('profiles')
        .select('user_id, account_status')
        .eq('created_by', adminId);

      if (empError) throw empError;

      const totalEmployees = employees?.length || 0;
      const activeEmployees = employees?.filter(e => e.account_status === 'active').length || 0;

      // Fetch submissions count for this company/admin's team
      const employeeIds = employees?.map(e => e.user_id) || [];
      const allUserIds = [adminId, ...employeeIds];

      let totalSubmissions = 0;
      let totalPlacements = 0;

      if (allUserIds.length > 0) {
        const { data: submissions } = await supabase
          .from('submissions')
          .select('id, status')
          .in('user_id', allUserIds);

        totalSubmissions = submissions?.length || 0;
        totalPlacements = submissions?.filter(s => s.status === 'placed').length || 0;
      }

      // Fetch recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentLogs } = await supabase
        .from('activity_logs')
        .select('id')
        .in('user_id', allUserIds)
        .gte('created_at', sevenDaysAgo.toISOString());

      setAdminStats({
        totalEmployees,
        activeEmployees,
        totalSubmissions,
        totalPlacements,
        recentActivity: recentLogs?.length || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setAdminStats(null);
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'super_admin': 
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30';
      case 'admin': 
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: 
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'suspended': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : user ? (
          <div className="space-y-4">
            {/* User Header */}
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                user.role === 'super_admin' 
                  ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/30 ring-2 ring-amber-500/20' 
                  : user.role === 'admin'
                  ? 'bg-blue-500/20 ring-2 ring-blue-500/20'
                  : 'bg-primary/20'
              }`}>
                {user.role === 'super_admin' ? (
                  <Crown className="w-8 h-8 text-amber-400" />
                ) : user.role === 'admin' ? (
                  <Shield className="w-8 h-8 text-blue-400" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {user.full_name || 'No name'}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                    {user.role === 'super_admin' && <Crown className="w-3 h-3 mr-1" />}
                    {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                    {user.role?.replace('_', ' ').toUpperCase() || 'USER'}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(user.account_status)}>
                    {user.account_status?.toUpperCase() || 'ACTIVE'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Admin Team Stats - Only show for admins */}
            {user.role === 'admin' && adminStats && (
              <>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    Team & Company Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3 bg-blue-500/5 border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{adminStats.totalEmployees}</p>
                          <p className="text-xs text-muted-foreground">Team Members</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 bg-success/5 border-success/20">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-success/20">
                          <TrendingUp className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{adminStats.activeEmployees}</p>
                          <p className="text-xs text-muted-foreground">Active Members</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Send className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{adminStats.totalSubmissions}</p>
                          <p className="text-xs text-muted-foreground">Total Submissions</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 bg-amber-500/5 border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-amber-500/20">
                          <Briefcase className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{adminStats.totalPlacements}</p>
                          <p className="text-xs text-muted-foreground">Placements</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-3 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BarChart2 className="w-4 h-4" />
                        <span className="text-sm">Recent Activity (7 days)</span>
                      </div>
                      <span className="font-semibold text-foreground">{adminStats.recentActivity} actions</span>
                    </div>
                  </Card>
                </div>

                <Separator />
              </>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
                <p className="font-medium text-sm truncate">{user.email || '-'}</p>
              </Card>

              <Card className="p-3 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4" />
                  Phone
                </div>
                <p className="font-medium text-sm">{user.phone || '-'}</p>
              </Card>

              <Card className="p-3 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Building2 className="w-4 h-4" />
                  Company
                </div>
                <p className="font-medium text-sm">{user.company_name || '-'}</p>
              </Card>

              <Card className="p-3 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Shield className="w-4 h-4" />
                  Department
                </div>
                <p className="font-medium text-sm">{user.department || '-'}</p>
              </Card>

              <Card className="p-3 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  Joined
                </div>
                <p className="font-medium text-sm">
                  {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : '-'}
                </p>
              </Card>

              <Card className="p-3 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  Last Login
                </div>
                <p className="font-medium text-sm">
                  {user.last_login ? format(new Date(user.last_login), 'MMM d, yyyy') : 'Never'}
                </p>
              </Card>
            </div>

            {/* Analytics Access */}
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Analytics Access</span>
                </div>
                <Badge variant="outline" className={
                  (user as any).can_view_analytics || user.role === 'admin' || user.role === 'super_admin'
                    ? 'bg-success/20 text-success border-success/30'
                    : 'bg-muted text-muted-foreground'
                }>
                  {(user as any).can_view_analytics || user.role === 'admin' || user.role === 'super_admin'
                    ? 'Enabled'
                    : 'Disabled'
                  }
                </Badge>
              </div>
            </Card>

            {/* Notes */}
            {user.notes && (
              <Card className="p-3 space-y-1">
                <span className="text-sm text-muted-foreground">Notes</span>
                <p className="text-sm">{user.notes}</p>
              </Card>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">User not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
