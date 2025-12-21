import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Submission, SubmissionStatus, StatusHistoryEntry, RateHistoryEntry } from '@/types';

// Updated mock data with rate tracking
const initialSubmissions: Submission[] = [
  {
    id: '1',
    consultantId: '1',
    consultantName: 'Rajesh Kumar',
    vendorId: '1',
    vendorName: 'TechStaff Solutions',
    vendorContact: 'John Smith',
    jobId: '1',
    jobTitle: 'Senior Java Developer',
    client: 'Fortune 500 Bank',
    submissionDate: '2024-01-15',
    status: 'client_interview',
    appliedRate: 80,
    submissionRate: 75,
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
    ],
    rateHistory: [
      { id: '1-r1', oldRate: null, newRate: 80, changedBy: 'Admin', changedDate: '2024-01-13T09:00:00', type: 'applied', reason: 'Initial rate proposal' },
      { id: '1-r2', oldRate: 80, newRate: 75, changedBy: 'Admin', changedDate: '2024-01-14T14:00:00', type: 'negotiated', reason: 'Vendor negotiated down' }
    ]
  },
  {
    id: '2',
    consultantId: '2',
    consultantName: 'Priya Sharma',
    vendorId: '2',
    vendorName: 'Apex Consulting',
    vendorContact: 'Sarah Lee',
    jobId: '2',
    jobTitle: 'React Frontend Engineer',
    client: 'Tech Startup',
    submissionDate: '2024-01-14',
    status: 'applied',
    appliedRate: 65,
    submissionRate: undefined,
    rate: 65,
    notes: 'Resume shared. Awaiting rate confirmation.',
    statusChangedBy: 'Admin',
    statusChangedDate: '2024-01-14T09:00:00',
    statusHistory: [
      { id: '2-1', fromStatus: null, toStatus: 'applied', changedBy: 'Admin', changedDate: '2024-01-14T09:00:00' }
    ],
    rateHistory: [
      { id: '2-r1', oldRate: null, newRate: 65, changedBy: 'Admin', changedDate: '2024-01-14T09:00:00', type: 'applied', reason: 'Initial rate proposal' }
    ]
  },
  {
    id: '3',
    consultantId: '3',
    consultantName: 'Amit Patel',
    vendorId: '3',
    vendorName: 'Global IT Partners',
    vendorContact: 'Mike Johnson',
    jobId: '3',
    jobTitle: 'ML Engineer - NLP',
    client: 'AI Research Company',
    submissionDate: '2024-01-13',
    status: 'offer_letter',
    appliedRate: 95,
    submissionRate: 90,
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
    ],
    rateHistory: [
      { id: '3-r1', oldRate: null, newRate: 95, changedBy: 'Admin', changedDate: '2024-01-11T10:00:00', type: 'applied', reason: 'Initial rate proposal' },
      { id: '3-r2', oldRate: 95, newRate: 90, changedBy: 'Admin', changedDate: '2024-01-12T11:00:00', type: 'negotiated', reason: 'Vendor countered' }
    ]
  },
  {
    id: '4',
    consultantId: '4',
    consultantName: 'Sneha Reddy',
    vendorId: '4',
    vendorName: 'Prime Staffing Inc',
    vendorContact: 'David Chen',
    jobId: '4',
    jobTitle: 'Salesforce Architect',
    client: 'Healthcare Provider',
    submissionDate: '2024-01-12',
    status: 'interview_scheduled',
    appliedRate: 85,
    submissionRate: 80,
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
    ],
    rateHistory: [
      { id: '4-r1', oldRate: null, newRate: 85, changedBy: 'Admin', changedDate: '2024-01-10T09:00:00', type: 'applied', reason: 'Initial rate proposal' },
      { id: '4-r2', oldRate: 85, newRate: 80, changedBy: 'Admin', changedDate: '2024-01-11T14:00:00', type: 'negotiated', reason: 'Reduced by $5' }
    ]
  },
  {
    id: '5',
    consultantId: '5',
    consultantName: 'Vikram Singh',
    vendorId: '1',
    vendorName: 'TechStaff Solutions',
    vendorContact: 'John Smith',
    jobId: '5',
    jobTitle: 'DevOps Lead - Azure',
    client: 'Insurance Company',
    submissionDate: '2024-01-10',
    status: 'placed',
    appliedRate: 90,
    submissionRate: 90,
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
    ],
    rateHistory: [
      { id: '5-r1', oldRate: null, newRate: 90, changedBy: 'Admin', changedDate: '2024-01-05T10:00:00', type: 'applied', reason: 'Initial rate proposal' }
    ]
  },
  {
    id: '6',
    consultantId: '6',
    consultantName: 'Ananya Gupta',
    vendorId: '2',
    vendorName: 'Apex Consulting',
    vendorContact: 'Sarah Lee',
    jobId: '2',
    jobTitle: 'React Frontend Engineer',
    client: 'Tech Startup',
    submissionDate: '2024-01-16',
    status: 'submission',
    appliedRate: 60,
    submissionRate: 55,
    rate: 55,
    notes: 'Rate confirmed. Submitted to client.',
    rateConfirmationDate: '2024-01-15',
    statusChangedBy: 'Admin',
    statusChangedDate: '2024-01-16T11:00:00',
    statusHistory: [
      { id: '6-1', fromStatus: null, toStatus: 'applied', changedBy: 'Admin', changedDate: '2024-01-14T10:00:00' },
      { id: '6-2', fromStatus: 'applied', toStatus: 'submission', changedBy: 'Admin', changedDate: '2024-01-16T11:00:00', notes: 'Rate confirmed at $55/hr' }
    ],
    rateHistory: [
      { id: '6-r1', oldRate: null, newRate: 60, changedBy: 'Admin', changedDate: '2024-01-14T10:00:00', type: 'applied', reason: 'Initial rate proposal' },
      { id: '6-r2', oldRate: 60, newRate: 55, changedBy: 'Admin', changedDate: '2024-01-15T10:00:00', type: 'negotiated', reason: 'Vendor countered at $55' }
    ]
  }
];

