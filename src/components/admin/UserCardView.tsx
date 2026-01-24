import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminData } from '@/hooks/useAdminData';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { CreateUserModal } from './CreateUserModal';
import { UserActionsDropdown } from './UserActionsDropdown';
import { UserProfileModal } from './UserProfileModal';
import { EditUserModal } from './EditUserModal';
import { AnalyticsToggle } from './AnalyticsToggle';
import { 
  Search, 
  Plus, 
  Shield, 
  Filter,
  Crown,
  User as UserIcon,
  Mail,
  Building2,
  Calendar,
  BarChart2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { AppRole, AccountStatus } from '@/types/admin';

export function UserCardView() {
  const { users, loading, updateUserStatus, updateUserRole, refetch, isSuperAdmin } = useAdminData();
  const { user } = useAuth();
  const { canCreateUser, canCreateAdmin, isAdmin } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<AppRole | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [profileModalUserId, setProfileModalUserId] = useState<string | null>(null);
  const [editModalUserId, setEditModalUserId] = useState<string | null>(null);

  // Filter users - admins cannot see super admins
  const visibleUsers = users.filter(u => {
    if (isSuperAdmin) return true;
    if (isAdmin && u.role === 'super_admin') return false;
    return true;
  });

  const filteredUsers = visibleUsers.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.account_status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleStatusChange = async (userId: string, status: AccountStatus) => {
    const success = await updateUserStatus(userId, status);
    if (!success) {
      toast.error('Failed to update user status');
    }
    return success;
  };

  const handleRoleChange = async (userId: string, role: AppRole) => {
    const success = await updateUserRole(userId, role);
    if (!success) {
      toast.error('Failed to update user role');
    }
    return success;
  };

  const handleViewProfile = (userId: string) => {
    setProfileModalUserId(userId);
  };

  const handleEditUser = (userId: string) => {
    setEditModalUserId(userId);
  };

  const handleViewActivityLog = (userId: string) => {
    toast.info('Opening activity log...');
  };

  const getRoleBadgeColor = (role?: AppRole) => {
    switch (role) {
      case 'super_admin': 
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30';
      case 'admin': 
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: 
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadgeColor = (status: AccountStatus) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'suspended': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleIcon = (role?: AppRole) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-blue-400" />;
      default:
        return <UserIcon className="w-5 h-5 text-muted-foreground" />;
    }
  };

  // Get role options based on current user's permissions
  const getRoleOptions = () => {
    const options = [
      { value: 'all', label: 'All Roles' },
      { value: 'user', label: 'User' },
    ];
    
    if (isAdmin || isSuperAdmin) {
      options.push({ value: 'admin', label: 'Admin' });
    }
    
    if (isSuperAdmin) {
      options.push({ value: 'super_admin', label: 'Super Admin' });
    }
    
    return options;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AccountStatus | 'all')}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as AppRole | 'all')}>
            <SelectTrigger className="w-32">
              <Shield className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {getRoleOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(canCreateUser || canCreateAdmin) && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        )}
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((u) => (
          <Card key={u.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header with Avatar and Actions */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    u.role === 'super_admin' 
                      ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/30 ring-2 ring-amber-500/20' 
                      : u.role === 'admin'
                      ? 'bg-blue-500/20 ring-2 ring-blue-500/20'
                      : 'bg-primary/20'
                  }`}>
                    {getRoleIcon(u.role)}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground line-clamp-1">
                      {u.full_name || 'No name'}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span className="line-clamp-1">{u.email}</span>
                    </div>
                  </div>
                </div>
                <UserActionsDropdown
                  userId={u.user_id}
                  userEmail={u.email || undefined}
                  userName={u.full_name || undefined}
                  currentRole={u.role}
                  currentStatus={u.account_status}
                  createdBy={(u as any).created_by}
                  onStatusChange={handleStatusChange}
                  onRoleChange={handleRoleChange}
                  onViewProfile={handleViewProfile}
                  onEditUser={handleEditUser}
                  onViewActivityLog={handleViewActivityLog}
                />
              </div>

              {/* Role and Status Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={getRoleBadgeColor(u.role)}>
                  {u.role === 'super_admin' && <Crown className="w-3 h-3 mr-1" />}
                  {u.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                  {u.role?.replace('_', ' ').toUpperCase() || 'USER'}
                </Badge>
                <Badge variant="outline" className={getStatusBadgeColor(u.account_status)}>
                  {u.account_status.toUpperCase()}
                </Badge>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm">
                {u.department && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{u.department}</span>
                  </div>
                )}
                {u.company_name && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{u.company_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {format(new Date(u.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>

              {/* Analytics Toggle */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart2 className="w-4 h-4" />
                    <span>Analytics Access</span>
                  </div>
                  <AnalyticsToggle
                    userId={u.user_id}
                    userRole={u.role}
                    currentState={(u as any).can_view_analytics || false}
                    createdBy={(u as any).created_by}
                    onChange={() => refetch()}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card className="col-span-full p-8 text-center">
            <UserIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No users found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </Card>
        )}
      </div>

      {/* Modals */}
      <CreateUserModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          refetch();
          setIsCreateModalOpen(false);
        }}
      />

      <UserProfileModal
        open={!!profileModalUserId}
        onOpenChange={(open) => !open && setProfileModalUserId(null)}
        userId={profileModalUserId}
      />

      <EditUserModal
        open={!!editModalUserId}
        onOpenChange={(open) => !open && setEditModalUserId(null)}
        userId={editModalUserId}
        onSuccess={() => {
          refetch();
          setEditModalUserId(null);
        }}
      />
    </div>
  );
}
