import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter,
  MoreVertical,
  ArrowUpCircle,
  ArrowDownCircle,
  XCircle,
  Mail,
  CreditCard,
  Clock,
  Users,
  HardDrive,
  Building2,
  RefreshCw
} from 'lucide-react';
import { CompanySubscription, SubscriptionPlan } from '@/types/billing';
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface CompanySubscriptionsManagerProps {
  subscriptions: CompanySubscription[];
  plans: SubscriptionPlan[];
  onUpdateSubscription: (id: string, updates: Partial<CompanySubscription>) => Promise<{ error: Error | null }>;
}

export const CompanySubscriptionsManager = ({
  subscriptions,
  plans,
  onUpdateSubscription
}: CompanySubscriptionsManagerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.company_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CompanySubscription['status'], trialEndsAt?: string | null) => {
    if (status === 'trial' && trialEndsAt) {
      const daysLeft = differenceInDays(new Date(trialEndsAt), new Date());
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Trial ({daysLeft} days left)
        </Badge>
      );
    }

    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      trial: 'secondary',
      past_due: 'destructive',
      cancelled: 'outline',
      suspended: 'destructive'
    };

    const labels: Record<string, string> = {
      active: '✅ Active',
      trial: '⏳ Trial',
      past_due: '⚠️ Past Due',
      cancelled: '❌ Cancelled',
      suspended: '🚫 Suspended'
    };

    return <Badge variant={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
  };

  const handleUpgrade = async (sub: CompanySubscription) => {
    const currentPlanIndex = plans.findIndex(p => p.id === sub.plan_id);
    const nextPlan = plans[currentPlanIndex + 1];
    if (nextPlan) {
      const result = await onUpdateSubscription(sub.id, { plan_id: nextPlan.id });
      if (!result.error) {
        toast.success(`${sub.company_name} upgraded to ${nextPlan.name}`);
      }
    } else {
      toast.info('Already on the highest plan');
    }
  };

  const handleDowngrade = async (sub: CompanySubscription) => {
    const currentPlanIndex = plans.findIndex(p => p.id === sub.plan_id);
    const prevPlan = plans[currentPlanIndex - 1];
    if (prevPlan) {
      const result = await onUpdateSubscription(sub.id, { plan_id: prevPlan.id });
      if (!result.error) {
        toast.success(`${sub.company_name} downgraded to ${prevPlan.name}`);
      }
    } else {
      toast.info('Already on the lowest plan');
    }
  };

  const handleCancel = async (sub: CompanySubscription) => {
    const result = await onUpdateSubscription(sub.id, { status: 'cancelled', auto_renew: false });
    if (!result.error) {
      toast.success(`Subscription cancelled for ${sub.company_name}`);
    }
  };

  const handleExtendTrial = async (sub: CompanySubscription) => {
    const newTrialEnd = new Date();
    newTrialEnd.setDate(newTrialEnd.getDate() + 7);
    const result = await onUpdateSubscription(sub.id, { 
      trial_ends_at: newTrialEnd.toISOString() 
    });
    if (!result.error) {
      toast.success(`Trial extended by 7 days for ${sub.company_name}`);
    }
  };

  const handleConvertToPaid = async (sub: CompanySubscription) => {
    const result = await onUpdateSubscription(sub.id, { 
      status: 'active',
      trial_ends_at: null,
      current_period_start: new Date().toISOString()
    });
    if (!result.error) {
      toast.success(`${sub.company_name} converted to paid subscription`);
    }
  };

  // Stats
  const stats = {
    active: subscriptions.filter(s => s.status === 'active').length,
    trial: subscriptions.filter(s => s.status === 'trial').length,
    pastDue: subscriptions.filter(s => s.status === 'past_due').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Subscriptions ({subscriptions.length})
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50">Active: {stats.active}</Badge>
          <Badge variant="outline" className="bg-yellow-50">Trial: {stats.trial}</Badge>
          <Badge variant="outline" className="bg-red-50">Past Due: {stats.pastDue}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {statusFilter === 'all' ? 'All Status' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('trial')}>Trial</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('past_due')}>Past Due</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>Cancelled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Subscriptions List */}
        <div className="space-y-3">
          {filteredSubscriptions.map((sub) => {
            const plan = plans.find(p => p.id === sub.plan_id);
            const usersPercent = plan?.max_users ? (sub.users_count / plan.max_users) * 100 : 0;
            const storagePercent = plan?.storage_gb ? (sub.storage_used_gb / plan.storage_gb) * 100 : 0;

            return (
              <div
                key={sub.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                  sub.status === 'past_due' ? 'border-destructive/50 bg-destructive/5' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{sub.company_name}</h3>
                      {getStatusBadge(sub.status, sub.trial_ends_at)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {sub.company_email}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        {plan?.name || 'No plan'} {sub.billing_cycle === 'yearly' ? 'Annual' : 'Monthly'}
                      </span>
                      <span>
                        ${sub.billing_cycle === 'yearly' ? plan?.yearly_price : plan?.monthly_price}/{sub.billing_cycle === 'yearly' ? 'year' : 'month'}
                      </span>
                      {sub.current_period_end && (
                        <span className="flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />
                          Renews {format(new Date(sub.current_period_end), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {sub.status === 'trial' && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleConvertToPaid(sub)}
                            className="gap-2"
                          >
                            <CreditCard className="h-4 w-4" />
                            Convert to Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleExtendTrial(sub)}
                            className="gap-2"
                          >
                            <Clock className="h-4 w-4" />
                            Extend Trial (+7 days)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleUpgrade(sub)}
                        className="gap-2"
                      >
                        <ArrowUpCircle className="h-4 w-4" />
                        Upgrade Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDowngrade(sub)}
                        className="gap-2"
                      >
                        <ArrowDownCircle className="h-4 w-4" />
                        Downgrade Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Mail className="h-4 w-4" />
                        Contact
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {sub.status !== 'cancelled' && (
                        <DropdownMenuItem 
                          onClick={() => handleCancel(sub)}
                          className="gap-2 text-destructive"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel Subscription
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Usage */}
                {plan && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" />
                          Users
                        </span>
                        <span>{sub.users_count}/{plan.max_users === 0 ? '∞' : plan.max_users}</span>
                      </div>
                      <Progress value={plan.max_users === 0 ? 0 : usersPercent} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <HardDrive className="h-3 w-3" />
                          Storage
                        </span>
                        <span>{sub.storage_used_gb.toFixed(1)}GB/{plan.storage_gb}GB</span>
                      </div>
                      <Progress value={storagePercent} className="h-2" />
                    </div>
                  </div>
                )}

                {/* Payment method */}
                {sub.payment_method?.type && (
                  <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    {sub.payment_method.brand} ****{sub.payment_method.last_four}
                    {sub.payment_method.exp_month && sub.payment_method.exp_year && (
                      <span>
                        (Exp: {sub.payment_method.exp_month}/{sub.payment_method.exp_year})
                      </span>
                    )}
                  </div>
                )}
                {!sub.payment_method?.type && sub.status !== 'trial' && (
                  <div className="mt-3 text-xs text-yellow-600 flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    No payment method on file
                  </div>
                )}
              </div>
            );
          })}

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No subscriptions found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
