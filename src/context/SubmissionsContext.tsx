import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Submission, SubmissionStatus, StatusHistoryEntry } from '@/types';

// Updated mock data with new status types
const initialSubmissions: Submission[] = [
  {
    id: '1',
    consultantId: '1',
    consultantName: 'Rajesh Kumar',
    vendorId: '1',
    vendorName: 'TechStaff Solutions',
    jobId: '1',
    jobTitle: 'Senior Java Developer',
    client: 'Fortune 500 Bank',
    submissionDate: '2024-01-15',
    status: 'client_interview',
    rate: 75,
    interviewDate: '2024-01-18',
    notes: 'Client very interested. Technical round scheduled.',
    rateConfirmationDate: '2024-01-14',
    statusChangedBy: 'Admin',
    statusChangedDate: '2024-01-16T10:30:00',
    statusHistory: [
      { id: '1-1', fromStatus: null, toStatus: 'applied', changedBy: 'Admin', changedDate: '2024-01-13T09:00:00' },
      { id: '1-2', fromStatus: 'applied', toStatus: 'submission', changedBy: 'Admin', changedDate: '2024-01-14T14:00:00', notes: 'Rate confirmed at $75/hr' },
      { id: '1-3', fromStatus: 'submission', toStatus: 'interview_scheduled', changedBy: 'Admin', changedDate: '2024-01-15T11:00:00' },
      { id: '1-4', fromStatus: 'interview_scheduled', toStatus: 'client_interview', changedBy: 'Admin', changedDate: '2024-01-16T10:30:00' }
    ]
  },
  {
    id: '2',
    consultantId: '2',
    consultantName: 'Priya Sharma',
    vendorId: '2',
    vendorName: 'Apex Consulting',
    jobId: '2',
    jobTitle: 'React Frontend Engineer',
    client: 'Tech Startup',
    submissionDate: '2024-01-14',
    status: 'applied',
    rate: 65,
    notes: 'Resume shared. Awaiting rate confirmation.',
    statusChangedBy: 'Admin',
    statusChangedDate: '2024-01-14T09:00:00',
    statusHistory: [
      { id: '2-1', fromStatus: null, toStatus: 'applied', changedBy: 'Admin', changedDate: '2024-01-14T09:00:00' }
    ]
  },
  {
    id: '3',
    consultantId: '3',
    consultantName: 'Amit Patel',
    vendorId: '3',
    vendorName: 'Global IT Partners',
    jobId: '3',
    jobTitle: 'ML Engineer - NLP',
    client: 'AI Research Company',
    submissionDate: '2024-01-13',
    status: 'offer_letter',
    rate: 90,
    offerDetails: '$90/hr C2C, 12 month contract',
    rateConfirmationDate: '2024-01-12',
    statusChangedBy: 'Admin',
    statusChangedDate: '2024-01-17T16:00:00',
    statusHistory: [
      { id: '3-1', fromStatus: null, toStatus: 'applied', changedBy: 'Admin', changedDate: '2024-01-11T10:00:00' },
      { id: '3-2', fromStatus: 'applied', toStatus: 'submission', changedBy: 'Admin', changedDate: '2024-01-12T11:00:00', notes: 'Rate confirmed' },
      { id: '3-3', fromStatus: 'submission', toStatus: 'interview_scheduled', changedBy: 'Admin', changedDate: '2024-01-13T09:00:00' },
      { id: '3-4', fromStatus: 'interview_scheduled', toStatus: 'client_interview', changedBy: 'Admin', changedDate: '2024-01-14T14:00:00' },
      { id: '3-5', fromStatus: 'client_interview', toStatus: 'offer_letter', changedBy: 'Admin', changedDate: '2024-01-17T16:00:00', notes: 'Offer received!' }
    ]
  },
  {
    id: '4',
    consultantId: '4',
    consultantName: 'Sneha Reddy',
    vendorId: '4',
    vendorName: 'Prime Staffing Inc',
    jobId: '4',
    jobTitle: 'Salesforce Architect',
    client: 'Healthcare Provider',
    submissionDate: '2024-01-12',
    status: 'interview_scheduled',
    rate: 80,
    interviewDate: '2024-01-17',
    notes: 'Panel interview with 3 stakeholders.',
    rateConfirmationDate: '2024-01-11',
    statusChangedBy: 'Admin',
    statusChangedDate: '2024-01-15T10:00:00',
    statusHistory: [
      { id: '4-1', fromStatus: null, toStatus: 'applied', changedBy: 'Admin', changedDate: '2024-01-10T09:00:00' },
      { id: '4-2', fromStatus: 'applied', toStatus: 'submission', changedBy: 'Admin', changedDate: '2024-01-11T14:00:00', notes: 'Rate confirmed at $80/hr' },
      { id: '4-3', fromStatus: 'submission', toStatus: 'interview_scheduled', changedBy: 'Admin', changedDate: '2024-01-15T10:00:00' }
    ]
  },
  {
    id: '5',
    consultantId: '5',
    consultantName: 'Vikram Singh',
    vendorId: '1',
    vendorName: 'TechStaff Solutions',
    jobId: '5',
    jobTitle: 'DevOps Lead - Azure',
    client: 'Insurance Company',
    submissionDate: '2024-01-10',
    status: 'placed',
    rate: 90,
    offerDetails: 'Started 01/15. 18 month contract.',
    rateConfirmationDate: '2024-01-08',
    statusChangedBy: 'Admin',
    statusChangedDate: '2024-01-15T08:00:00',
    statusHistory: [
      { id: '5-1', fromStatus: null, toStatus: 'applied', changedBy: 'Admin', changedDate: '2024-01-05T10:00:00' },
      { id: '5-2', fromStatus: 'applied', toStatus: 'submission', changedBy: 'Admin', changedDate: '2024-01-08T11:00:00' },
      { id: '5-3', fromStatus: 'submission', toStatus: 'interview_scheduled', changedBy: 'Admin', changedDate: '2024-01-09T09:00:00' },
      { id: '5-4', fromStatus: 'interview_scheduled', toStatus: 'client_interview', changedBy: 'Admin', changedDate: '2024-01-10T14:00:00' },
      { id: '5-5', fromStatus: 'client_interview', toStatus: 'offer_letter', changedBy: 'Admin', changedDate: '2024-01-12T16:00:00' },
      { id: '5-6', fromStatus: 'offer_letter', toStatus: 'placed', changedBy: 'Admin', changedDate: '2024-01-15T08:00:00', notes: 'Started work!' }
    ]
  },
  {
    id: '6',
    consultantId: '6',
    consultantName: 'Ananya Gupta',
    vendorId: '2',
    vendorName: 'Apex Consulting',
    jobId: '2',
    jobTitle: 'React Frontend Engineer',
    client: 'Tech Startup',
    submissionDate: '2024-01-16',
    status: 'submission',
    rate: 55,
    notes: 'Rate confirmed. Submitted to client.',
    rateConfirmationDate: '2024-01-15',
    statusChangedBy: 'Admin',
    statusChangedDate: '2024-01-16T11:00:00',
    statusHistory: [
      { id: '6-1', fromStatus: null, toStatus: 'applied', changedBy: 'Admin', changedDate: '2024-01-14T10:00:00' },
      { id: '6-2', fromStatus: 'applied', toStatus: 'submission', changedBy: 'Admin', changedDate: '2024-01-16T11:00:00', notes: 'Rate confirmed at $55/hr' }
    ]
  }
];

