export type AppRole = 'super_admin' | 'admin' | 'user';
export type AccountStatus = 'active' | 'suspended' | 'pending';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  account_status: AccountStatus;
  last_login: string | null;
  phone: string | null;
  department: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_by: string | null;
  assigned_at: string;
  expires_at: string | null;
}

export interface UserWithRole extends UserProfile {
  role?: AppRole;
  roles?: UserRole[];
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface LoginHistory {
  id: string;
  user_id: string;
  login_at: string;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  failure_reason: string | null;
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  role: AppRole;
  company_name?: string;
  phone?: string;
  department?: string;
  notes?: string;
  send_welcome_email: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingUsers: number;
  admins: number;
  superAdmins: number;
  recentLogins: number;
  recentActivities: number;
}
