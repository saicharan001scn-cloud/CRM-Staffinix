import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Mail, 
  KeyRound,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck, 
  UserX, 
  Trash2,
  Activity,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import type { AppRole, AccountStatus } from '@/types/admin';

interface UserActionsDropdownProps {
  userId: string;
  userEmail?: string;
  userName?: string;
  currentRole?: AppRole;
  currentStatus: AccountStatus;
  createdBy?: string;
  onStatusChange: (userId: string, status: AccountStatus) => Promise<boolean>;
  onRoleChange: (userId: string, role: AppRole) => Promise<boolean>;
  onViewProfile?: (userId: string) => void;
  onEditUser?: (userId: string) => void;
  onViewActivityLog?: (userId: string) => void;
}

export function UserActionsDropdown({
  userId,
  userEmail,
  userName,
  currentRole,
  currentStatus,
  createdBy,
  onStatusChange,
  onRoleChange,
  onViewProfile,
  onEditUser,
  onViewActivityLog,
}: UserActionsDropdownProps) {
  const { 
    isSuperAdmin, 
    isAdmin,
    canEditAnyUser,
    canDeleteAnyUser,
    canSuspendAnyUser,
    canOverrideAdminChanges,
  } = usePermissions();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine if current user can manage this specific user
  const canManageUser = isSuperAdmin || (isAdmin && currentRole !== 'super_admin');
  
  // Only show for users with permission
  if (!canManageUser) {
    return null;
  }

  const handleRoleChange = async (newRole: AppRole) => {
    setLoading(true);
    const success = await onRoleChange(userId, newRole);
    if (success) {
      toast.success(`Role updated to ${newRole.replace('_', ' ')}`);
    }
    setLoading(false);
  };

  const handleSuspend = async () => {
    setLoading(true);
    const success = await onStatusChange(userId, 'suspended');
    if (success) {
      toast.success('User suspended successfully');
    }
    setSuspendDialogOpen(false);
    setLoading(false);
  };

  const handleActivate = async () => {
    setLoading(true);
    const success = await onStatusChange(userId, 'active');
    if (success) {
      toast.success('User activated successfully');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    // In a real app, this would call a delete function
    toast.success('User deleted successfully');
    setDeleteDialogOpen(false);
  };

  const handleResetPassword = () => {
    toast.info('Password reset email sent to ' + userEmail);
  };

  const handleSendEmail = () => {
    toast.info('Opening email composer for ' + userEmail);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-muted transition-colors"
            disabled={loading}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-popover border border-border shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          {/* View Actions */}
          <DropdownMenuItem 
            className="gap-2 cursor-pointer"
            onClick={() => onViewProfile?.(userId)}
          >
            <Eye className="w-4 h-4" />
            View Full Profile
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="gap-2 cursor-pointer"
            onClick={() => onEditUser?.(userId)}
          >
            <Edit className="w-4 h-4" />
            Edit User
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Communication */}
          <DropdownMenuItem 
            className="gap-2 cursor-pointer"
            onClick={handleSendEmail}
          >
            <Mail className="w-4 h-4" />
            Send Email
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="gap-2 cursor-pointer"
            onClick={handleResetPassword}
          >
            <KeyRound className="w-4 h-4" />
            Reset Password
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Role Management */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <Shield className="w-4 h-4" />
              Change Role
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-popover border border-border">
                {isSuperAdmin && (
                  <DropdownMenuItem 
                    className="gap-2 cursor-pointer"
                    onClick={() => handleRoleChange('super_admin')}
                    disabled={currentRole === 'super_admin'}
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    Super Admin
                    {currentRole === 'super_admin' && <span className="ml-auto text-xs text-muted-foreground">Current</span>}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={() => handleRoleChange('admin')}
                  disabled={currentRole === 'admin'}
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Admin
                  {currentRole === 'admin' && <span className="ml-auto text-xs text-muted-foreground">Current</span>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={() => handleRoleChange('user')}
                  disabled={currentRole === 'user'}
                >
                  <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                  User
                  {currentRole === 'user' && <span className="ml-auto text-xs text-muted-foreground">Current</span>}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Status Actions */}
          {currentStatus === 'active' ? (
            <DropdownMenuItem 
              className="gap-2 text-warning cursor-pointer focus:text-warning"
              onClick={() => setSuspendDialogOpen(true)}
            >
              <UserX className="w-4 h-4" />
              Suspend User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              className="gap-2 text-success cursor-pointer focus:text-success"
              onClick={handleActivate}
            >
              <UserCheck className="w-4 h-4" />
              Activate User
            </DropdownMenuItem>
          )}

          {/* Activity Log */}
          <DropdownMenuItem 
            className="gap-2 cursor-pointer"
            onClick={() => onViewActivityLog?.(userId)}
          >
            <Activity className="w-4 h-4" />
            View Activity Log
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete - Only for super admin or admin deleting own users */}
          {(canDeleteAnyUser || (isAdmin && createdBy === userId)) && (
            <DropdownMenuItem 
              className="gap-2 text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete User
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Suspend Confirmation Dialog */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {userName || userEmail}? 
              They will lose access to the platform immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSuspend}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              Suspend User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {userName || userEmail}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
