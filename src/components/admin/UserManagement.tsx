import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAdminData } from '@/hooks/useAdminData';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { CreateUserModal } from './CreateUserModal';
import { UserActionsDropdown } from './UserActionsDropdown';
import { 
  Search, 
  Plus, 
  Shield, 
  Filter,
  Crown,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { AppRole, AccountStatus } from '@/types/admin';

export function UserManagement() {
  const { users, loading, updateUserStatus, updateUserRole, refetch, isSuperAdmin } = useAdminData();
  const { user } = useAuth();
  const { canCreateUser, canCreateAdmin, canViewAllUsers, isAdmin } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<AppRole | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter users based on permissions
  const visibleUsers = users.filter(u => {
    // Super admins can see everyone
    if (isSuperAdmin) return true;
    
    // Admins cannot see super admins
    if (isAdmin && u.role === 'super_admin') return false;
    
    // Admins can see themselves and users they created (or all for now)
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

  const handleViewProfile = (userId: string) => {
    toast.info('Opening user profile...');
  };

  const handleEditUser = (userId: string) => {
    toast.info('Opening user editor...');
  };

  const handleViewActivityLog = (userId: string) => {
    toast.info('Opening activity log...');
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

  return (
    <div className="space-y-4">
      {/* Info banner for admins */}
      {isAdmin && !isSuperAdmin && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0" />
          <p className="text-sm text-blue-300">
            As an Admin, you can manage Admins and Users. Super Admins are hidden from this view.
          </p>
        </div>
      )}

      {/* Header */}
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

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      u.role === 'super_admin' 
                        ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/30 ring-2 ring-amber-500/20' 
                        : u.role === 'admin'
                        ? 'bg-blue-500/20'
                        : 'bg-primary/20'
                    }`}>
                      {u.role === 'super_admin' ? (
                        <Crown className="w-4 h-4 text-amber-400" />
                      ) : (
                        <span className="text-xs font-medium text-primary">
                          {(u.full_name || u.email || '?').slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{u.full_name || 'No name'}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getRoleBadgeColor(u.role)}>
                    {u.role === 'super_admin' && <Crown className="w-3 h-3 mr-1" />}
                    {u.role?.replace('_', ' ').toUpperCase() || 'USER'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeColor(u.account_status)}>
                    {u.account_status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.department || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {u.last_login 
                    ? format(new Date(u.last_login), 'MMM d, yyyy')
                    : 'Never'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(u.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <UserActionsDropdown
                    userId={u.user_id}
                    userEmail={u.email || undefined}
                    userName={u.full_name || undefined}
                    currentRole={u.role}
                    currentStatus={u.account_status}
                    onStatusChange={handleStatusChange}
                    onRoleChange={handleRoleChange}
                    onViewProfile={handleViewProfile}
                    onEditUser={handleEditUser}
                    onViewActivityLog={handleViewActivityLog}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <CreateUserModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          refetch();
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}
