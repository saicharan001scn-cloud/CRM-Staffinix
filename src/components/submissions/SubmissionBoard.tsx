import { Submission, SubmissionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmissionBoardProps {
  submissions: Submission[];
}

const columns: { status: SubmissionStatus; label: string; color: string }[] = [
  { status: 'applied', label: 'Applied', color: 'bg-warning' },
  { status: 'submission', label: 'Submission', color: 'bg-info' },
  { status: 'interview_scheduled', label: 'Interview', color: 'bg-chart-5' },
  { status: 'client_interview', label: 'Client Int.', color: 'bg-primary' },
  { status: 'offer_letter', label: 'Offer', color: 'bg-success' },
  { status: 'placed', label: 'Placed', color: 'bg-emerald-500' },
];

export function SubmissionBoard({ submissions }: SubmissionBoardProps) {
  const getSubmissionsByStatus = (status: SubmissionStatus) => 
    submissions.filter(s => s.status === status);

  return (
    <div className="grid grid-cols-6 gap-3">
      {columns.map((column) => (
        <div key={column.status} className="space-y-3">
          {/* Column Header */}
          <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
            <div className={cn("w-2 h-2 rounded-full", column.color)} />
            <span className="text-[10px] font-medium text-foreground">{column.label}</span>
            <Badge variant="secondary" className="ml-auto text-[9px] px-1 py-0">
              {getSubmissionsByStatus(column.status).length}
            </Badge>
          </div>

          {/* Cards */}
          <div className="space-y-2">
            {getSubmissionsByStatus(column.status).map((submission, index) => (
              <div 
                key={submission.id}
                className="bg-card border border-border rounded-lg p-2 hover:border-primary/50 transition-all cursor-pointer animate-slide-up opacity-0 group"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <h4 className="text-[10px] font-medium text-foreground group-hover:text-primary transition-colors">
                  {submission.consultantName}
                </h4>
                <p className="text-[9px] text-muted-foreground mt-0.5">{submission.jobTitle}</p>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Building2 className="w-2.5 h-2.5" />
                    {submission.vendorName}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <DollarSign className="w-2.5 h-2.5" />
                    ${submission.rate}/hr
                  </div>
                  {submission.interviewDate && (
                    <div className="flex items-center gap-1 text-[9px] text-warning">
                      <Calendar className="w-2.5 h-2.5" />
                      {submission.interviewDate}
                    </div>
                  )}
                </div>

                {submission.notes && (
                  <p className="text-[8px] text-muted-foreground mt-2 p-1.5 bg-muted/50 rounded">
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
