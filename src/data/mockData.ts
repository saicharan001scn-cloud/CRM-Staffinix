import { Consultant, Vendor, JobRequirement, Submission, DashboardStats, ActivityItem, ChartData } from '@/types';

export const mockConsultants: Consultant[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+1 (555) 123-4567',
    visaStatus: 'H1B',
    skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Kubernetes'],
    rate: 75,
    status: 'available',
    location: 'Dallas, TX',
    experience: 8,
    lastUpdated: '2024-01-15',
    matchScore: 92,
    aiSummary: 'Senior Java developer with 8+ years of experience in enterprise applications. Strong expertise in Spring Boot microservices and cloud-native development.'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+1 (555) 234-5678',
    visaStatus: 'OPT',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'MongoDB'],
    rate: 65,
    status: 'bench',
    location: 'Austin, TX',
    experience: 5,
    lastUpdated: '2024-01-14',
    matchScore: 88,
    aiSummary: 'Full-stack developer specializing in modern JavaScript frameworks. Excellent problem-solving skills and experience with agile methodologies.'
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+1 (555) 345-6789',
    visaStatus: 'GC',
    skills: ['Python', 'Django', 'Machine Learning', 'TensorFlow', 'AWS'],
    rate: 85,
    status: 'marketing',
    location: 'San Francisco, CA',
    experience: 10,
    lastUpdated: '2024-01-13',
    matchScore: 95,
    aiSummary: 'Senior ML Engineer with expertise in building production-grade machine learning systems. Strong background in NLP and computer vision.'
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+1 (555) 456-7890',
    visaStatus: 'H1B',
    skills: ['Salesforce', 'Apex', 'Lightning', 'Integration', 'CPQ'],
    rate: 80,
    status: 'interview',
    location: 'Chicago, IL',
    experience: 7,
    lastUpdated: '2024-01-12',
    matchScore: 78,
    aiSummary: 'Certified Salesforce Architect with deep expertise in enterprise CRM implementations and complex integrations.'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+1 (555) 567-8901',
    visaStatus: 'USC',
    skills: ['DevOps', 'Terraform', 'Ansible', 'Docker', 'Kubernetes', 'Azure'],
    rate: 90,
    status: 'placed',
    location: 'Seattle, WA',
    experience: 12,
    lastUpdated: '2024-01-11',
    matchScore: 85,
    aiSummary: 'Principal DevOps Engineer with extensive experience in cloud infrastructure automation and CI/CD pipeline optimization.'
  },
  {
    id: '6',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@email.com',
    phone: '+1 (555) 678-9012',
    visaStatus: 'H4 EAD',
    skills: ['QA Automation', 'Selenium', 'Cypress', 'API Testing', 'Performance Testing'],
    rate: 55,
    status: 'bench',
    location: 'New Jersey, NJ',
    experience: 4,
    lastUpdated: '2024-01-10',
    matchScore: 72,
    aiSummary: 'QA Automation engineer skilled in building robust test frameworks and implementing continuous testing strategies.'
  }
];

export const mockVendors: Vendor[] = [
  {
    id: '1',
    companyName: 'TechStaff Solutions',
    recruiterName: 'Michael Johnson',
    email: 'michael@techstaff.com',
    phone: '+1 (555) 111-2222',
    lastInteraction: '2024-01-15',
    trustScore: 95,
    totalSubmissions: 156,
    placements: 23,
    notes: 'Excellent partner. Quick response times and reliable payments.'
  },
  {
    id: '2',
    companyName: 'Apex Consulting',
    recruiterName: 'Sarah Williams',
    email: 'sarah@apexconsulting.com',
    phone: '+1 (555) 222-3333',
    lastInteraction: '2024-01-14',
    trustScore: 88,
    totalSubmissions: 89,
    placements: 12,
    notes: 'Good for healthcare and finance clients.'
  },
  {
    id: '3',
    companyName: 'Global IT Partners',
    recruiterName: 'David Chen',
    email: 'david@globalit.com',
    phone: '+1 (555) 333-4444',
    lastInteraction: '2024-01-13',
    trustScore: 82,
    totalSubmissions: 67,
    placements: 8,
    notes: 'Strong in federal contracts.'
  },
  {
    id: '4',
    companyName: 'Prime Staffing Inc',
    recruiterName: 'Jennifer Lee',
    email: 'jennifer@primestaffing.com',
    phone: '+1 (555) 444-5555',
    lastInteraction: '2024-01-12',
    trustScore: 91,
    totalSubmissions: 112,
    placements: 18,
    notes: 'Top vendor for C2C placements.'
  }
];

