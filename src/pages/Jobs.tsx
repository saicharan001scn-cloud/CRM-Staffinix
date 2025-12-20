import { MainLayout } from '@/components/layout/MainLayout';
import { JobCard } from '@/components/jobs/JobCard';
import { mockJobs } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';

export default function Jobs() {
  const openJobs = mockJobs.filter(j => j.status === 'open').length;
  const totalMatches = mockJobs.reduce((acc, j) => acc + j.matchedConsultants, 0);

  return (
    <MainLayout
      title="Job Requirements"
      subtitle="Active job openings from all sources"
      action={{ label: 'Fetch New Jobs', onClick: () => {} }}
    >
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
        {mockJobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} />
        ))}
      </div>
    </MainLayout>
  );
}
