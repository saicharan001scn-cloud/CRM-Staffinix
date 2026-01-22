import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBillingData } from '@/hooks/useBillingData';
import { SubscriptionPlansManager } from '@/components/billing/SubscriptionPlansManager';
import { PaymentsDashboard } from '@/components/billing/PaymentsDashboard';
import { CompanySubscriptionsManager } from '@/components/billing/CompanySubscriptionsManager';
import { SalesAnalytics } from '@/components/billing/SalesAnalytics';
import { CouponsManager } from '@/components/billing/CouponsManager';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';
import { useMemo } from 'react';

const BillingManagement = () => {
  const {
    plans,
    subscriptions,
    payments,
    coupons,
    metrics,
    isLoading,
    refreshAll,
    createPlan,
    updatePlan,
    createPayment,
    updatePayment,
    updateSubscription,
    createCoupon
  } = useBillingData();

  // Calculate subscription counts per plan
  const subscriptionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    subscriptions.forEach(sub => {
      if (sub.plan_id && sub.status === 'active') {
        counts[sub.plan_id] = (counts[sub.plan_id] || 0) + 1;
      }
    });
    return counts;
  }, [subscriptions]);

  if (isLoading) {
    return (
      <MainLayout 
        title="💳 Billing Management" 
        subtitle="Loading billing data..."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="💳 Payment & Subscription Management" 
      subtitle="Manage plans, payments, and company subscriptions"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">MRR</p>
                  <p className="text-2xl font-bold">${metrics?.mrr.toLocaleString() || 0}</p>
                  {metrics?.mrrGrowth && (
                    <p className="text-xs text-green-600">+{metrics.mrrGrowth}% growth</p>
                  )}
                </div>
                <DollarSign className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Companies</p>
                  <p className="text-2xl font-bold">{metrics?.activeSubscriptions || 0}</p>
                  <p className="text-xs text-muted-foreground">+{metrics?.trialSubscriptions || 0} trials</p>
                </div>
                <Users className="h-8 w-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold">${metrics?.pendingPayments.toLocaleString() || 0}</p>
                  <p className="text-xs text-muted-foreground">Awaiting processing</p>
                </div>
                <CreditCard className="h-8 w-8 text-yellow-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ARR</p>
                  <p className="text-2xl font-bold">${metrics?.arr.toLocaleString() || 0}</p>
                  <p className="text-xs text-muted-foreground">Projected yearly</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={refreshAll} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="plans">📦 Plans</TabsTrigger>
            <TabsTrigger value="payments">💰 Payments</TabsTrigger>
            <TabsTrigger value="subscriptions">🏢 Subscriptions</TabsTrigger>
            <TabsTrigger value="coupons">🎫 Coupons</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <SubscriptionPlansManager
              plans={plans}
              subscriptionCounts={subscriptionCounts}
              onCreatePlan={createPlan}
              onUpdatePlan={updatePlan}
            />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsDashboard
              payments={payments}
              onUpdatePayment={updatePayment}
              onCreatePayment={createPayment}
            />
          </TabsContent>

          <TabsContent value="subscriptions">
            <CompanySubscriptionsManager
              subscriptions={subscriptions}
              plans={plans}
              onUpdateSubscription={updateSubscription}
            />
          </TabsContent>

          <TabsContent value="coupons">
            <CouponsManager
              coupons={coupons}
              onCreateCoupon={createCoupon}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <SalesAnalytics
              metrics={metrics}
              plans={plans}
              subscriptions={subscriptions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default BillingManagement;