interface SubmissionsContextType {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'statusHistory'>) => void;
  updateStatus: (submissionId: string, newStatus: SubmissionStatus, notes?: string, changedBy?: string) => void;
  getSubmissionsByStatus: (status: SubmissionStatus) => Submission[];
  statusFilter: SubmissionStatus | 'all';
  setStatusFilter: (filter: SubmissionStatus | 'all') => void;
}

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');

  const addSubmission = (submission: Omit<Submission, 'statusHistory'>) => {
    const now = new Date().toISOString();
    const newSubmission: Submission = {
      ...submission,
      status: 'applied', // Default status when sharing resume
      statusChangedBy: 'Admin',
      statusChangedDate: now,
      statusHistory: [
        {
          id: `${submission.id}-1`,
          fromStatus: null,
          toStatus: 'applied',
          changedBy: 'Admin',
          changedDate: now,
          notes: 'Resume shared with vendor'
        }
      ]
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const updateStatus = (submissionId: string, newStatus: SubmissionStatus, notes?: string, changedBy: string = 'Admin') => {
    const now = new Date().toISOString();
    
    setSubmissions(prev => prev.map(sub => {
      if (sub.id !== submissionId) return sub;
      
      const historyEntry: StatusHistoryEntry = {
        id: `${sub.id}-${sub.statusHistory.length + 1}`,
        fromStatus: sub.status,
        toStatus: newStatus,
        changedBy,
        changedDate: now,
        notes
      };

      return {
        ...sub,
        status: newStatus,
        statusChangedBy: changedBy,
        statusChangedDate: now,
        rateConfirmationDate: newStatus === 'submission' && !sub.rateConfirmationDate 
          ? now.split('T')[0] 
          : sub.rateConfirmationDate,
        statusHistory: [...sub.statusHistory, historyEntry]
      };
    }));
  };

  const getSubmissionsByStatus = (status: SubmissionStatus) => {
    return submissions.filter(sub => sub.status === status);
  };

  return (
    <SubmissionsContext.Provider value={{ 
      submissions, 
      addSubmission, 
      updateStatus, 
      getSubmissionsByStatus,
      statusFilter,
      setStatusFilter
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