import { useState } from 'react';
import { Submission, SubmissionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Building2, User, Briefcase, ChevronRight, History, Clock, Check, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusUpdateModal } from './StatusUpdateModal';
import { RateUpdateModal } from './RateUpdateModal';
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
      <div className="flex items-center gap-1">
        <div className="w-full h-1.5 bg-destructive/30 rounded-full">
          <div className="h-full bg-destructive rounded-full w-full" />
        </div>
        <span className="text-xs text-destructive ml-1">Rejected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {pipelineStages.map((stage, index) => {
        const stageStep = statusConfig[stage].step;
        const isCompleted = stageStep < currentStep;
        const isCurrent = stageStep === currentStep;
        const config = statusConfig[stage];

        return (
          <div key={stage} className="flex items-center">
            <div 
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                isCompleted && `${config.bgColor} text-white`,
                isCurrent && `${config.bgColor} text-white ring-2 ring-offset-1 ring-offset-background`,
                !isCompleted && !isCurrent && "bg-muted/30 text-muted-foreground"
              )}
              title={config.label}
            >
              {isCompleted ? <Check className="w-3 h-3" /> : stageStep}
            </div>
            {index < pipelineStages.length - 1 && (
              <div 
                className={cn(
                  "w-4 h-1 mx-0.5",
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

function RateDifferenceBadge({ appliedRate, submissionRate }: { appliedRate: number; submissionRate?: number }) {
  if (!submissionRate) return <span className="text-xs text-muted-foreground">—</span>;
  
  const diff = submissionRate - appliedRate;
  const percentage = appliedRate > 0 ? ((diff / appliedRate) * 100).toFixed(0) : '0';
  
  return (
    <div className="flex items-center gap-1">
      {diff > 0 && <TrendingUp className="w-4 h-4 text-success" />}
      {diff < 0 && <TrendingDown className="w-4 h-4 text-destructive" />}
      {diff === 0 && <Minus className="w-4 h-4 text-info" />}
      <span className={cn(
        "text-xs font-semibold",
        diff > 0 && "text-success",
        diff < 0 && "text-destructive",
        diff === 0 && "text-info"
      )}>
        {diff >= 0 ? '+' : ''}{diff}
      </span>
      <span className={cn(
        "text-xs px-1 py-0.5 rounded",
        diff > 0 && "bg-success/20 text-success",
        diff < 0 && "bg-destructive/20 text-destructive",
        diff === 0 && "bg-info/20 text-info"
      )}>
        ({percentage}%)
      </span>
    </div>
  );
}

export function SubmissionQueue({ submissions }: SubmissionQueueProps) {
  const { updateStatus, updateRate } = useSubmissions();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);

  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(b.statusChangedDate || b.submissionDate).getTime() - 
    new Date(a.statusChangedDate || a.submissionDate).getTime()
  );

  const handleUpdateStatus = (newStatus: SubmissionStatus, notes?: string) => {
    if (selectedSubmission) {
      updateStatus(selectedSubmission.id, newStatus, notes);
    }
  };

  const handleUpdateRate = (newRate: number, reason?: string, vendorContact?: string) => {
    if (selectedSubmission) {
      updateRate(selectedSubmission.id, newRate, reason, vendorContact);
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
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground w-10">#</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Consultant</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Job / Client</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Vendor</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Applied $</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Submitted $</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Diff</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Pipeline</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSubmissions.map((submission, index) => {
                const status = statusConfig[submission.status];
                const canUpdateRate = submission.status === 'applied';
                return (
                  <tr 
                    key={submission.id}
                    className="table-row-hover border-b border-border last:border-0 animate-fade-in opacity-0 hover:bg-muted/30 transition-colors"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                  >
                    <td className="p-3">
                      <span className="text-xs text-muted-foreground font-mono">
                        #{(index + 1).toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{submission.consultantName}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{submission.jobTitle}</p>
                          <p className="text-xs text-muted-foreground">{submission.client}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="text-sm text-muted-foreground">{submission.vendorName}</span>
                          {submission.vendorContact && (
                            <p className="text-xs text-muted-foreground">{submission.vendorContact}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-warning" />
                        <span className="text-sm font-bold text-warning">{submission.appliedRate}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {submission.submissionRate ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-info" />
                          <span className="text-sm font-bold text-info">{submission.submissionRate}</span>
                          {submission.rateConfirmationDate && (
                            <Check className="w-4 h-4 text-success" />
                          )}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-warning"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowRateModal(true);
                          }}
                          disabled={!canUpdateRate}
                        >
                          + Set Rate
                        </Button>
                      )}
                    </td>
                    <td className="p-3">
                      <RateDifferenceBadge 
                        appliedRate={submission.appliedRate} 
                        submissionRate={submission.submissionRate} 
                      />
                    </td>
                    <td className="p-3 min-w-[140px]">
                      <PipelineProgress currentStatus={submission.status} />
                    </td>
                    <td className="p-3">
                      <Badge className={cn(
                        "border text-xs px-2 py-1",
                        status.bgColor + '/20',
                        status.color,
                        'border-current/30'
                      )}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {canUpdateRate && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs text-warning border-warning/30"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowRateModal(true);
                            }}
                          >
                            <DollarSign className="w-3 h-3 mr-1" />Rate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowStatusModal(true);
                          }}
                        >
                          Update <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowHistoryModal(true);
                          }}
                        >
                          <History className="w-4 h-4" />
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
          submission={selectedSubmission}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Rate Update Modal */}
      {selectedSubmission && (
        <RateUpdateModal
          open={showRateModal}
          onClose={() => {
            setShowRateModal(false);
            setSelectedSubmission(null);
          }}
          submission={selectedSubmission}
          onUpdateRate={handleUpdateRate}
        />
      )}

      {/* History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={() => setShowHistoryModal(false)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-foreground">History</DialogTitle>
            {selectedSubmission && (
              <p className="text-[10px] text-muted-foreground">
                {selectedSubmission.consultantName} • {selectedSubmission.jobTitle}
              </p>
            )}
          </DialogHeader>
          
          <div className="space-y-3">
            {/* Rate History */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Rate Changes</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedSubmission?.rateHistory.slice().reverse().map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-1.5 bg-muted/20 rounded border border-border">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-foreground">
                          {entry.oldRate ? `$${entry.oldRate} → ` : ''}${entry.newRate}/hr
                        </span>
                        <Badge className={cn(
                          "text-[7px] px-1 py-0",
                          entry.type === 'applied' ? 'bg-warning/20 text-warning' : 'bg-info/20 text-info'
                        )}>
                          {entry.type}
                        </Badge>
                      </div>
                      {entry.reason && <p className="text-[8px] text-muted-foreground italic">"{entry.reason}"</p>}
                    </div>
                    <span className="text-[8px] text-muted-foreground">{entry.changedBy}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Status Changes</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedSubmission?.statusHistory.slice().reverse().map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2 p-1.5 bg-muted/20 rounded border border-border">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold mt-0.5",
                      statusConfig[entry.toStatus].bgColor,
                      "text-white"
                    )}>
                      ✓
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        {entry.fromStatus && (
                          <>
                            <Badge variant="outline" className="text-[7px] px-1 py-0">
                              {statusConfig[entry.fromStatus].label}
                            </Badge>
                            <ChevronRight className="w-2 h-2 text-muted-foreground" />
                          </>
                        )}
                        <Badge className={cn(
                          "text-[7px] px-1 py-0",
                          statusConfig[entry.toStatus].bgColor + '/20',
                          statusConfig[entry.toStatus].color
                        )}>
                          {statusConfig[entry.toStatus].label}
                        </Badge>
                      </div>
                      <p className="text-[7px] text-muted-foreground">
                        {formatDateTime(entry.changedDate)} by {entry.changedBy}
                      </p>
                      {entry.notes && <p className="text-[8px] text-foreground italic">"{entry.notes}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}