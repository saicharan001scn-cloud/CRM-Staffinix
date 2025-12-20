import { Submission, SubmissionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmissionBoardProps {
  submissions: Submission[];
}

const columns: { status: SubmissionStatus; label: string; color: string }[] = [
  { status: 'submitted', label: 'Submitted', color: 'bg-info' },
  { status: 'screening', label: 'Screening', color: 'bg-warning' },
  { status: 'interview', label: 'Interview', color: 'bg-chart-5' },
  { status: 'offer', label: 'Offer', color: 'bg-success' },
  { status: 'placed', label: 'Placed', color: 'bg-primary' },
];

export function SubmissionBoard({ submissions }: SubmissionBoardProps) {
  const getSubmissionsByStatus = (status: SubmissionStatus) => 
    submissions.filter(s => s.status === status);

  return (
    <div className="grid grid-cols-5 gap-4">
      {columns.map((column) => (
        <div key={column.status} className="space-y-4">
          {/* Column Header */}
          <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
            <div className={cn("w-3 h-3 rounded-full", column.color)} />
            <span className="text-sm font-medium text-foreground">{column.label}</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {getSubmissionsByStatus(column.status).length}
            </Badge>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {getSubmissionsByStatus(column.status).map((submission, index) => (
              <div 
                key={submission.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer animate-slide-up opacity-0 group"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {submission.consultantName}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{submission.jobTitle}</p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="w-3 h-3" />
                    {submission.vendorName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <DollarSign className="w-3 h-3" />
                    ${submission.rate}/hr
                  </div>
                  {submission.interviewDate && (
                    <div className="flex items-center gap-2 text-xs text-warning">
                      <Calendar className="w-3 h-3" />
                      {submission.interviewDate}
                    </div>
                  )}
                </div>

                {submission.notes && (
                  <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted/50 rounded">
                    {submission.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
