export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  monthly_price: number;
  yearly_price: number;
  setup_fee: number;
  features: PlanFeatures;
  max_users: number;
  storage_gb: number;
  api_calls_per_month: number;
  trial_days: number;
  is_active: boolean;
  is_public: boolean;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PlanFeatures {
  user_management?: boolean;
  storage?: boolean;
  api_access?: boolean;
  priority_support?: boolean;
  custom_branding?: boolean;
  advanced_analytics?: boolean;
  white_labeling?: boolean;
  dedicated_manager?: boolean;
  [key: string]: boolean | undefined;
}

export interface CompanySubscription {
  id: string;
  company_name: string;
  company_email: string;
  admin_user_id: string | null;
  plan_id: string | null;
  status: 'active' | 'trial' | 'past_due' | 'cancelled' | 'suspended';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string | null;
  trial_ends_at: string | null;
  auto_renew: boolean;
  payment_method: PaymentMethodInfo;
  users_count: number;
  storage_used_gb: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface PaymentMethodInfo {
  type?: string;
  last_four?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
}

export interface Payment {
  id: string;
  subscription_id: string | null;
  company_name: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded' | 'cancelled';
  payment_method: string | null;
  invoice_number: string | null;
  description: string | null;
  failure_reason: string | null;
  refunded_at: string | null;
  refund_reason: string | null;
  receipt_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  applies_to_plans: string[];
  max_uses: number | null;
  times_used: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface BillingMetrics {
  mrr: number;
  arr: number;
  totalRevenue: number;
  pendingPayments: number;
  failedPayments: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  churnRate: number;
  newCustomers: number;
  mrrGrowth: number;
}
