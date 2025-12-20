import { Submission, SubmissionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Building2, User, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmissionQueueProps {
  submissions: Submission[];
}

const statusConfig: Record<SubmissionStatus, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: 'bg-info/20 text-info border-info/30' },
  screening: { label: 'Screening', color: 'bg-warning/20 text-warning border-warning/30' },
  interview: { label: 'Interview', color: 'bg-chart-5/20 text-chart-5 border-chart-5/30' },
  offer: { label: 'Offer', color: 'bg-success/20 text-success border-success/30' },
  placed: { label: 'Placed', color: 'bg-primary/20 text-primary border-primary/30' },
  rejected: { label: 'Rejected', color: 'bg-destructive/20 text-destructive border-destructive/30' },
};

export function SubmissionQueue({ submissions }: SubmissionQueueProps) {
  // Sort by date, most recent first
  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">#</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Consultant</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Job</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Vendor</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Rate</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Date</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubmissions.map((submission, index) => {
              const status = statusConfig[submission.status];
              return (
                <tr 
                  key={submission.id}
                  className="table-row-hover border-b border-border last:border-0 animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="p-3">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      #{(index + 1).toString().padStart(3, '0')}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-foreground">{submission.consultantName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-foreground">{submission.jobTitle}</p>
                        <p className="text-[10px] text-muted-foreground">{submission.client}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{submission.vendorName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-success" />
                      <span className="text-xs font-medium text-foreground">{submission.rate}/hr</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{submission.submissionDate}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className={cn("border text-[10px] px-1.5 py-0", status.color)}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <p className="text-[10px] text-muted-foreground max-w-[150px] truncate">
                      {submission.notes || submission.offerDetails || '-'}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