export const mockJobs: JobRequirement[] = [
  {
    id: '1',
    title: 'Senior Java Developer',
    client: 'Fortune 500 Bank',
    skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Kafka'],
    location: 'Dallas, TX (Hybrid)',
    jobType: 'C2C',
    rate: { min: 70, max: 80 },
    visaRequirements: ['H1B', 'GC', 'USC'],
    description: 'Looking for a senior Java developer to work on core banking microservices...',
    deadline: '2024-01-20',
    source: 'Dice',
    postedDate: '2024-01-10',
    matchedConsultants: 3,
    status: 'open'
  },
  {
    id: '2',
    title: 'React Frontend Engineer',
    client: 'Tech Startup',
    skills: ['React', 'TypeScript', 'GraphQL', 'Tailwind CSS'],
    location: 'Remote',
    jobType: 'Both',
    rate: { min: 60, max: 75 },
    visaRequirements: ['H1B', 'OPT', 'GC', 'USC'],
    description: 'Building next-generation fintech platform UI...',
    deadline: '2024-01-25',
    source: 'LinkedIn',
    postedDate: '2024-01-12',
    matchedConsultants: 5,
    status: 'open'
  },
  {
    id: '3',
    title: 'ML Engineer - NLP',
    client: 'AI Research Company',
    skills: ['Python', 'TensorFlow', 'NLP', 'Transformers', 'AWS SageMaker'],
    location: 'San Francisco, CA',
    jobType: 'W2',
    rate: { min: 85, max: 100 },
    visaRequirements: ['GC', 'USC'],
    description: 'Building production NLP pipelines for enterprise search...',
    deadline: '2024-01-22',
    source: 'Indeed',
    postedDate: '2024-01-11',
    matchedConsultants: 2,
    status: 'open'
  },
  {
    id: '4',
    title: 'Salesforce Architect',
    client: 'Healthcare Provider',
    skills: ['Salesforce', 'Health Cloud', 'Integration', 'Apex', 'LWC'],
    location: 'Chicago, IL (Onsite)',
    jobType: 'C2C',
    rate: { min: 75, max: 90 },
    visaRequirements: ['H1B', 'GC', 'USC'],
    description: 'Lead Salesforce implementation for patient management system...',
    deadline: '2024-01-18',
    source: 'Vendor Email',
    postedDate: '2024-01-09',
    matchedConsultants: 1,
    status: 'open'
  },
  {
    id: '5',
    title: 'DevOps Lead - Azure',
    client: 'Insurance Company',
    skills: ['Azure', 'Terraform', 'Kubernetes', 'CI/CD', 'Python'],
    location: 'Seattle, WA (Hybrid)',
    jobType: 'Both',
    rate: { min: 80, max: 95 },
    visaRequirements: ['H1B', 'GC', 'USC'],
    description: 'Lead cloud migration and DevOps transformation...',
    deadline: '2024-01-30',
    source: 'Talent.com',
    postedDate: '2024-01-14',
    matchedConsultants: 4,
    status: 'open'
  }
];

export const mockSubmissions: Submission[] = [
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
    statusHistory: []
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
    statusHistory: []
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
    statusHistory: []
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
    statusHistory: []
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
    statusHistory: []
  }
];

export const mockDashboardStats: DashboardStats = {
  totalConsultants: 45,
  benchConsultants: 12,
  activeJobs: 28,
  submissionsToday: 8,
  interviewsThisWeek: 15,
  placementsThisMonth: 6,
  avgMatchScore: 82,
  hotVendors: 8
};

export const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'submission',
    message: 'Rajesh Kumar submitted for Senior Java Developer at Fortune 500 Bank',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'interview',
    message: 'Interview scheduled for Sneha Reddy - Salesforce Architect position',
    timestamp: '3 hours ago'
  },
  {
    id: '3',
    type: 'placement',
    message: 'Vikram Singh started at Insurance Company - DevOps Lead',
    timestamp: '5 hours ago'
  },
  {
    id: '4',
    type: 'job',
    message: 'New job requirement: ML Engineer - NLP from AI Research Company',
    timestamp: '6 hours ago'
  },
  {
    id: '5',
    type: 'email',
    message: 'Hotlist email sent to 45 vendors - 12 responses received',
    timestamp: '8 hours ago'
  }
];

export const submissionChartData: ChartData[] = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 18 },
  { name: 'Wed', value: 15 },
  { name: 'Thu', value: 22 },
  { name: 'Fri', value: 28 },
  { name: 'Sat', value: 8 },
  { name: 'Sun', value: 5 }
];

export const skillDemandData: ChartData[] = [
  { name: 'Java', value: 35 },
  { name: 'React', value: 28 },
  { name: 'Python', value: 25 },
  { name: 'AWS', value: 22 },
  { name: 'Salesforce', value: 18 }
];

export const statusDistribution: ChartData[] = [
  { name: 'Available', value: 12 },
  { name: 'Bench', value: 8 },
  { name: 'Marketing', value: 15 },
  { name: 'Interview', value: 6 },
  { name: 'Placed', value: 4 }
];
