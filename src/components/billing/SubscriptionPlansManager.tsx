import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit2, 
  Copy, 
  Archive, 
  Users, 
  HardDrive, 
  Zap,
  Star,
  Check,
  X
} from 'lucide-react';
import { SubscriptionPlan } from '@/types/billing';
import { CreatePlanModal } from './CreatePlanModal';

interface SubscriptionPlansManagerProps {
  plans: SubscriptionPlan[];
  subscriptionCounts: Record<string, number>;
  onCreatePlan: (plan: Partial<SubscriptionPlan>) => Promise<{ error: Error | null }>;
  onUpdatePlan: (id: string, updates: Partial<SubscriptionPlan>) => Promise<{ error: Error | null }>;
}

export const SubscriptionPlansManager = ({
  plans,
  subscriptionCounts,
  onCreatePlan,
  onUpdatePlan
}: SubscriptionPlansManagerProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const handleDuplicate = async (plan: SubscriptionPlan) => {
    const { id, created_at, updated_at, slug, ...rest } = plan;
    await onCreatePlan({
      ...rest,
      name: `${plan.name} (Copy)`,
      slug: `${plan.slug}-copy-${Date.now()}`,
      is_popular: false
    });
  };

  const handleArchive = async (plan: SubscriptionPlan) => {
    await onUpdatePlan(plan.id, { is_active: false, is_public: false });
  };

  const getFeaturesList = (features: SubscriptionPlan['features']) => {
    const featureLabels: Record<string, string> = {
      user_management: 'User Management',
      storage: 'Storage',
      api_access: 'API Access',
      priority_support: 'Priority Support',
      custom_branding: 'Custom Branding',
      advanced_analytics: 'Advanced Analytics',
      white_labeling: 'White Labeling',
      dedicated_manager: 'Dedicated Account Manager'
    };

    return Object.entries(features).map(([key, value]) => ({
      name: featureLabels[key] || key,
      enabled: value
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          Subscription Plans ({plans.length})
        </CardTitle>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Plan
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-4 transition-all hover:shadow-md ${
              plan.is_popular ? 'border-primary ring-1 ring-primary' : 'border-border'
            } ${!plan.is_active ? 'opacity-60 bg-muted/30' : ''}`}
          >
            {plan.is_popular && (
              <div className="flex justify-center -mt-7 mb-2">
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <Star className="h-3 w-3" />
                  MOST POPULAR
                </Badge>
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  {!plan.is_active && (
                    <Badge variant="secondary">Archived</Badge>
                  )}
                  {!plan.is_public && plan.is_active && (
                    <Badge variant="outline">Hidden</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPlan(plan)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(plan)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {plan.is_active && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(plan)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pricing */}
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  ${plan.monthly_price}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ${plan.yearly_price}/year (Save ${(plan.monthly_price * 12 - plan.yearly_price).toFixed(0)})
                </div>
                {plan.setup_fee > 0 && (
                  <div className="text-xs text-muted-foreground">
                    + ${plan.setup_fee} setup fee
                  </div>
                )}
              </div>

              {/* Limits */}
              <div className="flex gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{plan.max_users === 0 ? 'Unlimited' : plan.max_users} Users</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span>{plan.storage_gb >= 1000 ? `${plan.storage_gb / 1000}TB` : `${plan.storage_gb}GB`}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>{plan.api_calls_per_month === 0 ? 'Unlimited' : `${(plan.api_calls_per_month / 1000).toFixed(0)}k`} API</span>
                </div>
              </div>

              {/* Subscription Count */}
              <div className="flex items-center justify-end gap-2">
                <Badge variant="secondary" className="text-sm">
                  {subscriptionCounts[plan.id] || 0} Companies subscribed
                </Badge>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4 flex flex-wrap gap-2">
              {getFeaturesList(plan.features).map((feature) => (
                <div
                  key={feature.name}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    feature.enabled 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground line-through'
                  }`}
                >
                  {feature.enabled ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                  {feature.name}
                </div>
              ))}
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No subscription plans yet.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create your first plan
            </Button>
          </div>
        )}
      </CardContent>

      <CreatePlanModal
        isOpen={isCreateModalOpen || !!editingPlan}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={async (plan) => {
          if (editingPlan) {
            await onUpdatePlan(editingPlan.id, plan);
          } else {
            await onCreatePlan(plan);
          }
        }}
        editingPlan={editingPlan}
      />
    </Card>
  );
};
