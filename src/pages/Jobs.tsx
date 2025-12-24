import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { JobCard } from '@/components/jobs/JobCard';
import { AddJobModal, NewJob } from '@/components/jobs/AddJobModal';
import { SubmitToVendorModal } from '@/components/jobs/SubmitToVendorModal';
import { mockJobs } from '@/data/mockData';
import { mockJobMatches, JobMatch } from '@/data/mockJobMatches';
import { JobRequirement } from '@/types';
import { useSubmissions } from '@/context/SubmissionsContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Search, X, Filter, Briefcase, CheckCircle, Users, Globe, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const sourceColors: Record<string, string> = {
  Dice: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  LinkedIn: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  Indeed: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
  Monster: 'bg-green-500/20 text-green-500 border-green-500/30',
  CareerBuilder: 'bg-red-500/20 text-red-500 border-red-500/30',
};

const allSources = ['Dice', 'LinkedIn', 'Indeed', 'Monster', 'CareerBuilder', 'Referral', 'Direct Client'];

export default function Jobs() {
  const navigate = useNavigate();
  const { addSubmission } = useSubmissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [showAddJob, setShowAddJob] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<'open' | 'filled'>>(new Set());
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'all' | 'portal' | 'vendor_email'>('all');
  const [submitToVendorModalOpen, setSubmitToVendorModalOpen] = useState(false);
  const [selectedJobForSubmission, setSelectedJobForSubmission] = useState<JobRequirement | null>(null);

  const toggleStatusFilter = (status: 'open' | 'filled') => {
    setActiveFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };
  
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSource = selectedSources.length === 0 || selectedSources.includes(job.source);
    
    const matchesStatus = activeFilters.size === 0 || activeFilters.has(job.status as 'open' | 'filled');
    
    const matchesSourceType = sourceTypeFilter === 'all' || job.sourceType === sourceTypeFilter;
    
    return matchesSearch && matchesSource && matchesStatus && matchesSourceType;
  });

  const openJobs = mockJobs.filter(j => j.status === 'open').length;
  const filledJobs = mockJobs.filter(j => j.status === 'filled').length;
  const totalMatches = mockJobs.reduce((acc, j) => acc + j.matchedConsultants, 0);
  const portalJobs = mockJobs.filter(j => j.sourceType === 'portal').length;
  const vendorEmailJobs = mockJobs.filter(j => j.sourceType === 'vendor_email').length;

  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const handleAddJob = (job: NewJob) => {
    console.log('New job:', job);
    toast.success('Job added successfully!');
  };

  const handleSubmitToVendor = (job: JobRequirement) => {
    setSelectedJobForSubmission(job);
    setSubmitToVendorModalOpen(true);
  };

  const generateVendorEmailTemplate = (candidate: JobMatch['consultant'], job: JobRequirement) => {
    return `Dear ${job.vendorName || 'Team'},

Please find below candidate submission for the ${job.title} position at ${job.client}:

CANDIDATE DETAILS:
• Name: ${candidate.name}
• Experience: ${candidate.experience} years
• Key Skills: ${candidate.skills.join(', ')}
• Visa Status: ${candidate.visaStatus}
• Rate Expectation: $${candidate.rate}/hour
• Availability: ${candidate.status === 'available' ? 'Immediately' : 'With notice'}
• Location: ${candidate.location}

RESUME:
Attached is ${candidate.name.split(' ')[0]}'s resume specifically for this ${job.title} role.

SUBMISSION NOTES:
This candidate is well-matched for the position requirements with a strong background in the required technologies.

NEXT STEPS:
Please let us know when ${candidate.name.split(' ')[0]}'s profile is submitted to ${job.client} and share any feedback or interview schedules.

Best regards,

Your Name
Recruiting Team
Your Company`;
  };

  const handleConfirmVendorSubmission = (selectedMatches: JobMatch[]) => {
    if (!selectedJobForSubmission || selectedMatches.length === 0) return;

    const job = selectedJobForSubmission;
    const candidate = selectedMatches[0]; // For now, handle first candidate

    // 1. Create submission with "Applied" status
    const newSubmission = {
      id: `sub-${Date.now()}`,
      consultantId: candidate.consultant.id,
      consultantName: candidate.consultant.name,
      vendorId: job.vendorName || '',
      vendorName: job.vendorName || 'Vendor',
      vendorContact: job.vendorEmail || '',
      jobId: job.id,
      jobTitle: job.title,
      client: job.client,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'applied' as const,
      appliedRate: candidate.consultant.rate,
      submissionRate: undefined,
      rate: candidate.consultant.rate,
      notes: `Applied to ${job.vendorName || 'vendor'}. Email pending.`,
      rateHistory: []
    };

    addSubmission(newSubmission);

    // 2. Prepare email data for Email Automation page
    const emailData = {
      to: job.vendorEmail || '',
      subject: `Candidate Submission: ${candidate.consultant.name} for ${job.title} at ${job.client}`,
      body: generateVendorEmailTemplate(candidate.consultant, job),
      attachments: [`${candidate.consultant.name.replace(/\s+/g, '_')}_Resume.pdf`],
      vendorName: job.vendorName || 'Vendor',
      candidateName: candidate.consultant.name,
      jobTitle: job.title,
      clientName: job.client
    };

    sessionStorage.setItem('emailData', JSON.stringify(emailData));

    // 3. Show success toast
    toast.success('Candidate marked as Applied!', {
      description: `${candidate.consultant.name}'s status updated. Redirecting to email...`
    });

    // 4. Navigate to email automation
    navigate('/emails?source=vendor_submission');
  };

  return (
    <MainLayout
      title="Job Requirements"
      subtitle="Active job openings from all sources"
      action={{ label: 'Add New Job', onClick: () => setShowAddJob(true) }}
      showBackButton={false}
    >
      {/* Search Bar with Source Filter */}
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by job title, client, location, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-background"
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setSearchQuery('')}>
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {/* Source Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-3 h-3" />
              Source {selectedSources.length > 0 && `(${selectedSources.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {allSources.map(source => (
              <DropdownMenuCheckboxItem
                key={source}
                checked={selectedSources.includes(source)}
                onCheckedChange={() => toggleSource(source)}
              >
                {source}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Found <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs
        </span>
      </div>

      {/* Source Type Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={sourceTypeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSourceTypeFilter('all')}
          className="gap-1"
        >
          All Jobs ({mockJobs.length})
        </Button>
        <Button
          variant={sourceTypeFilter === 'portal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSourceTypeFilter('portal')}
          className={cn("gap-1", sourceTypeFilter === 'portal' && "bg-blue-500 hover:bg-blue-600")}
        >
          <Globe className="w-3 h-3" />
          Portals ({portalJobs})
        </Button>
        <Button
          variant={sourceTypeFilter === 'vendor_email' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSourceTypeFilter('vendor_email')}
          className={cn("gap-1", sourceTypeFilter === 'vendor_email' && "bg-amber-500 hover:bg-amber-600")}
        >
          <Mail className="w-3 h-3" />
          Vendor Emails ({vendorEmailJobs})
        </Button>
      </div>

      {/* Quick Stats with Toggleable Filters */}
      <TooltipProvider>
        <div className="flex items-center gap-4 mb-6 p-4 bg-card border border-border rounded-xl">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeFilters.has('open') ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={() => toggleStatusFilter('open')}
              >
                <Briefcase className="w-4 h-4" />
                <span className="font-semibold">{openJobs}</span> Open Jobs
              </Button>
            </TooltipTrigger>
            <TooltipContent>Click to toggle open jobs filter</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 cursor-default"
              >
                <Users className="w-4 h-4 text-primary" />
                <span className="font-semibold">{totalMatches}</span> Total Matches
              </Button>
            </TooltipTrigger>
            <TooltipContent>Total consultant matches across all jobs</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeFilters.has('filled') ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={() => toggleStatusFilter('filled')}
              >
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="font-semibold">{filledJobs}</span> Filled
              </Button>
            </TooltipTrigger>
            <TooltipContent>Click to toggle filled positions filter</TooltipContent>
          </Tooltip>

          <Button variant="ghost" size="sm" className="ml-auto gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Now
          </Button>
        </div>
      </TooltipProvider>

      {/* Jobs Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <JobCard 
            key={job.id} 
            job={job} 
            index={index} 
            onSubmitToVendor={handleSubmitToVendor}
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No jobs found</p>
        </div>
      )}

      {/* Add Job Modal */}
      <AddJobModal
        open={showAddJob}
        onClose={() => setShowAddJob(false)}
        onAdd={handleAddJob}
      />

      {/* Submit to Vendor Modal */}
      {selectedJobForSubmission && (
        <SubmitToVendorModal
          open={submitToVendorModalOpen}
          onClose={() => {
            setSubmitToVendorModalOpen(false);
            setSelectedJobForSubmission(null);
          }}
          job={selectedJobForSubmission}
          matches={mockJobMatches[selectedJobForSubmission.id] || []}
          onConfirmSubmit={handleConfirmVendorSubmission}
        />
      )}
    </MainLayout>
  );
}
