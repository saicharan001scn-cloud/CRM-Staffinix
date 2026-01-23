import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { CompanyAdmin } from '@/types/companyAdmin';
import type { PlatformActionSection, PlatformAction } from '@/types/companyAdmin';
import {
  Building2,
  Users,
  CreditCard,
  Puzzle,
  ShieldCheck,
  Shield,
  HeadphonesIcon,
  CheckCircle,
  XCircle,
  Ban,
  ArrowRightLeft,
  Calendar,
  KeyRound,
  Lock,
  Unlock,
  LogOut,
  Eye,
  EyeOff,
  Percent,
  Gauge,
  Receipt,
  ToggleRight,
  ToggleLeft,
  Link,
  Unlink,
  Star,
  Download,
  Snowflake,
  Trash2,
  RotateCw,
  Wrench,
  Database,
  FileText,
  ChevronDown,
  ChevronRight,
  Circle,
} from 'lucide-react';

interface CompanyActionsModalProps {
  admin: CompanyAdmin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete?: () => void;
}

const actionSections: PlatformActionSection[] = [
  {
    id: 'company',
    title: 'Company Management',
    icon: Building2,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    actions: [
      { id: 'activate_company', label: 'Activate Company', icon: CheckCircle, description: 'Enable company access' },
      { id: 'suspend_company', label: 'Suspend Company', icon: XCircle, description: 'Temporarily disable access', variant: 'warning', requiresConfirmation: true },
      { id: 'terminate_company', label: 'Terminate Company', icon: Ban, description: 'Permanently remove company', variant: 'destructive', requiresConfirmation: true },
      { id: 'convert_trial', label: 'Convert Trial to Paid', icon: ArrowRightLeft, description: 'Upgrade trial subscription' },
      { id: 'extend_trial', label: 'Extend Trial', icon: Calendar, description: 'Add days to trial period' },
    ],
  },
  {
    id: 'admin_control',
    title: 'Admin Account Control',
    icon: Users,
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    actions: [
      { id: 'reset_password', label: 'Reset Admin Password', icon: KeyRound, description: 'Send password reset email' },
      { id: 'lock_account', label: 'Lock Admin Account', icon: Lock, description: 'Prevent admin login', variant: 'warning', requiresConfirmation: true },
      { id: 'unlock_account', label: 'Unlock Admin Account', icon: Unlock, description: 'Restore admin access' },
      { id: 'force_logout', label: 'Force Logout This Admin', icon: LogOut, description: 'End all active sessions', variant: 'warning', requiresConfirmation: true },
      { id: 'impersonate', label: 'Impersonate This Admin', icon: Eye, description: 'View platform as this admin' },
      { id: 'end_impersonation', label: 'End Impersonation', icon: EyeOff, description: 'Return to super admin view' },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Limits',
    icon: CreditCard,
    iconColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
    actions: [
      { id: 'apply_discount', label: 'Apply Discount', icon: Percent, description: 'Add promotional discount' },
      { id: 'override_limits', label: 'Override Usage Limits', icon: Gauge, description: 'Adjust resource quotas' },
      { id: 'view_billing', label: 'View Billing History', icon: Receipt, description: 'See payment records' },
    ],
  },
  {
    id: 'features',
    title: 'Feature Control',
    icon: Puzzle,
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    actions: [
      { id: 'enable_module', label: 'Enable Module', icon: ToggleRight, description: 'Activate feature module' },
      { id: 'disable_module', label: 'Disable Module', icon: ToggleLeft, description: 'Deactivate feature module', variant: 'warning' },
      { id: 'enable_integration', label: 'Enable Integration', icon: Link, description: 'Connect third-party service' },
      { id: 'disable_integration', label: 'Disable Integration', icon: Unlink, description: 'Disconnect service', variant: 'warning' },
      { id: 'enable_premium', label: 'Enable Premium Features', icon: Star, description: 'Grant premium access' },
    ],
  },
  {
    id: 'data',
    title: 'Data Management',
    icon: ShieldCheck,
    iconColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    actions: [
      { id: 'export_data', label: 'Export Company Data', icon: Download, description: 'Download all company data' },
      { id: 'mask_data', label: 'Mask Sensitive Data', icon: EyeOff, description: 'Enable data masking' },
      { id: 'unmask_data', label: 'Unmask Sensitive Data', icon: Eye, description: 'Disable data masking', variant: 'warning', requiresConfirmation: true },
      { id: 'freeze_data', label: 'Freeze Company Data', icon: Snowflake, description: 'Prevent data modifications', variant: 'warning', requiresConfirmation: true },
      { id: 'schedule_deletion', label: 'Schedule Data Deletion', icon: Trash2, description: 'Queue for GDPR deletion', variant: 'destructive', requiresConfirmation: true },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    iconColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    actions: [
      { id: 'enable_mfa', label: 'Enable MFA Enforcement', icon: Shield, description: 'Require MFA for all users' },
      { id: 'disable_mfa', label: 'Disable MFA Enforcement', icon: Shield, description: 'Remove MFA requirement', variant: 'warning' },
      { id: 'rotate_api_keys', label: 'Rotate API Keys', icon: RotateCw, description: 'Regenerate all API keys', variant: 'warning', requiresConfirmation: true },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    icon: HeadphonesIcon,
    iconColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    actions: [
      { id: 'open_support', label: 'Open Support Session', icon: Wrench, description: 'Start remote support' },
      { id: 'restore_backup', label: 'Restore From Backup', icon: Database, description: 'Recover company data' },
      { id: 'view_audit', label: 'View Audit Logs', icon: FileText, description: 'See company activity history' },
    ],
  },
];

export function CompanyActionsModal({ admin, open, onOpenChange, onActionComplete }: CompanyActionsModalProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['company', 'admin_control']);
  const [confirmAction, setConfirmAction] = useState<PlatformAction | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleActionClick = (action: PlatformAction) => {
    if (action.requiresConfirmation) {
      setConfirmAction(action);
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action: PlatformAction) => {
    // Placeholder for actual action execution
    toast({
      title: 'Action Initiated',
      description: `${action.label} for ${admin?.company_name || 'company'} is being processed...`,
    });
    setConfirmAction(null);
    onActionComplete?.();
  };

  const getButtonVariant = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'outline';
      default:
        return 'ghost';
    }
  };

  const getButtonStyles = (variant?: string) => {
    switch (variant) {
      case 'warning':
        return 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300';
      case 'destructive':
        return '';
      default:
        return 'hover:bg-muted';
    }
  };

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

  if (!admin) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader className="pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg">
                  Platform Actions for {admin.company_name || 'Unknown Company'}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(admin.company_status)}
                  <span className="text-sm text-muted-foreground">
                    Admin: {admin.full_name || admin.email}
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <Circle className={cn(
                      "h-2 w-2 fill-current",
                      admin.is_online ? "text-green-400" : "text-gray-400"
                    )} />
                    {admin.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-3 py-2">
              {actionSections.map((section) => {
                const SectionIcon = section.icon;
                const isExpanded = expandedSections.includes(section.id);

                return (
                  <Collapsible
                    key={section.id}
                    open={isExpanded}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between h-auto py-3 px-4",
                          section.bgColor,
                          "hover:opacity-90"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <SectionIcon className={cn("h-5 w-5", section.iconColor)} />
                          <span className="font-medium">{section.title}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {section.actions.length}
                          </Badge>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="pt-2">
                      <div className="grid gap-1.5 pl-4">
                        {section.actions.map((action) => {
                          const ActionIcon = action.icon;
                          return (
                            <Button
                              key={action.id}
                              variant={getButtonVariant(action.variant)}
                              className={cn(
                                "justify-start h-auto py-2.5 px-3",
                                getButtonStyles(action.variant)
                              )}
                              onClick={() => handleActionClick(action)}
                            >
                              <ActionIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium text-sm">{action.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {action.description}
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to <strong>{confirmAction?.label.toLowerCase()}</strong> for{' '}
              <strong>{admin.company_name || 'this company'}</strong>?
              {confirmAction?.variant === 'destructive' && (
                <span className="block mt-2 text-destructive">
                  This action may be irreversible.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmAction && executeAction(confirmAction)}
              className={confirmAction?.variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
