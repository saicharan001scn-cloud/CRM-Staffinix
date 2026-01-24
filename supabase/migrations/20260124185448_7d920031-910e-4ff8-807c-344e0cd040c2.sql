-- Create table for API keys with secure storage
CREATE TABLE public.admin_api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- First 8 chars for display
  service TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  scopes TEXT[] DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for API key audit logs
CREATE TABLE public.api_key_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES public.admin_api_keys(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'created', 'viewed', 'regenerated', 'revoked', 'updated'
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for webhook configurations
CREATE TABLE public.admin_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  events TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_key_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_api_keys
CREATE POLICY "Admins can view their own API keys"
ON public.admin_api_keys
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can insert their own API keys"
ON public.admin_api_keys
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update their own API keys"
ON public.admin_api_keys
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete their own API keys"
ON public.admin_api_keys
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id AND public.is_admin(auth.uid())
);

-- RLS Policies for api_key_audit_logs
CREATE POLICY "Admins can view their own audit logs"
ON public.api_key_audit_logs
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can insert audit logs"
ON public.api_key_audit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND public.is_admin(auth.uid())
);

-- RLS Policies for admin_webhooks
CREATE POLICY "Admins can manage their own webhooks"
ON public.admin_webhooks
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id AND public.is_admin(auth.uid())
)
WITH CHECK (
  auth.uid() = user_id AND public.is_admin(auth.uid())
);

-- Add triggers for updated_at
CREATE TRIGGER update_admin_api_keys_updated_at
BEFORE UPDATE ON public.admin_api_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_webhooks_updated_at
BEFORE UPDATE ON public.admin_webhooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();