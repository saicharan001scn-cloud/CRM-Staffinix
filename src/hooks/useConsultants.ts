import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Consultant, VisaStatus, ConsultantStatus } from '@/types';

interface DBConsultant {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  visa_status: string;
  skills: string[];
  rate: number;
  resume_url: string | null;
  ai_summary: string | null;
  status: string;
  location: string | null;
  experience: number;
  created_at: string;
  updated_at: string;
}

const mapDBToConsultant = (db: DBConsultant): Consultant => ({
  id: db.id,
  name: db.name,
  email: db.email,
  phone: db.phone || '',
  visaStatus: db.visa_status as VisaStatus,
  skills: db.skills || [],
  rate: Number(db.rate) || 0,
  resumeUrl: db.resume_url || undefined,
  aiSummary: db.ai_summary || undefined,
  status: db.status as ConsultantStatus,
  location: db.location || '',
  experience: db.experience || 0,
  lastUpdated: db.updated_at.split('T')[0],
});

export interface NewConsultantInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  visaStatus: VisaStatus;
  skills: string[];
  rate: number;
  status: ConsultantStatus;
  location: string;
  experience?: number;
}

export function useConsultants() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: consultants = [], isLoading, error } = useQuery({
    queryKey: ['consultants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as DBConsultant[]).map(mapDBToConsultant);
    },
    enabled: !!user,
  });

  const addConsultant = useMutation({
    mutationFn: async (input: NewConsultantInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('consultants')
        .insert({
          user_id: user.id,
          name: `${input.firstName} ${input.lastName}`.trim(),
          email: input.email || '',
          phone: input.phone || null,
          visa_status: input.visaStatus,
          skills: input.skills,
          rate: input.rate,
          status: input.status,
          location: input.location,
          experience: input.experience || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return mapDBToConsultant(data as DBConsultant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      toast.success('Consultant added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add consultant', { description: error.message });
    },
  });

  const deleteConsultant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('consultants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      toast.success('Consultant deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete consultant', { description: error.message });
    },
  });

  return {
    consultants,
    isLoading,
    error,
    addConsultant,
    deleteConsultant,
  };
}
