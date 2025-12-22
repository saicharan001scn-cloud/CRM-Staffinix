import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { JobCard } from '@/components/jobs/JobCard';
import { AddJobModal, NewJob } from '@/components/jobs/AddJobModal';
import { mockJobs } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Sparkles, Search, X, Filter, Plus, Briefcase, CheckCircle, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const sourceColors: Record<string, string> = {
  Dice: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  LinkedIn: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  Indeed: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
  Monster: 'bg-green-500/20 text-green-500 border-green-500/30',
  CareerBuilder: 'bg-red-500/20 text-red-500 border-red-500/30',
  'Vendor Email': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  'Talent.com': 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
};

const allSources = ['Dice', 'LinkedIn', 'Indeed', 'Monster', 'CareerBuilder', 'Vendor Email', 'Talent.com', 'Referral', 'Direct Client'];

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [showAddJob, setShowAddJob] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'filled'>('all');
  
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSource = selectedSources.length === 0 || selectedSources.includes(job.source);
    
    const matchesStatus = activeFilter === 'all' || 
      (activeFilter === 'open' && job.status === 'open') ||
      (activeFilter === 'filled' && job.status === 'filled');
    
    return matchesSearch && matchesSource && matchesStatus;
  });

  const openJobs = mockJobs.filter(j => j.status === 'open').length;
  const filledJobs = mockJobs.filter(j => j.status === 'filled').length;
  const totalMatches = mockJobs.reduce((acc, j) => acc + j.matchedConsultants, 0);

  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const handleAddJob = (job: NewJob) => {
    console.log('New job:', job);
    toast.success('Job added successfully!');
  };

  return (
    <MainLayout
      title="Job Requirements"
      subtitle="Active job openings from all sources"
      action={{ label: 'Add New Job', onClick: () => setShowAddJob(true) }}
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

      {/* Quick Stats with Toggleable Filters */}
      <TooltipProvider>
        <div className="flex items-center gap-4 mb-6 p-4 bg-card border border-border rounded-xl">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeFilter === 'open' ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={() => setActiveFilter(activeFilter === 'open' ? 'all' : 'open')}
              >
                <Briefcase className="w-4 h-4" />
                <span className="font-semibold">{openJobs}</span> Open Jobs
              </Button>
            </TooltipTrigger>
            <TooltipContent>Click to filter open jobs only</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
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
                variant={activeFilter === 'filled' ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={() => setActiveFilter(activeFilter === 'filled' ? 'all' : 'filled')}
              >
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="font-semibold">{filledJobs}</span> Filled
              </Button>
            </TooltipTrigger>
            <TooltipContent>Click to filter filled positions only</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-border" />

          <div className="flex flex-wrap gap-2">
            {allSources.slice(0, 4).map(source => (
              <Badge key={source} variant="outline" className={sourceColors[source] || ''}>{source}</Badge>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="ml-auto gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Now
          </Button>
        </div>
      </TooltipProvider>

      {/* Jobs Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} />
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
    </MainLayout>
  );
}
