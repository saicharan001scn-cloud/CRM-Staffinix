import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { JobRequirement, JobType, JobSourceType, VisaStatus } from '@/types';

interface NewJobInput {
  title: string;
  location: string;
  client: string;
  description: string;
  skills: string[];
  minRate: number;
  maxRate: number;
  visaRequirements: string[];
  source: string;
  sourceType: JobSourceType;
  portalApplyUrl?: string;
  vendorEmail?: string;
  vendorName?: string;
  jobType?: JobType;
  deadline?: string;
}

// Map database row to JobRequirement type
const mapDbToJob = (row: any): JobRequirement => ({
  id: row.id,
  title: row.title,
  client: row.client,
  skills: row.skills || [],
  location: row.location || '',
  jobType: (row.job_type as JobType) || 'Both',
  rate: {
    min: Number(row.rate_min) || 0,
    max: Number(row.rate_max) || 0,
  },
  visaRequirements: (row.visa_requirements || []) as VisaStatus[],
  description: row.description || '',
  deadline: row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : '',
  source: row.source || '',
  sourceType: (row.source_type as JobSourceType) || 'portal',
  portalApplyUrl: row.portal_apply_url,
  vendorEmail: row.vendor_email,
  vendorName: row.vendor_name,
  postedDate: new Date(row.posted_date || row.created_at).toISOString().split('T')[0],
  matchedConsultants: row.matched_consultants || 0,
  status: row.status || 'open',
});

export function useJobs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapDbToJob);
    },
    enabled: !!user,
  });

  const addJobMutation = useMutation({
    mutationFn: async (job: NewJobInput) => {
      if (!user) throw new Error('User not authenticated');

      const insertData = {
        title: job.title,
        client: job.client,
        location: job.location,
        description: job.description,
        skills: job.skills,
        rate_min: job.minRate,
        rate_max: job.maxRate,
        visa_requirements: job.visaRequirements as any,
        source: job.source,
        source_type: job.sourceType as any,
        portal_apply_url: job.portalApplyUrl,
        vendor_email: job.vendorEmail,
        vendor_name: job.vendorName,
        job_type: (job.jobType || 'Both') as any,
        deadline: job.deadline ? new Date(job.deadline).toISOString() : null,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return mapDbToJob(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job added successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to add job', { description: error.message });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete job', { description: error.message });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ jobId, updates }: { jobId: string; updates: Partial<NewJobInput> }) => {
      const updateData: any = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.client) updateData.client = updates.client;
      if (updates.location) updateData.location = updates.location;
      if (updates.description) updateData.description = updates.description;
      if (updates.skills) updateData.skills = updates.skills;
      if (updates.minRate !== undefined) updateData.rate_min = updates.minRate;
      if (updates.maxRate !== undefined) updateData.rate_max = updates.maxRate;
      if (updates.visaRequirements) updateData.visa_requirements = updates.visaRequirements;
      if (updates.source) updateData.source = updates.source;
      if (updates.sourceType) updateData.source_type = updates.sourceType;

      const { error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job updated successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update job', { description: error.message });
    },
  });

  return {
    jobs: jobsQuery.data || [],
    isLoading: jobsQuery.isLoading,
    error: jobsQuery.error,
    addJob: addJobMutation.mutate,
    deleteJob: deleteJobMutation.mutate,
    updateJob: updateJobMutation.mutate,
    isAddingJob: addJobMutation.isPending,
  };
}
