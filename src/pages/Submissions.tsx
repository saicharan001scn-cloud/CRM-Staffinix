import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubmissionQueue } from '@/components/submissions/SubmissionQueue';
import { useSubmissions } from '@/context/SubmissionsContext';
import { Button } from '@/components/ui/button';
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
  Filter
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
  
  const getCount = (status: SubmissionStatus | 'all') => {
    if (status === 'all') return submissions.length;
    return submissions.filter(s => s.status === status).length;
  };

  const filteredSubmissions = statusFilter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === statusFilter);

  return (
    <MainLayout
      title="Submission Tracker"
      subtitle="Track your candidate pipeline from Applied to Placed"
    >
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
                "h-7 px-2 gap-1.5 text-[10px] transition-all",
                isActive && stat.bgColor,
                isActive && "ring-1 ring-inset",
                isActive && stat.status !== 'all' && `ring-current`
              )}
            >
              <Icon className={cn("w-3 h-3", stat.color)} />
              <span className={cn(
                "font-medium",
                isActive ? stat.color : "text-muted-foreground"
              )}>
                {stat.label}
              </span>
              <span className={cn(
                "px-1 py-0.5 rounded text-[9px] font-semibold",
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
      <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-warning/10 via-info/10 via-chart-5/10 via-primary/10 via-success/10 to-emerald-500/10 border border-border rounded-lg">
        <div className="flex items-center gap-1">
          {pipelineStats.slice(1, 7).map((stat, index) => {
            const Icon = stat.icon;
            const count = getCount(stat.status as SubmissionStatus);
            return (
              <div key={stat.status} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    stat.bgColor
                  )}>
                    <Icon className={cn("w-3 h-3", stat.color)} />
                  </div>
                  <span className="text-[8px] text-muted-foreground mt-0.5">{stat.label}</span>
                  <span className={cn("text-[10px] font-bold", stat.color)}>{count}</span>
                </div>
                {index < 5 && (
                  <div className="w-6 h-0.5 bg-border mx-1" />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Conversion Rate</p>
          <p className="text-sm font-bold text-foreground">
            {submissions.length > 0 
              ? ((getCount('placed') / submissions.length) * 100).toFixed(0) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Queue Table */}
      <SubmissionQueue submissions={filteredSubmissions} />
    </MainLayout>
  );
}