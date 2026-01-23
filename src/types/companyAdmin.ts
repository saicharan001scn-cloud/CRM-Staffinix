export interface CompanyAdmin {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  last_login: string | null;
  account_status: 'active' | 'suspended' | 'pending';
  created_at: string;
  // Derived from company_subscriptions
  company_status?: 'active' | 'trial' | 'past_due' | 'cancelled' | 'suspended';
  trial_ends_at?: string | null;
  subscription_id?: string;
  // Session status (simulated for now)
  is_online?: boolean;
}

export interface CompanyAdminFilters {
  search: string;
  status: 'all' | 'active' | 'trial' | 'suspended' | 'past_due' | 'cancelled';
}

export interface PlatformAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  variant?: 'default' | 'warning' | 'destructive';
  requiresConfirmation?: boolean;
}

export interface PlatformActionSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  actions: PlatformAction[];
}
