import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { JobCard } from '@/components/jobs/JobCard';
import { mockJobs } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Sparkles, Search, X } from 'lucide-react';

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredJobs = mockJobs.filter((job) => {
    if (searchQuery === '') return true;
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.client.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.skills.some(skill => skill.toLowerCase().includes(query))
    );
  });

  const openJobs = filteredJobs.filter(j => j.status === 'open').length;
  const totalMatches = filteredJobs.reduce((acc, j) => acc + j.matchedConsultants, 0);

  return (
    <MainLayout
      title="Job Requirements"
      subtitle="Active job openings from all sources"
      action={{ label: 'Fetch New Jobs', onClick: () => {} }}
    >
      {/* Search Bar */}
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
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Found <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs
        </span>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center gap-6 mb-6 p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{openJobs}</span> Open Jobs
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalMatches}</span> Total Matches
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Dice</Badge>
          <Badge variant="outline">LinkedIn</Badge>
          <Badge variant="outline">Indeed</Badge>
          <Badge variant="outline">Vendor Emails</Badge>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto gap-2">
          <RefreshCw className="w-4 h-4" />
          Sync Now
        </Button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} />
        ))}
      </div>

      {filteredJobs.length === 0 && searchQuery && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No jobs found matching "{searchQuery}"</p>
        </div>
      )}
    </MainLayout>
  );
}
