import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { SubscriptionPlan, CompanySubscription } from '@/types/billing';
import { Building2, Mail, CreditCard, Calendar, Users } from 'lucide-react';

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subscription: Partial<CompanySubscription>) => Promise<{ error: Error | null }>;
  plans: SubscriptionPlan[];
}

export const CreateSubscriptionModal = ({
  isOpen,
  onClose,
  onSubmit,
  plans
}: CreateSubscriptionModalProps) => {
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    plan_id: '',
    billing_cycle: 'monthly' as 'monthly' | 'yearly',
    status: 'trial' as 'active' | 'trial' | 'past_due' | 'cancelled',
    auto_renew: true,
    users_count: 1,
    trial_days: 14,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.company_email) {
      toast.error('Company name and email are required');
      return;
    }

    setIsSubmitting(true);

    const selectedPlan = plans.find(p => p.id === formData.plan_id);
    const now = new Date();
    const periodEnd = new Date();
    
    if (formData.status === 'trial') {
      periodEnd.setDate(periodEnd.getDate() + formData.trial_days);
    } else {
      if (formData.billing_cycle === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }
    }

    const subscription: Partial<CompanySubscription> = {
      company_name: formData.company_name,
      company_email: formData.company_email,
      plan_id: formData.plan_id || null,
      billing_cycle: formData.billing_cycle,
      status: formData.status,
      auto_renew: formData.auto_renew,
      users_count: formData.users_count,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      trial_ends_at: formData.status === 'trial' ? periodEnd.toISOString() : null,
      storage_used_gb: 0,
      payment_method: {},
      metadata: {}
    };

    const { error } = await onSubmit(subscription);
    
    setIsSubmitting(false);

    if (!error) {
      toast.success('Subscription created successfully');
      setFormData({
        company_name: '',
        company_email: '',
        plan_id: '',
        billing_cycle: 'monthly',
        status: 'trial',
        auto_renew: true,
        users_count: 1,
        trial_days: 14,
      });
      onClose();
    } else {
      toast.error('Failed to create subscription');
    }
  };

  const activePlans = plans.filter(p => p.is_active);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Add Company Subscription
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Company Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Enter company name"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_email">Company Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company_email"
                  type="email"
                  value={formData.company_email}
                  onChange={(e) => setFormData({ ...formData, company_email: e.target.value })}
                  placeholder="billing@company.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Subscription Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <Select
                  value={formData.plan_id}
                  onValueChange={(value) => setFormData({ ...formData, plan_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {activePlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.monthly_price}/mo
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">🧪 Trial</SelectItem>
                    <SelectItem value="active">✅ Active</SelectItem>
                    <SelectItem value="past_due">⚠️ Past Due</SelectItem>
                    <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Billing Cycle</Label>
                <Select
                  value={formData.billing_cycle}
                  onValueChange={(value: any) => setFormData({ ...formData, billing_cycle: value })}
                >
                  <SelectTrigger>
                    <CreditCard className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="users_count">Initial Users</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="users_count"
                    type="number"
                    min={1}
                    value={formData.users_count}
                    onChange={(e) => setFormData({ ...formData, users_count: parseInt(e.target.value) || 1 })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {formData.status === 'trial' && (
              <div className="space-y-2">
                <Label htmlFor="trial_days">Trial Period (Days)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="trial_days"
                    type="number"
                    min={1}
                    max={90}
                    value={formData.trial_days}
                    onChange={(e) => setFormData({ ...formData, trial_days: parseInt(e.target.value) || 14 })}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="auto_renew" className="cursor-pointer">Auto-Renew</Label>
                <p className="text-xs text-muted-foreground">Automatically renew subscription</p>
              </div>
              <Switch
                id="auto_renew"
                checked={formData.auto_renew}
                onCheckedChange={(checked) => setFormData({ ...formData, auto_renew: checked })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating...' : 'Create Subscription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
