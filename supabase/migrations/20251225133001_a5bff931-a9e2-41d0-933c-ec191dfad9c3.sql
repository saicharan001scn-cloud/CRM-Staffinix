-- Create enum types
CREATE TYPE public.visa_status AS ENUM ('H1B', 'OPT', 'CPT', 'GC', 'USC', 'L1', 'L2', 'H4 EAD', 'TN');
CREATE TYPE public.consultant_status AS ENUM ('bench', 'available', 'marketing', 'placed', 'interview');
CREATE TYPE public.job_type AS ENUM ('W2', 'C2C', 'Both', '1099');
CREATE TYPE public.job_source_type AS ENUM ('portal', 'vendor_email');
CREATE TYPE public.job_status AS ENUM ('open', 'closed', 'filled');
CREATE TYPE public.submission_status AS ENUM ('applied', 'submission', 'interview_scheduled', 'client_interview', 'offer_letter', 'placed', 'rejected');

-- Consultants table
CREATE TABLE public.consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  visa_status public.visa_status NOT NULL,
  skills TEXT[] DEFAULT '{}',
  rate NUMERIC(10,2) DEFAULT 0,
  resume_url TEXT,
  ai_summary TEXT,
  status public.consultant_status DEFAULT 'available',
  location TEXT,
  experience INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all consultants" ON public.consultants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert consultants" ON public.consultants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their consultants" ON public.consultants FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their consultants" ON public.consultants FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  recruiter_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  last_interaction TIMESTAMPTZ DEFAULT now(),
  trust_score INTEGER DEFAULT 50,
  total_submissions INTEGER DEFAULT 0,
  placements INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all vendors" ON public.vendors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert vendors" ON public.vendors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their vendors" ON public.vendors FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their vendors" ON public.vendors FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  location TEXT,
  job_type public.job_type DEFAULT 'Both',
  rate_min NUMERIC(10,2) DEFAULT 0,
  rate_max NUMERIC(10,2) DEFAULT 0,
  visa_requirements public.visa_status[] DEFAULT '{}',
  description TEXT,
  deadline TIMESTAMPTZ,
  source TEXT,
  source_type public.job_source_type DEFAULT 'portal',
  portal_apply_url TEXT,
  vendor_email TEXT,
  vendor_name TEXT,
  posted_date TIMESTAMPTZ DEFAULT now(),
  matched_consultants INTEGER DEFAULT 0,
  status public.job_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all jobs" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their jobs" ON public.jobs FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their jobs" ON public.jobs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  vendor_contact TEXT,
  submission_date TIMESTAMPTZ DEFAULT now(),
  status public.submission_status DEFAULT 'applied',
  applied_rate NUMERIC(10,2) DEFAULT 0,
  submission_rate NUMERIC(10,2),
  notes TEXT,
  interview_date TIMESTAMPTZ,
  offer_details TEXT,
  rate_confirmation_date TIMESTAMPTZ,
  status_changed_by TEXT,
  status_changed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all submissions" ON public.submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert submissions" ON public.submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their submissions" ON public.submissions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their submissions" ON public.submissions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Status history table
CREATE TABLE public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
  from_status public.submission_status,
  to_status public.submission_status NOT NULL,
  changed_by TEXT,
  changed_date TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view status history" ON public.status_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert status history" ON public.status_history FOR INSERT TO authenticated WITH CHECK (true);

-- Rate history table
CREATE TABLE public.rate_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
  old_rate NUMERIC(10,2),
  new_rate NUMERIC(10,2) NOT NULL,
  changed_by TEXT,
  changed_date TIMESTAMPTZ DEFAULT now(),
  reason TEXT,
  rate_type TEXT DEFAULT 'applied'
);

ALTER TABLE public.rate_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rate history" ON public.rate_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert rate history" ON public.rate_history FOR INSERT TO authenticated WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER update_consultants_updated_at BEFORE UPDATE ON public.consultants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();