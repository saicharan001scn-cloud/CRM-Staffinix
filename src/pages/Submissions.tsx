import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubmissionQueue } from '@/components/submissions/SubmissionQueue';
import { useSubmissions } from '@/context/SubmissionsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubmissionStatus } from '@/types';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Send, 
  Calendar, 
  UserCheck, 
  FileCheck, 
  CheckCircle, 
  XCircle,
  Filter,
  Search,
  X
} from 'lucide-react';

const pipelineStats: { 
  status: SubmissionStatus | 'all'; 
  label: string; 
  icon: React.ElementType;
  color: string;
  bgColor: string;
}[] = [
  { status: 'all', label: 'All', icon: Filter, color: 'text-foreground', bgColor: 'bg-muted' },
  { status: 'applied', label: 'Applied', icon: FileText, color: 'text-warning', bgColor: 'bg-warning/20' },
  { status: 'submission', label: 'Submission', icon: Send, color: 'text-info', bgColor: 'bg-info/20' },
  { status: 'interview_scheduled', label: 'Interview', icon: Calendar, color: 'text-chart-5', bgColor: 'bg-chart-5/20' },
  { status: 'client_interview', label: 'Client Int.', icon: UserCheck, color: 'text-primary', bgColor: 'bg-primary/20' },
  { status: 'offer_letter', label: 'Offer', icon: FileCheck, color: 'text-success', bgColor: 'bg-success/20' },
  { status: 'placed', label: 'Placed', icon: CheckCircle, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { status: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/20' },
];

export default function Submissions() {
  const { submissions, statusFilter, setStatusFilter } = useSubmissions();
  const [searchQuery, setSearchQuery] = useState('');
  
  const getCount = (status: SubmissionStatus | 'all') => {
    if (status === 'all') return submissions.length;
    return submissions.filter(s => s.status === status).length;
  };

  const filteredSubmissions = submissions.filter(s => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesSearch = searchQuery === '' ||
      s.consultantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <MainLayout
      title="Submission Tracker"
      subtitle="Track your candidate pipeline from Applied to Placed"
      showBackButton={false}
    >
      {/* Search Bar */}
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by consultant, job title, client, vendor..."
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
          Found <span className="font-semibold text-foreground">{filteredSubmissions.length}</span> submissions
        </span>
      </div>

      {/* Pipeline Stats / Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-card border border-border rounded-xl">
        {pipelineStats.map((stat) => {
          const Icon = stat.icon;
          const count = getCount(stat.status);
          const isActive = statusFilter === stat.status;
          
          return (
            <Button
              key={stat.status}
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter(stat.status)}
              className={cn(
                "h-8 px-3 gap-2 text-xs transition-all",
                isActive && stat.bgColor,
                isActive && "ring-1 ring-inset",
                isActive && stat.status !== 'all' && `ring-current`
              )}
            >
              <Icon className={cn("w-4 h-4", stat.color)} />
              <span className={cn(
                "font-medium",
                isActive ? stat.color : "text-muted-foreground"
              )}>
                {stat.label}
              </span>
              <span className={cn(
                "px-1.5 py-0.5 rounded text-xs font-semibold",
                isActive ? stat.bgColor : "bg-muted",
                isActive ? stat.color : "text-muted-foreground"
              )}>
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Pipeline Visualization Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-warning/10 via-info/10 via-chart-5/10 via-primary/10 via-success/10 to-emerald-500/10 border border-border rounded-lg">
        <div className="flex items-center gap-2">
          {pipelineStats.slice(1, 7).map((stat, index) => {
            const Icon = stat.icon;
            const count = getCount(stat.status as SubmissionStatus);
            return (
              <div key={stat.status} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    stat.bgColor
                  )}>
                    <Icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{stat.label}</span>
                  <span className={cn("text-sm font-bold", stat.color)}>{count}</span>
                </div>
                {index < 5 && (
                  <div className="w-8 h-0.5 bg-border mx-2" />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Conversion Rate</p>
          <p className="text-lg font-bold text-foreground">
            {submissions.length > 0 
              ? ((getCount('placed') / submissions.length) * 100).toFixed(0) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Queue Table */}
      <SubmissionQueue submissions={filteredSubmissions} />

      {filteredSubmissions.length === 0 && searchQuery && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No submissions found matching "{searchQuery}"</p>
        </div>
      )}
    </MainLayout>
  );
}