import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import {
  Building2,
  Users,
  CreditCard,
  Puzzle,
  ShieldCheck,
  Wrench,
  HeadphonesIcon,
  ChevronDown,
  Plus,
  CheckCircle,
  XCircle,
  Ban,
  ArrowRightLeft,
  UserPlus,
  KeyRound,
  Lock,
  Unlock,
  LogOut,
  Eye,
  EyeOff,
  Calendar,
  Percent,
  Gauge,
  ToggleLeft,
  ToggleRight,
  Link,
  Unlink,
  Star,
  Download,
  EyeIcon,
  Snowflake,
  Trash2,
  Shield,
  RotateCcw,
  Settings,
  Headphones,
  X,
  History,
  FileText,
  LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

interface ActionItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  variant?: 'default' | 'destructive' | 'warning';
  requiresConfirmation?: boolean;
}

interface ActionSection {
  id: string;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  actions: ActionItem[];
}

const actionSections: ActionSection[] = [
  {
    id: 'tenant',
    title: 'Tenant / Company Management',
    icon: Building2,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    actions: [
      { id: 'create_company', label: 'Create Company', icon: Plus, description: 'Provision a new tenant' },
      { id: 'activate_company', label: 'Activate Company', icon: CheckCircle, description: 'Enable company access' },
      { id: 'suspend_company', label: 'Suspend Company', icon: XCircle, description: 'Temporarily disable access', variant: 'warning', requiresConfirmation: true },
      { id: 'terminate_company', label: 'Terminate Company', icon: Ban, description: 'Permanently remove company', variant: 'destructive', requiresConfirmation: true },
      { id: 'convert_trial', label: 'Convert Trial to Paid', icon: ArrowRightLeft, description: 'Upgrade trial subscription' },
    ],
  },
  {
    id: 'access',
    title: 'User & Access Control',
    icon: Users,
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    actions: [
      { id: 'create_admin', label: 'Create Company Admin', icon: UserPlus, description: 'Add new administrator' },
      { id: 'reset_password', label: 'Reset Admin Password', icon: KeyRound, description: 'Send password reset email' },
      { id: 'lock_account', label: 'Lock Admin Account', icon: Lock, description: 'Prevent admin login', variant: 'warning', requiresConfirmation: true },
      { id: 'unlock_account', label: 'Unlock Admin Account', icon: Unlock, description: 'Restore admin access' },
      { id: 'force_logout', label: 'Force Logout All Users', icon: LogOut, description: 'End all active sessions', variant: 'warning', requiresConfirmation: true },
      { id: 'impersonate', label: 'Impersonate Admin', icon: Eye, description: 'View as admin user' },
      { id: 'end_impersonation', label: 'End Impersonation', icon: EyeOff, description: 'Return to super admin view' },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Trials',
    icon: CreditCard,
    iconColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
    actions: [
      { id: 'extend_trial', label: 'Extend Trial', icon: Calendar, description: 'Add days to trial period' },
      { id: 'apply_discount', label: 'Apply Discount', icon: Percent, description: 'Add promotional discount' },
      { id: 'override_limits', label: 'Override Usage Limits', icon: Gauge, description: 'Adjust resource quotas' },
    ],
  },
  {
    id: 'features',
    title: 'Feature & Module Control',
    icon: Puzzle,
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    actions: [
      { id: 'enable_module', label: 'Enable Module', icon: ToggleRight, description: 'Activate feature module' },
      { id: 'disable_module', label: 'Disable Module', icon: ToggleLeft, description: 'Deactivate feature module', variant: 'warning' },
      { id: 'enable_integration', label: 'Enable Integration', icon: Link, description: 'Connect third-party service' },
      { id: 'disable_integration', label: 'Disable Integration', icon: Unlink, description: 'Disconnect service', variant: 'warning' },
      { id: 'enable_premium', label: 'Enable Premium Feature', icon: Star, description: 'Grant premium access' },
    ],
  },
  {
    id: 'data',
    title: 'Data & Compliance',
    icon: ShieldCheck,
    iconColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    actions: [
      { id: 'export_data', label: 'Export Company Data', icon: Download, description: 'Download all company data' },
      { id: 'mask_data', label: 'Mask Sensitive Data', icon: EyeOff, description: 'Enable data masking' },
      { id: 'unmask_data', label: 'Unmask Sensitive Data', icon: EyeIcon, description: 'Disable data masking', variant: 'warning', requiresConfirmation: true },
      { id: 'freeze_data', label: 'Freeze Company Data', icon: Snowflake, description: 'Prevent data modifications', variant: 'warning', requiresConfirmation: true },
      { id: 'schedule_deletion', label: 'Schedule Data Deletion', icon: Trash2, description: 'Queue for GDPR deletion', variant: 'destructive', requiresConfirmation: true },
    ],
  },
  {
    id: 'security',
    title: 'Security & System',
    icon: Shield,
    iconColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    actions: [
      { id: 'enable_mfa', label: 'Enable MFA Enforcement', icon: Shield, description: 'Require MFA for all users' },
      { id: 'disable_mfa', label: 'Disable MFA Enforcement', icon: Shield, description: 'Remove MFA requirement', variant: 'warning', requiresConfirmation: true },
      { id: 'rotate_keys', label: 'Rotate API Keys', icon: RotateCcw, description: 'Generate new API credentials', requiresConfirmation: true },
      { id: 'enable_maintenance', label: 'Enable Maintenance Mode', icon: Settings, description: 'Show maintenance page', variant: 'warning', requiresConfirmation: true },
      { id: 'disable_maintenance', label: 'Disable Maintenance Mode', icon: Settings, description: 'Resume normal operations' },
    ],
  },
  {
    id: 'support',
    title: 'Support & Recovery',
    icon: HeadphonesIcon,
    iconColor: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    actions: [
      { id: 'open_support', label: 'Open Support Session', icon: Headphones, description: 'Start support session' },
      { id: 'close_support', label: 'Close Support Session', icon: X, description: 'End support session' },
      { id: 'restore_backup', label: 'Restore From Backup', icon: History, description: 'Recover from backup point', variant: 'warning', requiresConfirmation: true },
      { id: 'rollback_config', label: 'Rollback Configuration', icon: RotateCcw, description: 'Revert recent changes', variant: 'warning', requiresConfirmation: true },
      { id: 'view_audit', label: 'View Audit Logs', icon: FileText, description: 'Browse activity history' },
    ],
  },
];

export function SuperAdminActionPanels() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['tenant', 'access']);
  const [confirmAction, setConfirmAction] = useState<ActionItem | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleActionClick = (action: ActionItem) => {
    if (action.requiresConfirmation) {
      setConfirmAction(action);
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action: ActionItem) => {
    // Placeholder for actual action implementation
    toast.info(`Action: ${action.label}`, {
      description: 'This action panel is ready for backend integration.',
    });
    setConfirmAction(null);
  };

  const getButtonVariant = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getButtonStyles = (variant?: string) => {
    if (variant === 'warning') {
      return 'border-warning/50 text-warning hover:bg-warning/10';
    }
    return '';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Platform Actions</h2>
        <p className="text-sm text-muted-foreground">
          Manage tenants, users, billing, and system settings
        </p>
      </div>

      {/* Action Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {actionSections.map((section) => (
          <Collapsible
            key={section.id}
            open={expandedSections.includes(section.id)}
            onOpenChange={() => toggleSection(section.id)}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger asChild>
                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${section.bgColor} flex items-center justify-center`}>
                      <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                      <p className="text-xs text-muted-foreground">{section.actions.length} actions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {section.actions.length}
                    </Badge>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        expandedSections.includes(section.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-2 border-t border-border/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {section.actions.map((action) => (
                      <Button
                        key={action.id}
                        variant={getButtonVariant(action.variant)}
                        size="sm"
                        className={`justify-start gap-2 h-auto py-2.5 px-3 ${getButtonStyles(action.variant)}`}
                        onClick={() => handleActionClick(action)}
                      >
                        <action.icon className="w-4 h-4 shrink-0" />
                        <div className="text-left min-w-0">
                          <p className="text-xs font-medium truncate">{action.label}</p>
                          <p className="text-[10px] text-muted-foreground truncate hidden sm:block">
                            {action.description}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {confirmAction?.icon && <confirmAction.icon className="w-5 h-5" />}
              {confirmAction?.label}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.description}. This action may have significant impact. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={confirmAction?.variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}
              onClick={() => confirmAction && executeAction(confirmAction)}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
