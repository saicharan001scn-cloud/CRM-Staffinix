import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Send, FileText, Building2, User, Mail, Globe } from 'lucide-react';

interface SubmitConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  consultantName: string;
  jobTitle: string;
  client: string;
  rate: number;
  isTailored: boolean;
  sourceType?: 'portal' | 'vendor_email';
  vendorName?: string;
  vendorEmail?: string;
  portalName?: string;
  portalUrl?: string;
}

export function SubmitConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  consultantName, 
  jobTitle,
  client,
  rate,
  isTailored,
  sourceType = 'vendor_email',
  vendorName,
  vendorEmail,
  portalName,
  portalUrl
}: SubmitConfirmModalProps) {
  const isPortal = sourceType === 'portal';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            {isPortal ? (
              <>
                <Globe className="w-5 h-5 text-blue-500" />
                Submit to Portal
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 text-primary" />
                Confirm Vendor Submission
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isPortal 
              ? `This will open ${portalName || 'the portal'} in a new tab for direct submission.`
              : 'Confirm submission details before sending to vendor.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Candidate:</span>
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
            
            {/* Source-specific info */}
            {isPortal ? (
              <div className="flex items-center gap-3 pt-2 border-t border-border mt-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Portal:</span>
                <span className="text-sm font-medium text-blue-500">{portalName || 'Job Portal'}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 pt-2 border-t border-border mt-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Vendor:</span>
                  <span className="text-sm font-medium text-foreground">{vendorName || 'Vendor'}</span>
                </div>
                {vendorEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Contact:</span>
                    <span className="text-sm font-medium text-foreground">{vendorEmail}</span>
                  </div>
                )}
              </>
            )}
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
            <Badge variant="outline" className={isPortal ? "text-blue-500 border-blue-500/30" : ""}>
              {isPortal ? (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  Portal Submission
                </>
              ) : (
                <>
                  <Mail className="w-3 h-3 mr-1" />
                  Email to Vendor
                </>
              )}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {isPortal 
              ? 'The portal will open in a new tab. Your submission will be tracked in the Submissions page.'
              : 'You will be redirected to the Email Automation page to compose and send the email.'}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 gap-2">
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            className={`flex-1 gap-2 ${isPortal ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
          >
            {isPortal ? (
              <>
                <Globe className="w-4 h-4" />
                Open Portal
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Confirm & Email
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}