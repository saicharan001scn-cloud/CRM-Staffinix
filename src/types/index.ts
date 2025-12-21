export type VisaStatus = 'H1B' | 'OPT' | 'CPT' | 'GC' | 'USC' | 'L1' | 'L2' | 'H4 EAD' | 'TN';

export type ConsultantStatus = 'bench' | 'available' | 'marketing' | 'placed' | 'interview';

export interface Consultant {
  id: string;
  name: string;
  email: string;
  phone: string;
  visaStatus: VisaStatus;
  skills: string[];
  rate: number;
  resumeUrl?: string;
  aiSummary?: string;
  status: ConsultantStatus;
  location: string;
  experience: number;
  lastUpdated: string;
  matchScore?: number;
}

export type SubmissionStatus = 'applied' | 'submission' | 'interview_scheduled' | 'client_interview' | 'offer_letter' | 'placed' | 'rejected';

export interface StatusHistoryEntry {
  id: string;
  fromStatus: SubmissionStatus | null;
  toStatus: SubmissionStatus;
  changedBy: string;
  changedDate: string;
  notes?: string;
}

export interface Submission {
  id: string;
  consultantId: string;
  consultantName: string;
  vendorId: string;
  vendorName: string;
  jobId: string;
  jobTitle: string;
  client: string;
  submissionDate: string;
  status: SubmissionStatus;
  rate: number;
  notes?: string;
  interviewDate?: string;
  offerDetails?: string;
  rateConfirmationDate?: string;
  statusChangedBy?: string;
  statusChangedDate?: string;
  statusHistory: StatusHistoryEntry[];
}

export interface Vendor {
  id: string;
  companyName: string;
  recruiterName: string;
  email: string;
  phone: string;
  notes?: string;
  lastInteraction: string;
  trustScore: number;
  totalSubmissions: number;
  placements: number;
}

export type JobType = 'W2' | 'C2C' | 'Both' | '1099';

export interface JobRequirement {
  id: string;
  title: string;
  client: string;
  skills: string[];
  location: string;
  jobType: JobType;
  rate: { min: number; max: number };
  visaRequirements: VisaStatus[];
  description: string;
  deadline: string;
  source: string;
  postedDate: string;
  matchedConsultants: number;
  status: 'open' | 'closed' | 'filled';
}

export interface DashboardStats {
  totalConsultants: number;
  benchConsultants: number;
  activeJobs: number;
  submissionsToday: number;
  interviewsThisWeek: number;
  placementsThisMonth: number;
  avgMatchScore: number;
  hotVendors: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  type: 'submission' | 'interview' | 'placement' | 'job' | 'email';
  message: string;
  timestamp: string;
  icon?: string;
}
