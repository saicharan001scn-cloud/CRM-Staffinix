import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SubmissionStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Check, ArrowRight, Clock } from 'lucide-react';

interface StatusUpdateModalProps {
  open: boolean;
  onClose: () => void;
  currentStatus: SubmissionStatus;
  consultantName: string;
  jobTitle: string;
  onUpdateStatus: (newStatus: SubmissionStatus, notes?: string) => void;
}

const statusConfig: Record<SubmissionStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
  description: string;
}> = {
  applied: { 
    label: 'Applied', 
    color: 'text-warning', 
    bgColor: 'bg-warning/20 border-warning/30',
    description: 'Resume shared, awaiting rate confirmation'
  },
  submission: { 
    label: 'Submission', 
    color: 'text-info', 
    bgColor: 'bg-info/20 border-info/30',
    description: 'Rate confirmed, submitted to end client'
  },
  interview_scheduled: { 
    label: 'Interview Scheduled', 
    color: 'text-chart-5', 
    bgColor: 'bg-chart-5/20 border-chart-5/30',
    description: 'Interview date confirmed with client'
  },
  client_interview: { 
    label: 'Client Interview', 
    color: 'text-primary', 
    bgColor: 'bg-primary/20 border-primary/30',
    description: 'Interview completed, awaiting feedback'
  },
  offer_letter: { 
    label: 'Offer Letter', 
    color: 'text-success', 
    bgColor: 'bg-success/20 border-success/30',
    description: 'Offer received from client'
  },
  placed: { 
    label: 'Placed', 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/20 border-emerald-500/30',
    description: 'Consultant started working'
  },
  rejected: { 
    label: 'Rejected', 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/20 border-destructive/30',
    description: 'Application rejected'
  }
};

const statusOrder: SubmissionStatus[] = [
  'applied', 
  'submission', 
  'interview_scheduled', 
  'client_interview', 
  'offer_letter', 
  'placed'
];

export function StatusUpdateModal({ 
  open, 
  onClose, 
  currentStatus, 
  consultantName,
  jobTitle,
  onUpdateStatus 
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus | null>(null);
  const [notes, setNotes] = useState('');

  const currentIndex = statusOrder.indexOf(currentStatus);

  const handleSubmit = () => {
    if (selectedStatus) {
      onUpdateStatus(selectedStatus, notes || undefined);
      setSelectedStatus(null);
      setNotes('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-foreground">Update Status</DialogTitle>
          <p className="text-[10px] text-muted-foreground mt-1">
            {consultantName} • {jobTitle}
          </p>
        </DialogHeader>

        <div className="space-y-3">
          {/* Current Status */}
          <div className="p-2 rounded-lg bg-muted/30 border border-border">
            <p className="text-[10px] text-muted-foreground mb-1">Current Status</p>
            <div className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-medium",
              statusConfig[currentStatus].bgColor,
              statusConfig[currentStatus].color
            )}>
              <Clock className="w-2.5 h-2.5" />
              {statusConfig[currentStatus].label}
            </div>
          </div>

          {/* Status Options */}
          <div>
            <Label className="text-[10px] text-muted-foreground mb-2 block">Select New Status</Label>
            <div className="space-y-1.5">
              {statusOrder.map((status, index) => {
                const config = statusConfig[status];
                const isPast = index < currentIndex;
                const isCurrent = status === currentStatus;
                const isNext = index === currentIndex + 1;
                
                return (
                  <button
                    key={status}
                    onClick={() => !isCurrent && setSelectedStatus(status)}
                    disabled={isCurrent}
                    className={cn(
                      "w-full p-2 rounded-lg border text-left transition-all",
                      isCurrent && "opacity-50 cursor-not-allowed bg-muted/20",
                      selectedStatus === status && "ring-1 ring-primary",
                      !isCurrent && "hover:bg-muted/30 cursor-pointer",
                      isNext && "border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center text-[8px]",
                          isPast && "bg-success/20 text-success",
                          isCurrent && "bg-primary/20 text-primary",
                          !isPast && !isCurrent && "bg-muted/30 text-muted-foreground"
                        )}>
                          {isPast ? <Check className="w-2.5 h-2.5" /> : index + 1}
                        </div>
                        <div>
                          <p className={cn(
                            "text-[10px] font-medium",
                            selectedStatus === status ? "text-primary" : "text-foreground"
                          )}>
                            {config.label}
                          </p>
                          <p className="text-[8px] text-muted-foreground">{config.description}</p>
                        </div>
                      </div>
                      {selectedStatus === status && (
                        <ArrowRight className="w-3 h-3 text-primary" />
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Rejected option */}
              <button
                onClick={() => setSelectedStatus('rejected')}
                className={cn(
                  "w-full p-2 rounded-lg border text-left transition-all hover:bg-destructive/10",
                  selectedStatus === 'rejected' && "ring-1 ring-destructive border-destructive/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-destructive/20 text-destructive flex items-center justify-center text-[8px]">
                    ✕
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-destructive">Rejected</p>
                    <p className="text-[8px] text-muted-foreground">Application rejected at any stage</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Notes */}
          {selectedStatus && (
            <div>
              <Label htmlFor="notes" className="text-[10px] text-muted-foreground">
                Notes {selectedStatus === 'submission' && '(Rate confirmation details)'}
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={selectedStatus === 'submission' 
                  ? "e.g., Rate confirmed at $75/hr by vendor" 
                  : "Add optional notes..."
                }
                className="mt-1 h-16 text-[10px] resize-none"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={handleClose} className="text-[10px]">
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSubmit} 
            disabled={!selectedStatus}
            className="text-[10px]"
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}