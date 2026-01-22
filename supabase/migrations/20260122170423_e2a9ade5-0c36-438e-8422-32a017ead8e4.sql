-- Subscription Plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  monthly_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  yearly_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  features JSONB DEFAULT '{}',
  max_users INTEGER DEFAULT 10,
  storage_gb INTEGER DEFAULT 50,
  api_calls_per_month INTEGER DEFAULT 10000,
  trial_days INTEGER DEFAULT 14,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Company Subscriptions table
CREATE TABLE public.company_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  admin_user_id UUID REFERENCES auth.users(id),
  plan_id UUID REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('active', 'trial', 'past_due', 'cancelled', 'suspended')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  payment_method JSONB DEFAULT '{}',
  users_count INTEGER DEFAULT 0,
  storage_used_gb DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES public.company_subscriptions(id),
  company_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded', 'cancelled')),
  payment_method TEXT,
  invoice_number TEXT UNIQUE,
  description TEXT,
  failure_reason TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_reason TEXT,
  receipt_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  applies_to_plans UUID[] DEFAULT '{}',
  max_uses INTEGER,
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (Super Admin can manage, all can view active public plans)
CREATE POLICY "Super admins can manage subscription plans"
ON public.subscription_plans
FOR ALL
USING (is_super_admin(auth.uid()));

CREATE POLICY "Anyone can view active public plans"
ON public.subscription_plans
FOR SELECT
USING (is_active = true AND is_public = true);

-- RLS Policies for company_subscriptions (Super Admin only)
CREATE POLICY "Super admins can manage company subscriptions"
ON public.company_subscriptions
FOR ALL
USING (is_super_admin(auth.uid()));

-- RLS Policies for payments (Super Admin only)
CREATE POLICY "Super admins can manage payments"
ON public.payments
FOR ALL
USING (is_super_admin(auth.uid()));

-- RLS Policies for coupons (Super Admin only)
CREATE POLICY "Super admins can manage coupons"
ON public.coupons
FOR ALL
USING (is_super_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_company_subscriptions_status ON public.company_subscriptions(status);
CREATE INDEX idx_company_subscriptions_plan_id ON public.company_subscriptions(plan_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_subscription_id ON public.payments(subscription_id);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX idx_coupons_code ON public.coupons(code);

-- Add triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_subscriptions_updated_at
BEFORE UPDATE ON public.company_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, slug, description, monthly_price, yearly_price, max_users, storage_gb, api_calls_per_month, features, is_popular, sort_order) VALUES
('Basic', 'basic', 'Perfect for small teams getting started', 29.00, 290.00, 10, 50, 10000, '{"user_management": true, "storage": true, "api_access": true, "priority_support": false, "custom_branding": false, "advanced_analytics": false, "white_labeling": false, "dedicated_manager": false}', false, 1),
('Pro', 'pro', 'Best for growing businesses', 79.00, 750.00, 50, 500, 100000, '{"user_management": true, "storage": true, "api_access": true, "priority_support": true, "custom_branding": true, "advanced_analytics": true, "white_labeling": false, "dedicated_manager": false}', true, 2),
('Enterprise', 'enterprise', 'For large organizations with custom needs', 199.00, 1990.00, 0, 2000, 0, '{"user_management": true, "storage": true, "api_access": true, "priority_support": true, "custom_branding": true, "advanced_analytics": true, "white_labeling": true, "dedicated_manager": true}', false, 3);