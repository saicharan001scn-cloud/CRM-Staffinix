import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAdminData } from '@/hooks/useAdminData';
import { useAuth } from '@/hooks/useAuth';
import { UserActionsDropdown } from './UserActionsDropdown';
import { 
  ChevronRight, 
  ChevronDown, 
  Crown, 
  Shield, 
  User, 
  Users,
  Search,
  Building2,
  FolderTree,
  Expand,
  Shrink,
  Calendar,
  Clock,
  BarChart2
} from 'lucide-react';
import { format } from 'date-fns';
import type { UserWithRole, AppRole, AccountStatus } from '@/types/admin';

interface HierarchyNode {
  user: UserWithRole;
  children: HierarchyNode[];
}

interface UserHierarchyProps {
  onViewProfile: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onViewActivityLog: (userId: string) => void;
}

export function UserHierarchy({ onViewProfile, onEditUser, onViewActivityLog }: UserHierarchyProps) {
  const { users, loading, updateUserStatus, updateUserRole, refetch } = useAdminData();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  // Build hierarchy tree
  const hierarchy = useMemo(() => {
    if (!users.length) return { superAdmins: [], admins: [], orphanedUsers: [] };

    const superAdmins = users.filter(u => u.role === 'super_admin');
    const admins = users.filter(u => u.role === 'admin');
    const regularUsers = users.filter(u => u.role === 'user' || !u.role);

    // Group users by who created them
    const usersByCreator = new Map<string, UserWithRole[]>();
    
    regularUsers.forEach(user => {
      const createdBy = (user as any).created_by;
      if (createdBy) {
        const existing = usersByCreator.get(createdBy) || [];
        existing.push(user);
        usersByCreator.set(createdBy, existing);
      }
    });

    // Group admins by who created them
    const adminsByCreator = new Map<string, UserWithRole[]>();
    admins.forEach(admin => {
      const createdBy = (admin as any).created_by;
      if (createdBy) {
        const existing = adminsByCreator.get(createdBy) || [];
        existing.push(admin);
        adminsByCreator.set(createdBy, existing);
      }
    });

    // Find orphaned users (created_by is null or creator doesn't exist)
    const allUserIds = new Set(users.map(u => u.user_id));
    const orphanedUsers = regularUsers.filter(user => {
      const createdBy = (user as any).created_by;
      return !createdBy || !allUserIds.has(createdBy);
    });

    return {
      superAdmins,
      admins,
      adminsByCreator,
      usersByCreator,
      orphanedUsers,
    };
  }, [users]);

  // Filter users based on search
  const matchesSearch = (user: UserWithRole): boolean => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.full_name?.toLowerCase().includes(query) ||
      user.company_name?.toLowerCase().includes(query) ||
      user.department?.toLowerCase().includes(query)
    );
  };

  const toggleNode = (userId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedNodes(new Set());
    } else {
      const allIds = new Set(users.map(u => u.user_id));
      setExpandedNodes(allIds);
    }
    setAllExpanded(!allExpanded);
  };

  const handleStatusChange = async (userId: string, status: AccountStatus) => {
    const success = await updateUserStatus(userId, status);
    return success;
  };

  const handleRoleChange = async (userId: string, role: AppRole) => {
    const success = await updateUserRole(userId, role);
    return success;
  };

  const getRoleIcon = (role?: AppRole) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-400" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeStyles = (role?: AppRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30';
      case 'admin':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadgeStyles = (status: AccountStatus) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success border-success/30';
      case 'suspended':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'pending':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const UserRow = ({ user, level = 0, isLast = false }: { user: UserWithRole; level?: number; isLast?: boolean }) => {
    const childUsers = hierarchy.usersByCreator?.get(user.user_id) || [];
    const childAdmins = hierarchy.adminsByCreator?.get(user.user_id) || [];
    const allChildren = [...childAdmins, ...childUsers];
    const hasChildren = allChildren.length > 0;
    const isExpanded = expandedNodes.has(user.user_id);
    const visible = matchesSearch(user) || allChildren.some(c => matchesSearch(c));

    if (!visible && !hasChildren) return null;

    return (
      <div className="relative">
        {/* Connecting lines */}
        {level > 0 && (
          <div 
            className="absolute left-0 top-0 bottom-0 border-l-2 border-border/50"
            style={{ left: `${(level - 1) * 24 + 12}px` }}
          />
        )}
        {level > 0 && (
          <div 
            className="absolute border-t-2 border-border/50"
            style={{ 
              left: `${(level - 1) * 24 + 12}px`,
              top: '24px',
              width: '12px'
            }}
          />
        )}

        <Collapsible open={isExpanded} onOpenChange={() => hasChildren && toggleNode(user.user_id)}>
          <div 
            className={`group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors ${
              matchesSearch(user) ? 'opacity-100' : 'opacity-50'
            }`}
            style={{ paddingLeft: `${level * 24 + 12}px` }}
          >
            {/* Expand/Collapse */}
            {hasChildren ? (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            ) : (
              <div className="w-6" />
            )}

            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              user.role === 'super_admin' 
                ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/30 ring-2 ring-amber-500/20' 
                : user.role === 'admin'
                ? 'bg-blue-500/20'
                : 'bg-primary/20'
            }`}>
              {getRoleIcon(user.role)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{user.full_name || 'No name'}</span>
                <Badge variant="outline" className={`text-[10px] ${getRoleBadgeStyles(user.role)}`}>
                  {user.role?.replace('_', ' ').toUpperCase() || 'USER'}
                </Badge>
                <Badge variant="outline" className={`text-[10px] ${getStatusBadgeStyles(user.account_status)}`}>
                  {user.account_status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="truncate">{user.email}</span>
                {user.department && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {user.department}
                  </span>
                )}
                {hasChildren && (
                  <span className="flex items-center gap-1 text-primary">
                    <Users className="w-3 h-3" />
                    {allChildren.length} user{allChildren.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(user.created_at), 'MMM d, yyyy')}
                </TooltipTrigger>
                <TooltipContent>Joined</TooltipContent>
              </Tooltip>
              {user.last_login && (
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(user.last_login), 'MMM d')}
                  </TooltipTrigger>
                  <TooltipContent>Last login</TooltipContent>
                </Tooltip>
              )}
              {(user as any).can_view_analytics && (
                <Tooltip>
                  <TooltipTrigger>
                    <BarChart2 className="w-3 h-3 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>Has analytics access</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Actions */}
            <UserActionsDropdown
              userId={user.user_id}
              userEmail={user.email || undefined}
              userName={user.full_name || undefined}
              currentRole={user.role}
              currentStatus={user.account_status}
              createdBy={(user as any).created_by}
              onStatusChange={handleStatusChange}
              onRoleChange={handleRoleChange}
              onViewProfile={onViewProfile}
              onEditUser={onEditUser}
              onViewActivityLog={onViewActivityLog}
            />
          </div>

          {/* Children */}
          {hasChildren && (
            <CollapsibleContent>
              {childAdmins.map((child, idx) => (
                <UserRow 
                  key={child.id} 
                  user={child} 
                  level={level + 1}
                  isLast={idx === allChildren.length - 1}
                />
              ))}
              {childUsers.map((child, idx) => (
                <UserRow 
                  key={child.id} 
                  user={child} 
                  level={level + 1}
                  isLast={idx === childUsers.length - 1}
                />
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
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
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={toggleAll} className="gap-2">
          {allExpanded ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </Button>
      </div>

      {/* Hierarchy Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{hierarchy.superAdmins.length}</p>
              <p className="text-xs text-muted-foreground">Super Admins</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{hierarchy.admins.length}</p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => !u.role || u.role === 'user').length}</p>
              <p className="text-xs text-muted-foreground">Users</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/20">
              <FolderTree className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{hierarchy.orphanedUsers.length}</p>
              <p className="text-xs text-muted-foreground">Unassigned</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tree View */}
      <Card className="p-4">
        <div className="space-y-1">
          {/* Super Admins at top level */}
          {hierarchy.superAdmins.map((superAdmin) => (
            <UserRow key={superAdmin.id} user={superAdmin} level={0} />
          ))}

          {/* Orphaned Admins (not created by any super admin) */}
          {hierarchy.admins
            .filter(admin => {
              const createdBy = (admin as any).created_by;
              return !createdBy || !hierarchy.superAdmins.some(sa => sa.user_id === createdBy);
            })
            .map((admin) => (
              <UserRow key={admin.id} user={admin} level={0} />
            ))}

          {/* Orphaned Users Section */}
          {hierarchy.orphanedUsers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                <FolderTree className="w-4 h-4" />
                <span className="text-sm font-medium">Unassigned Users</span>
                <Badge variant="outline" className="text-xs">
                  {hierarchy.orphanedUsers.length}
                </Badge>
              </div>
              {hierarchy.orphanedUsers.map((user) => (
                <UserRow key={user.id} user={user} level={0} />
              ))}
            </div>
          )}

          {users.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