interface SubmissionsContextType {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'statusHistory'>) => void;
  updateStatus: (submissionId: string, newStatus: SubmissionStatus, notes?: string, changedBy?: string) => void;
  updateRate: (submissionId: string, newRate: number, reason?: string, vendorContact?: string, changedBy?: string) => void;
  getSubmissionsByStatus: (status: SubmissionStatus) => Submission[];
  statusFilter: SubmissionStatus | 'all';
  setStatusFilter: (filter: SubmissionStatus | 'all') => void;
  rateFilter: 'all' | 'increased' | 'decreased' | 'same';
  setRateFilter: (filter: 'all' | 'increased' | 'decreased' | 'same') => void;
}

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [rateFilter, setRateFilter] = useState<'all' | 'increased' | 'decreased' | 'same'>('all');

  const addSubmission = (submission: Omit<Submission, 'statusHistory'>) => {
    const now = new Date().toISOString();
    const newSubmission: Submission = {
      ...submission,
      status: 'applied',
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
      ],
      rateHistory: [
        {
          id: `${submission.id}-r1`,
          oldRate: null,
          newRate: submission.appliedRate,
          changedBy: 'Admin',
          changedDate: now,
          type: 'applied',
          reason: 'Initial rate proposal'
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

  const updateRate = (
    submissionId: string, 
    newRate: number, 
    reason?: string, 
    vendorContact?: string,
    changedBy: string = 'Admin'
  ) => {
    const now = new Date().toISOString();
    
    setSubmissions(prev => prev.map(sub => {
      if (sub.id !== submissionId) return sub;
      
      const rateEntry: RateHistoryEntry = {
        id: `${sub.id}-r${sub.rateHistory.length + 1}`,
        oldRate: sub.submissionRate || sub.appliedRate,
        newRate,
        changedBy,
        changedDate: now,
        type: 'negotiated',
        reason
      };

      return {
        ...sub,
        submissionRate: newRate,
        rate: newRate,
        vendorContact: vendorContact || sub.vendorContact,
        rateHistory: [...sub.rateHistory, rateEntry]
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
      updateRate,
      getSubmissionsByStatus,
      statusFilter,
      setStatusFilter,
      rateFilter,
      setRateFilter
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