import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, Send, Paperclip, User, Briefcase, Building2, 
  FileText, X, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface SendToVendorModalProps {
  open: boolean;
  onClose: () => void;
  consultantName: string;
  jobTitle: string;
  clientName?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorContactName?: string;
  resumeFileName?: string;
}

export function SendToVendorModal({
  open,
  onClose,
  consultantName,
  jobTitle,
  clientName = 'Client Company',
  vendorName = 'TechStaff Solutions',
  vendorEmail = 'vendor@techstaff.com',
  vendorContactName = 'Hiring Manager',
  resumeFileName = 'Resume_Tailored.pdf'
}: SendToVendorModalProps) {
  const navigate = useNavigate();
  
  const [toEmail, setToEmail] = useState(vendorEmail);
  const [ccEmail, setCcEmail] = useState('');
  const [bccEmail, setBccEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<string[]>([resumeFileName]);

  // Generate email template on mount or when props change
  useEffect(() => {
    setSubject(`Candidate Submission: ${consultantName} for ${jobTitle} at ${clientName}`);
    setBody(`Dear ${vendorContactName},

Please find attached the resume of ${consultantName} for the ${jobTitle} position at ${clientName}.

Key Highlights:
• 8+ years experience in Software Development
• Visa Status: H1B
• Rate Expectation: $85/hour
• Availability: Immediate

This candidate has been tailored specifically for this requirement and is ready for immediate submission.

Best regards,
Your Name
Account Manager
StaffingPro Solutions`);
  }, [consultantName, jobTitle, clientName, vendorContactName]);

  const handleComposeEmail = () => {
    // Store email data in sessionStorage for Email Automation page
    const emailData = {
      to: toEmail,
      cc: ccEmail,
      bcc: bccEmail,
      subject,
      body,
      attachments,
      candidateName: consultantName,
      jobTitle,
      clientName,
      vendorName
    };
    
    sessionStorage.setItem('emailData', JSON.stringify(emailData));
    
    toast.success('Redirecting to Email Automation...', {
      description: 'Email data has been pre-filled.'
    });
    
    onClose();
    navigate('/emails');
  };

  const removeAttachment = (fileName: string) => {
    setAttachments(prev => prev.filter(a => a !== fileName));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Send Resume to Vendor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Pre-filled Info Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <User className="w-3 h-3" />
                Candidate
              </div>
              <p className="text-sm font-medium text-foreground">{consultantName}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Briefcase className="w-3 h-3" />
                Job Title
              </div>
              <p className="text-sm font-medium text-foreground">{jobTitle}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Building2 className="w-3 h-3" />
                Vendor
              </div>
              <p className="text-sm font-medium text-foreground">{vendorName}</p>
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input 
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="vendor@email.com"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Cc (optional)</Label>
                <Input 
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  placeholder="cc@email.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Bcc (optional)</Label>
                <Input 
                  value={bccEmail}
                  onChange={(e) => setBccEmail(e.target.value)}
                  placeholder="bcc@email.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <Input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Message</Label>
              <Textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-1 min-h-[180px] font-mono text-sm"
              />
            </div>

            {/* Attachments */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Attachments</Label>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file) => (
                  <Badge 
                    key={file} 
                    variant="secondary" 
                    className="gap-1 pr-1"
                  >
                    <FileText className="w-3 h-3" />
                    {file}
                    <button 
                      onClick={() => removeAttachment(file)}
                      className="ml-1 p-0.5 hover:bg-background/50 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="h-6 text-xs gap-1">
                  <Paperclip className="w-3 h-3" />
                  Add File
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleComposeEmail}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Compose Email
              </Button>
              <Button 
                onClick={() => {
                  handleComposeEmail();
                }}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                Send Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
