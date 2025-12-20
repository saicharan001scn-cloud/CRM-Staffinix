import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Submission } from '@/types';
import { mockSubmissions } from '@/data/mockData';

interface SubmissionsContextType {
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
}

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);

  const addSubmission = (submission: Submission) => {
    setSubmissions(prev => [submission, ...prev]);
  };

  return (
    <SubmissionsContext.Provider value={{ submissions, addSubmission }}>
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
