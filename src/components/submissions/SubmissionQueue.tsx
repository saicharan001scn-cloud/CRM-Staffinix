import { useState } from 'react';
import { Submission, SubmissionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Building2, User, Briefcase, ChevronRight, History, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusUpdateModal } from './StatusUpdateModal';
import { useSubmissions } from '@/context/SubmissionsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface SubmissionQueueProps {
  submissions: Submission[];
}

const statusConfig: Record<SubmissionStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
  step: number;
}> = {
  applied: { label: 'Applied', color: 'text-warning', bgColor: 'bg-warning', step: 1 },
  submission: { label: 'Submission', color: 'text-info', bgColor: 'bg-info', step: 2 },
  interview_scheduled: { label: 'Interview', color: 'text-chart-5', bgColor: 'bg-chart-5', step: 3 },
  client_interview: { label: 'Client Int.', color: 'text-primary', bgColor: 'bg-primary', step: 4 },
  offer_letter: { label: 'Offer', color: 'text-success', bgColor: 'bg-success', step: 5 },
  placed: { label: 'Placed', color: 'text-emerald-400', bgColor: 'bg-emerald-500', step: 6 },
  rejected: { label: 'Rejected', color: 'text-destructive', bgColor: 'bg-destructive', step: 0 },
};

const pipelineStages: SubmissionStatus[] = ['applied', 'submission', 'interview_scheduled', 'client_interview', 'offer_letter', 'placed'];

function PipelineProgress({ currentStatus }: { currentStatus: SubmissionStatus }) {
  const currentStep = statusConfig[currentStatus]?.step || 0;
  const isRejected = currentStatus === 'rejected';

  if (isRejected) {
    return (
      <div className="flex items-center gap-0.5">
        <div className="w-full h-1 bg-destructive/30 rounded-full">
          <div className="h-full bg-destructive rounded-full w-full" />
        </div>
        <span className="text-[8px] text-destructive ml-1">Rejected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {pipelineStages.map((stage, index) => {
        const stageStep = statusConfig[stage].step;
        const isCompleted = stageStep < currentStep;
        const isCurrent = stageStep === currentStep;
        const config = statusConfig[stage];

        return (
          <div key={stage} className="flex items-center">
            <div 
              className={cn(
                "w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold transition-all",
                isCompleted && `${config.bgColor} text-white`,
                isCurrent && `${config.bgColor} text-white ring-1 ring-offset-1 ring-offset-background`,
                !isCompleted && !isCurrent && "bg-muted/30 text-muted-foreground"
              )}
              title={config.label}
            >
              {isCompleted ? <Check className="w-2 h-2" /> : stageStep}
            </div>
            {index < pipelineStages.length - 1 && (
              <div 
                className={cn(
                  "w-3 h-0.5 mx-0.5",
                  isCompleted ? config.bgColor : "bg-muted/30"
                )} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SubmissionQueue({ submissions }: SubmissionQueueProps) {
  const { updateStatus } = useSubmissions();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(b.statusChangedDate || b.submissionDate).getTime() - 
    new Date(a.statusChangedDate || a.submissionDate).getTime()
  );

  const handleUpdateStatus = (newStatus: SubmissionStatus, notes?: string) => {
    if (selectedSubmission) {
      updateStatus(selectedSubmission.id, newStatus, notes);
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-2 text-[10px] font-medium text-muted-foreground w-8">#</th>
                <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Consultant</th>
                <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Job / Client</th>
                <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Vendor</th>
                <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Rate</th>
                <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Pipeline</th>
                <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Status</th>
                <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Last Updated</th>
                <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Actions</th>
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
                    <td className="p-2">
                      <span className="text-[9px] text-muted-foreground font-mono">
                        #{(index + 1).toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-2.5 h-2.5 text-primary" />
                        </div>
                        <span className="text-[10px] font-medium text-foreground">{submission.consultantName}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-2.5 h-2.5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] text-foreground">{submission.jobTitle}</p>
                          <p className="text-[8px] text-muted-foreground">{submission.client}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-2.5 h-2.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{submission.vendorName}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-0.5">
                        <DollarSign className="w-2.5 h-2.5 text-success" />
                        <span className="text-[10px] font-medium text-foreground">{submission.rate}/hr</span>
                      </div>
                      {submission.rateConfirmationDate && (
                        <p className="text-[7px] text-success mt-0.5">✓ Confirmed</p>
                      )}
                    </td>
                    <td className="p-2 min-w-[140px]">
                      <PipelineProgress currentStatus={submission.status} />
                    </td>
                    <td className="p-2">
                      <Badge className={cn(
                        "border text-[9px] px-1.5 py-0",
                        status.bgColor + '/20',
                        status.color,
                        'border-current/30'
                      )}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                        <div>
                          <p className="text-[9px] text-muted-foreground">
                            {submission.statusChangedDate 
                              ? formatDateTime(submission.statusChangedDate)
                              : submission.submissionDate
                            }
                          </p>
                          <p className="text-[7px] text-muted-foreground">
                            by {submission.statusChangedBy || 'Admin'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-5 px-1.5 text-[8px]"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowStatusModal(true);
                          }}
                        >
                          Update <ChevronRight className="w-2 h-2 ml-0.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowHistoryModal(true);
                          }}
                        >
                          <History className="w-2.5 h-2.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedSubmission && (
        <StatusUpdateModal
          open={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedSubmission(null);
          }}
          currentStatus={selectedSubmission.status}
          consultantName={selectedSubmission.consultantName}
          jobTitle={selectedSubmission.jobTitle}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={() => setShowHistoryModal(false)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-foreground">Status History</DialogTitle>
            {selectedSubmission && (
              <p className="text-[10px] text-muted-foreground">
                {selectedSubmission.consultantName} • {selectedSubmission.jobTitle}
              </p>
            )}
          </DialogHeader>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedSubmission?.statusHistory.map((entry, index) => (
              <div 
                key={entry.id} 
                className="flex items-start gap-2 p-2 rounded-lg bg-muted/20 border border-border"
              >
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold mt-0.5",
                  statusConfig[entry.toStatus].bgColor,
                  "text-white"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    {entry.fromStatus && (
                      <>
                        <Badge variant="outline" className="text-[8px] px-1 py-0">
                          {statusConfig[entry.fromStatus].label}
                        </Badge>
                        <ChevronRight className="w-2 h-2 text-muted-foreground" />
                      </>
                    )}
                    <Badge className={cn(
                      "text-[8px] px-1 py-0",
                      statusConfig[entry.toStatus].bgColor + '/20',
                      statusConfig[entry.toStatus].color
                    )}>
                      {statusConfig[entry.toStatus].label}
                    </Badge>
                  </div>
                  <p className="text-[8px] text-muted-foreground mt-0.5">
                    {formatDateTime(entry.changedDate)} by {entry.changedBy}
                  </p>
                  {entry.notes && (
                    <p className="text-[9px] text-foreground mt-1 italic">"{entry.notes}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}