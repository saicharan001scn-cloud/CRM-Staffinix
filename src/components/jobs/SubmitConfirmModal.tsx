import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Send, FileText, Building2, User } from 'lucide-react';

interface SubmitConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  consultantName: string;
  jobTitle: string;
  client: string;
  rate: number;
  isTailored: boolean;
}

export function SubmitConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  consultantName, 
  jobTitle,
  client,
  rate,
  isTailored
}: SubmitConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Confirm Submission
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Resume and submission details are ready for recruiter review.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Consultant:</span>
              <span className="text-sm font-medium text-foreground">{consultantName}</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Position:</span>
              <span className="text-sm font-medium text-foreground">{jobTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Client:</span>
              <span className="text-sm font-medium text-foreground">{client}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Rate:</span>
              <span className="text-sm font-medium text-success">${rate}/hr</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={isTailored ? "default" : "secondary"}
              className={isTailored ? "bg-success/20 text-success border border-success/30" : ""}
            >
              {isTailored ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  AI-Tailored Resume
                </>
              ) : (
                "Original Resume"
              )}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            This action prepares the submission for recruiter review. The submission will be tracked in the Submissions page.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 gap-2">
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1 gap-2">
            <CheckCircle className="w-4 h-4" />
            Confirm & Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
