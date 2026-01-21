import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { usePermissions } from '@/hooks/usePermissions';
import { 
  ChevronDown, 
  Download, 
  Mail, 
  BarChart2, 
  UserX,
  UserCheck,
  Trash2,
  X 
} from 'lucide-react';
import { toast } from 'sonner';

interface BulkActionsBarProps {
  selectedCount: number;
  selectedUserIds: string[];
  onClearSelection: () => void;
  onBulkAction: (action: string, userIds: string[]) => Promise<void>;
}

export function BulkActionsBar({
  selectedCount,
  selectedUserIds,
  onClearSelection,
  onBulkAction,
}: BulkActionsBarProps) {
  const { isSuperAdmin, canExportAllData } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string;
    title: string;
    description: string;
    destructive?: boolean;
  }>({ open: false, action: '', title: '', description: '' });

  if (selectedCount === 0) return null;

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      await onBulkAction(action, selectedUserIds);
      toast.success(`Bulk ${action.replace('_', ' ')} completed for ${selectedCount} users`);
      onClearSelection();
    } catch (error) {
      toast.error(`Failed to perform bulk ${action.replace('_', ' ')}`);
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, action: '', title: '', description: '' });
    }
  };

  const openConfirmDialog = (action: string, title: string, description: string, destructive = false) => {
    setConfirmDialog({ open: true, action, title, description, destructive });
  };

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg animate-in slide-in-from-top-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">{selectedCount}</span>
          </div>
          <span className="text-sm font-medium">
            {selectedCount === 1 ? 'user' : 'users'} selected
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading}>
                Bulk Actions
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                className="gap-2"
                onClick={() => handleAction('send_email')}
              >
                <Mail className="w-4 h-4" />
                Send Message
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="gap-2"
                onClick={() => handleAction('grant_analytics')}
              >
                <BarChart2 className="w-4 h-4" />
                Grant Analytics Access
              </DropdownMenuItem>

              <DropdownMenuItem 
                className="gap-2"
                onClick={() => handleAction('revoke_analytics')}
              >
                <BarChart2 className="w-4 h-4 opacity-50" />
                Revoke Analytics Access
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                className="gap-2"
                onClick={() => openConfirmDialog(
                  'suspend',
                  'Suspend Users',
                  `Are you sure you want to suspend ${selectedCount} users? They will lose access immediately.`,
                  true
                )}
              >
                <UserX className="w-4 h-4 text-warning" />
                <span className="text-warning">Suspend All</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                className="gap-2"
                onClick={() => handleAction('activate')}
              >
                <UserCheck className="w-4 h-4 text-success" />
                <span className="text-success">Activate All</span>
              </DropdownMenuItem>

              {isSuperAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="gap-2 text-destructive focus:text-destructive"
                    onClick={() => openConfirmDialog(
                      'delete',
                      'Delete Users',
                      `Are you sure you want to delete ${selectedCount} users? This action cannot be undone.`,
                      true
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {canExportAllData && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAction('export')}
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Selected
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearSelection}
            className="gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>

      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction(confirmDialog.action)}
              className={confirmDialog.destructive 
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                : ''
              }
            >
              {loading ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
