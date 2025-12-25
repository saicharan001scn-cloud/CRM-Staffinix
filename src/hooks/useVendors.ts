import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Vendor } from '@/types';

interface NewVendorInput {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  notes: string;
}

// Map database row to Vendor type
const mapDbToVendor = (row: any): Vendor => ({
  id: row.id,
  companyName: row.company_name,
  recruiterName: row.recruiter_name,
  email: row.email,
  phone: row.phone || '',
  notes: row.notes,
  lastInteraction: new Date(row.last_interaction).toLocaleDateString(),
  trustScore: row.trust_score || 50,
  totalSubmissions: row.total_submissions || 0,
  placements: row.placements || 0,
});

export function useVendors() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const vendorsQuery = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapDbToVendor);
    },
    enabled: !!user,
  });

  const addVendorMutation = useMutation({
    mutationFn: async (vendor: NewVendorInput) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('vendors')
        .insert({
          company_name: vendor.companyName,
          recruiter_name: vendor.contactPerson,
          email: vendor.email,
          phone: vendor.phone,
          notes: vendor.notes,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return mapDbToVendor(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor added successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to add vendor', { description: error.message });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete vendor', { description: error.message });
    },
  });

  return {
    vendors: vendorsQuery.data || [],
    isLoading: vendorsQuery.isLoading,
    error: vendorsQuery.error,
    addVendor: addVendorMutation.mutate,
    deleteVendor: deleteVendorMutation.mutate,
    isAddingVendor: addVendorMutation.isPending,
  };
}
