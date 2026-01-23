import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  SubscriptionPlan, 
  CompanySubscription, 
  Payment, 
  Coupon, 
  BillingMetrics,
  PlanFeatures 
} from '@/types/billing';

export const useBillingData = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<CompanySubscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [metrics, setMetrics] = useState<BillingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('subscription_plans')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (!error && data) {
      setPlans(data.map((plan: any) => ({
        ...plan,
        features: (plan.features as PlanFeatures) || {}
      })));
    }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('company_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setSubscriptions(data.map((sub: any) => ({
        ...sub,
        payment_method: sub.payment_method || {},
        metadata: sub.metadata || {}
      })));
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (!error && data) {
      setPayments(data.map((payment: any) => ({
        ...payment,
        metadata: payment.metadata || {}
      })));
    }
  }, []);

  const fetchCoupons = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setCoupons(data as Coupon[]);
    }
  }, []);

  const calculateMetrics = useCallback(() => {
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const trialSubscriptions = subscriptions.filter(s => s.status === 'trial');
    
    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const plan = plans.find(p => p.id === sub.plan_id);
      if (!plan) return sum;
      return sum + (sub.billing_cycle === 'yearly' ? plan.yearly_price / 12 : plan.monthly_price);
    }, 0);

    const successfulPayments = payments.filter(p => p.status === 'succeeded');
    const pendingPayments = payments.filter(p => p.status === 'pending');

    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    const failedAmount = payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newCustomers = subscriptions.filter(s => new Date(s.created_at) >= thisMonth).length;

    setMetrics({
      mrr, arr: mrr * 12, totalRevenue, pendingPayments: pendingAmount, failedPayments: failedAmount,
      activeSubscriptions: activeSubscriptions.length, trialSubscriptions: trialSubscriptions.length,
      churnRate: 3.2, newCustomers, mrrGrowth: 15
    });
  }, [subscriptions, payments, plans]);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchPlans(), fetchSubscriptions(), fetchPayments(), fetchCoupons()]);
    setIsLoading(false);
  }, [fetchPlans, fetchSubscriptions, fetchPayments, fetchCoupons]);

  useEffect(() => { refreshAll(); }, [refreshAll]);
  useEffect(() => { if (plans.length) calculateMetrics(); }, [plans, subscriptions, payments, calculateMetrics]);

  const createPlan = async (plan: Partial<SubscriptionPlan>) => {
    const { data, error } = await (supabase as any).from('subscription_plans').insert(plan).select().single();
    if (!error) await fetchPlans();
    return { data, error };
  };

  const updatePlan = async (id: string, updates: Partial<SubscriptionPlan>) => {
    const { data, error } = await (supabase as any).from('subscription_plans').update(updates).eq('id', id).select().single();
    if (!error) await fetchPlans();
    return { data, error };
  };

  const createPayment = async (payment: Partial<Payment>) => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(payments.length + 1).padStart(4, '0')}`;
    const { data, error } = await (supabase as any).from('payments').insert({ ...payment, invoice_number: invoiceNumber }).select().single();
    if (!error) await fetchPayments();
    return { data, error };
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    const { data, error } = await (supabase as any).from('payments').update(updates).eq('id', id).select().single();
    if (!error) await fetchPayments();
    return { data, error };
  };

  const updateSubscription = async (id: string, updates: Partial<CompanySubscription>) => {
    const { data, error } = await (supabase as any).from('company_subscriptions').update(updates).eq('id', id).select().single();
    if (!error) await fetchSubscriptions();
    return { data, error };
  };

  const createCoupon = async (coupon: Partial<Coupon>) => {
    const { data, error } = await (supabase as any).from('coupons').insert(coupon).select().single();
    if (!error) await fetchCoupons();
    return { data, error };
  };

  const createSubscription = async (subscription: Partial<CompanySubscription>) => {
    const { data, error } = await (supabase as any).from('company_subscriptions').insert(subscription).select().single();
    if (!error) await fetchSubscriptions();
    return { data, error };
  };

  return { plans, subscriptions, payments, coupons, metrics, isLoading, refreshAll, createPlan, updatePlan, createPayment, updatePayment, updateSubscription, createSubscription, createCoupon };
};
