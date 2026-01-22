import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { SubscriptionPlan, PlanFeatures } from '@/types/billing';
import { toast } from 'sonner';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: Partial<SubscriptionPlan>) => Promise<void>;
  editingPlan: SubscriptionPlan | null;
}

const defaultFeatures: PlanFeatures = {
  user_management: true,
  storage: true,
  api_access: true,
  priority_support: false,
  custom_branding: false,
  advanced_analytics: false,
  white_labeling: false,
  dedicated_manager: false
};

export const CreatePlanModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingPlan
}: CreatePlanModalProps) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [yearlyPrice, setYearlyPrice] = useState('');
  const [setupFee, setSetupFee] = useState('0');
  const [maxUsers, setMaxUsers] = useState('10');
  const [storageGb, setStorageGb] = useState('50');
  const [apiCalls, setApiCalls] = useState('10000');
  const [trialDays, setTrialDays] = useState('14');
  const [features, setFeatures] = useState<PlanFeatures>(defaultFeatures);
  const [isPublic, setIsPublic] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingPlan) {
      setName(editingPlan.name);
      setSlug(editingPlan.slug);
      setDescription(editingPlan.description || '');
      setMonthlyPrice(String(editingPlan.monthly_price));
      setYearlyPrice(String(editingPlan.yearly_price));
      setSetupFee(String(editingPlan.setup_fee));
      setMaxUsers(String(editingPlan.max_users));
      setStorageGb(String(editingPlan.storage_gb));
      setApiCalls(String(editingPlan.api_calls_per_month));
      setTrialDays(String(editingPlan.trial_days));
      setFeatures(editingPlan.features);
      setIsPublic(editingPlan.is_public);
      setIsPopular(editingPlan.is_popular);
    } else {
      resetForm();
    }
  }, [editingPlan, isOpen]);

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setMonthlyPrice('');
    setYearlyPrice('');
    setSetupFee('0');
    setMaxUsers('10');
    setStorageGb('50');
    setApiCalls('10000');
    setTrialDays('14');
    setFeatures(defaultFeatures);
    setIsPublic(true);
    setIsPopular(false);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingPlan) {
      setSlug(value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
    }
  };

  const handleMonthlyPriceChange = (value: string) => {
    setMonthlyPrice(value);
    const monthly = parseFloat(value) || 0;
    setYearlyPrice(String((monthly * 10).toFixed(2)));
  };

  const handleSubmit = async () => {
    if (!name || !slug || !monthlyPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        slug,
        description,
        monthly_price: parseFloat(monthlyPrice),
        yearly_price: parseFloat(yearlyPrice),
        setup_fee: parseFloat(setupFee) || 0,
        max_users: parseInt(maxUsers) || 0,
        storage_gb: parseInt(storageGb) || 50,
        api_calls_per_month: parseInt(apiCalls) || 0,
        trial_days: parseInt(trialDays) || 14,
        features,
        is_public: isPublic,
        is_popular: isPopular,
        is_active: true
      });
      toast.success(editingPlan ? 'Plan updated successfully' : 'Plan created successfully');
      onClose();
      resetForm();
    } catch {
      toast.error('Failed to save plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const featureLabels: Record<string, string> = {
    user_management: 'User Management',
    storage: 'Storage Space',
    api_access: 'API Access',
    priority_support: 'Priority Support',
    custom_branding: 'Custom Branding',
    advanced_analytics: 'Advanced Analytics',
    white_labeling: 'White Labeling',
    dedicated_manager: 'Dedicated Account Manager'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPlan ? 'Edit Plan' : '➕ Create New Plan'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Pro Plan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Plan ID *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., plan_pro"
                disabled={!!editingPlan}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this plan..."
              rows={2}
            />
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">💰 Pricing</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly">Monthly Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="monthly"
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => handleMonthlyPriceChange(e.target.value)}
                    className="pl-7"
                    placeholder="29.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearly">Yearly Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="yearly"
                    type="number"
                    value={yearlyPrice}
                    onChange={(e) => setYearlyPrice(e.target.value)}
                    className="pl-7"
                    placeholder="290.00"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Auto-calculated as monthly × 10</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="setup">Setup Fee</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="setup"
                    type="number"
                    value={setupFee}
                    onChange={(e) => setSetupFee(e.target.value)}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">📊 Limits</Label>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Max Users</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={maxUsers}
                  onChange={(e) => setMaxUsers(e.target.value)}
                  placeholder="0 = unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage">Storage (GB)</Label>
                <Input
                  id="storage"
                  type="number"
                  value={storageGb}
                  onChange={(e) => setStorageGb(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiCalls">API Calls/mo</Label>
                <Input
                  id="apiCalls"
                  type="number"
                  value={apiCalls}
                  onChange={(e) => setApiCalls(e.target.value)}
                  placeholder="0 = unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trial">Trial Days</Label>
                <Input
                  id="trial"
                  type="number"
                  value={trialDays}
                  onChange={(e) => setTrialDays(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">📋 Features Included</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(featureLabels).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={features[key] || false}
                    onCheckedChange={(checked) =>
                      setFeatures({ ...features, [key]: checked === true })
                    }
                  />
                  <Label htmlFor={key} className="font-normal cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">⚙️ Plan Settings</Label>
            <div className="flex items-center gap-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="isPublic">Publicly Visible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPopular"
                  checked={isPopular}
                  onCheckedChange={setIsPopular}
                />
                <Label htmlFor="isPopular">Mark as Popular</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
