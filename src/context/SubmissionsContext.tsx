import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Submission, SubmissionStatus, StatusHistoryEntry, RateHistoryEntry } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SubmissionsContextType {
  submissions: Submission[];
  isLoading: boolean;
  addSubmission: (submission: Omit<Submission, 'statusHistory' | 'rateHistory' | 'id'>) => Promise<void>;
  updateStatus: (submissionId: string, newStatus: SubmissionStatus, notes?: string, changedBy?: string) => Promise<void>;
  updateRate: (submissionId: string, newRate: number, reason?: string, vendorContact?: string, changedBy?: string) => Promise<void>;
  getSubmissionsByStatus: (status: SubmissionStatus) => Submission[];
  statusFilter: SubmissionStatus | 'all';
  setStatusFilter: (filter: SubmissionStatus | 'all') => void;
  rateFilter: 'all' | 'increased' | 'decreased' | 'same';
  setRateFilter: (filter: 'all' | 'increased' | 'decreased' | 'same') => void;
  refetch: () => Promise<void>;
}

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

// Helper to map database submission status to app type
const mapDbStatus = (status: string): SubmissionStatus => {
  return status as SubmissionStatus;
};

// Helper to map database row to Submission type
const mapDbToSubmission = (
  row: any,
  statusHistory: StatusHistoryEntry[],
  rateHistory: RateHistoryEntry[],
  consultantName: string,
  vendorName: string,
  jobTitle: string,
  client: string
): Submission => ({
  id: row.id,
  consultantId: row.consultant_id,
  consultantName,
  vendorId: row.vendor_id,
  vendorName,
  vendorContact: row.vendor_contact,
  jobId: row.job_id,
  jobTitle,
  client,
  submissionDate: new Date(row.submission_date).toISOString().split('T')[0],
  status: mapDbStatus(row.status),
  appliedRate: Number(row.applied_rate) || 0,
  submissionRate: row.submission_rate ? Number(row.submission_rate) : undefined,
  rate: row.submission_rate ? Number(row.submission_rate) : Number(row.applied_rate) || 0,
  notes: row.notes,
  interviewDate: row.interview_date ? new Date(row.interview_date).toISOString().split('T')[0] : undefined,
  offerDetails: row.offer_details,
  rateConfirmationDate: row.rate_confirmation_date ? new Date(row.rate_confirmation_date).toISOString().split('T')[0] : undefined,
  statusChangedBy: row.status_changed_by,
  statusChangedDate: row.status_changed_date,
  statusHistory,
  rateHistory,
});

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [rateFilter, setRateFilter] = useState<'all' | 'increased' | 'decreased' | 'same'>('all');

  const fetchSubmissions = async () => {
    if (!user) {
      setSubmissions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch submissions with related data
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      if (!submissionsData || submissionsData.length === 0) {
        setSubmissions([]);
        setIsLoading(false);
        return;
      }

      // Fetch all related data
      const consultantIds = [...new Set(submissionsData.map(s => s.consultant_id))];
      const vendorIds = [...new Set(submissionsData.map(s => s.vendor_id))];
      const jobIds = [...new Set(submissionsData.map(s => s.job_id))];
      const submissionIds = submissionsData.map(s => s.id);

      const [consultantsRes, vendorsRes, jobsRes, statusHistoryRes, rateHistoryRes] = await Promise.all([
        supabase.from('consultants').select('id, name').in('id', consultantIds),
        supabase.from('vendors').select('id, company_name').in('id', vendorIds),
        supabase.from('jobs').select('id, title, client').in('id', jobIds),
        supabase.from('status_history').select('*').in('submission_id', submissionIds).order('changed_date', { ascending: true }),
        supabase.from('rate_history').select('*').in('submission_id', submissionIds).order('changed_date', { ascending: true }),
      ]);

      // Create lookup maps
      const consultantsMap = new Map((consultantsRes.data || []).map(c => [c.id, c.name]));
      const vendorsMap = new Map((vendorsRes.data || []).map(v => [v.id, v.company_name]));
      const jobsMap = new Map((jobsRes.data || []).map(j => [j.id, { title: j.title, client: j.client }]));

      // Group history by submission
      const statusHistoryMap = new Map<string, StatusHistoryEntry[]>();
      const rateHistoryMap = new Map<string, RateHistoryEntry[]>();

      (statusHistoryRes.data || []).forEach(sh => {
        const entries = statusHistoryMap.get(sh.submission_id) || [];
        entries.push({
          id: sh.id,
          fromStatus: sh.from_status as SubmissionStatus | null,
          toStatus: sh.to_status as SubmissionStatus,
          changedBy: sh.changed_by || 'System',
          changedDate: sh.changed_date,
          notes: sh.notes,
        });
        statusHistoryMap.set(sh.submission_id, entries);
      });

      (rateHistoryRes.data || []).forEach(rh => {
        const entries = rateHistoryMap.get(rh.submission_id) || [];
        entries.push({
          id: rh.id,
          oldRate: rh.old_rate ? Number(rh.old_rate) : null,
          newRate: Number(rh.new_rate),
          changedBy: rh.changed_by || 'System',
          changedDate: rh.changed_date,
          reason: rh.reason,
          type: rh.rate_type as 'applied' | 'negotiated',
        });
        rateHistoryMap.set(rh.submission_id, entries);
      });

      // Map submissions
      const mappedSubmissions = submissionsData.map(row => {
        const job = jobsMap.get(row.job_id) || { title: 'Unknown Job', client: 'Unknown Client' };
        return mapDbToSubmission(
          row,
          statusHistoryMap.get(row.id) || [],
          rateHistoryMap.get(row.id) || [],
          consultantsMap.get(row.consultant_id) || 'Unknown Consultant',
          vendorsMap.get(row.vendor_id) || 'Unknown Vendor',
          job.title,
          job.client
        );
      });

      setSubmissions(mappedSubmissions);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  const addSubmission = async (submission: Omit<Submission, 'statusHistory' | 'rateHistory' | 'id'>) => {
    if (!user) return;

    const now = new Date().toISOString();

    try {
      // Insert submission
      const { data: newSubmission, error: subError } = await supabase
        .from('submissions')
        .insert({
          consultant_id: submission.consultantId,
          vendor_id: submission.vendorId,
          job_id: submission.jobId,
          vendor_contact: submission.vendorContact,
          submission_date: now,
          status: 'applied',
          applied_rate: submission.appliedRate,
          notes: submission.notes,
          user_id: user.id,
          status_changed_by: 'Admin',
          status_changed_date: now,
        })
        .select()
        .single();

      if (subError) throw subError;

      // Insert initial status history
      await supabase.from('status_history').insert({
        submission_id: newSubmission.id,
        from_status: null,
        to_status: 'applied',
        changed_by: 'Admin',
        changed_date: now,
        notes: 'Resume shared with vendor',
      });

      // Insert initial rate history
      await supabase.from('rate_history').insert({
        submission_id: newSubmission.id,
        old_rate: null,
        new_rate: submission.appliedRate,
        changed_by: 'Admin',
        changed_date: now,
        rate_type: 'applied',
        reason: 'Initial rate proposal',
      });

      toast.success('Submission added successfully!');
      await fetchSubmissions();
    } catch (error: any) {
      console.error('Error adding submission:', error);
      toast.error('Failed to add submission', { description: error.message });
    }
  };

  const updateStatus = async (submissionId: string, newStatus: SubmissionStatus, notes?: string, changedBy: string = 'Admin') => {
    if (!user) return;

    const now = new Date().toISOString();
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    try {
      // Update submission
      const updateData: any = {
        status: newStatus,
        status_changed_by: changedBy,
        status_changed_date: now,
      };

      if (newStatus === 'submission' && !submission.rateConfirmationDate) {
        updateData.rate_confirmation_date = now;
      }

      const { error: updateError } = await supabase
        .from('submissions')
        .update(updateData)
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // Insert status history
      await supabase.from('status_history').insert({
        submission_id: submissionId,
        from_status: submission.status,
        to_status: newStatus,
        changed_by: changedBy,
        changed_date: now,
        notes,
      });

      toast.success('Status updated successfully!');
      await fetchSubmissions();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', { description: error.message });
    }
  };

  const updateRate = async (
    submissionId: string,
    newRate: number,
    reason?: string,
    vendorContact?: string,
    changedBy: string = 'Admin'
  ) => {
    if (!user) return;

    const now = new Date().toISOString();
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    try {
      // Update submission
      const updateData: any = {
        submission_rate: newRate,
      };

      if (vendorContact) {
        updateData.vendor_contact = vendorContact;
      }

      const { error: updateError } = await supabase
        .from('submissions')
        .update(updateData)
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // Insert rate history
      await supabase.from('rate_history').insert({
        submission_id: submissionId,
        old_rate: submission.submissionRate || submission.appliedRate,
        new_rate: newRate,
        changed_by: changedBy,
        changed_date: now,
        rate_type: 'negotiated',
        reason,
      });

      toast.success('Rate updated successfully!');
      await fetchSubmissions();
    } catch (error: any) {
      console.error('Error updating rate:', error);
      toast.error('Failed to update rate', { description: error.message });
    }
  };

  const getSubmissionsByStatus = (status: SubmissionStatus) => {
    return submissions.filter(sub => sub.status === status);
  };

  return (
    <SubmissionsContext.Provider value={{
      submissions,
      isLoading,
      addSubmission,
      updateStatus,
      updateRate,
      getSubmissionsByStatus,
      statusFilter,
      setStatusFilter,
      rateFilter,
      setRateFilter,
      refetch: fetchSubmissions,
    }}>
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionsContext);
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionsProvider');
  }
  return context;
}