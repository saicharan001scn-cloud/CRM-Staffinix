import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Send, 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  FileText,
  RefreshCw,
  ExternalLink,
  Paperclip,
  X,
  ChevronDown,
  User,
  DollarSign,
  MessageSquare,
  Printer,
  Trash2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Sample email templates with tokens
const sampleTemplates = [
  {
    id: 'candidate-applying',
    name: 'Candidate Applying',
    icon: User,
    description: 'Reach out to candidates about opportunities',
    subject: '{{job_title}} Opportunity at {{client_name}}',
    body: `Hi {{candidate_name}},

We have a {{job_title}} position at {{client_name}} that matches your skills.

Details:
• Rate: {{rate_range}}/hour
• Location: {{location}}
• Duration: {{duration}}
• Visa: {{visa_requirements}}

Are you available and interested?

Best regards,
{{recruiter_name}}`
  },
  {
    id: 'submission-to-vendor',
    name: 'Submission to Vendor',
    icon: Send,
    description: 'Submit candidates to vendors',
    subject: 'Candidate Submission: {{candidate_name}} for {{job_title}}',
    body: `Dear {{vendor_contact}},

Please find attached the resume of {{candidate_name}} for the {{job_title}} position at {{client_name}}.

Candidate Highlights:
• Experience: {{years}} years in {{primary_skill}}
• Visa Status: {{visa_status}}
• Rate: {{rate}}/hour
• Availability: {{availability}}

Please submit to {{client_name}} and share feedback.

Regards,
{{your_name}}`
  },
  {
    id: 'rate-confirmation',
    name: 'Rate Confirmation',
    icon: DollarSign,
    description: 'Confirm rates with vendors',
    subject: 'Rate Confirmation: {{candidate_name}} for {{job_title}}',
    body: `Hi {{vendor_contact}},

Confirming the agreed rate for {{candidate_name}}:

• Position: {{job_title}} at {{client_name}}
• Agreed Rate: {{rate}}/hour
• Employment Type: {{employment_type}}
• Start Date: {{start_date}}

Please acknowledge this rate confirmation.

Thanks,
{{your_name}}`
  },
  {
    id: 'follow-up',
    name: 'Follow-up Template',
    icon: RefreshCw,
    description: 'Follow up on submissions',
    subject: 'Following up: {{candidate_name}} for {{job_title}}',
    body: `Hi {{contact_name}},

Following up on {{candidate_name}} submitted for {{job_title}} at {{client_name}}.

Current Status: {{current_status}}

Any updates or feedback from the client?

Best,
{{your_name}}`
  }
];

const recentCampaigns = [
  { id: '1', name: 'Weekly Hotlist - Java Developers', sent: 450, opened: 234, replied: 23, status: 'completed' },
  { id: '2', name: 'Urgent: Salesforce Consultants', sent: 120, opened: 89, replied: 12, status: 'completed' },
  { id: '3', name: 'DevOps Engineers Available', sent: 0, opened: 0, replied: 0, status: 'draft' },
];

interface EmailData {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  attachments?: string[];
  candidateName?: string;
  jobTitle?: string;
  clientName?: string;
  vendorName?: string;
}

export default function Emails() {
  const [toEmail, setToEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [bccEmail, setBccEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isPreFilled, setIsPreFilled] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // Check for pre-filled email data from sessionStorage
  useEffect(() => {
    const emailDataStr = sessionStorage.getItem('emailData');
    if (emailDataStr) {
      try {
        const emailData: EmailData = JSON.parse(emailDataStr);
        setToEmail(emailData.to || '');
        setSubject(emailData.subject || '');
        setBody(emailData.body || '');
        setAttachments(emailData.attachments || []);
        setIsPreFilled(true);
        
        // Clear storage after use
        sessionStorage.removeItem('emailData');
        
        toast.success('Email data loaded!', {
          description: `Ready to send to ${emailData.vendorName || 'vendor'}`
        });
      } catch (e) {
        console.error('Failed to parse email data:', e);
      }
    }
  }, []);

  const handleSendViaOutlook = () => {
    const mailtoLink = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    toast.success('Opening Outlook...', {
      description: 'Email opened in your default email client.'
    });
  };

  const handleSendViaGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
    
    toast.success('Opening Gmail...', {
      description: 'Email opened in Gmail compose window.'
    });
  };

  const handleSendViaYahoo = () => {
    const yahooUrl = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(toEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(yahooUrl, '_blank');
    
    toast.success('Opening Yahoo Mail...', {
      description: 'Email opened in Yahoo Mail compose window.'
    });
  };

  const handleCopyToClipboard = () => {
    const emailContent = `To: ${toEmail}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(emailContent);
    toast.success('Email content copied to clipboard!');
  };

  const handleSaveDraft = () => {
    const draftData = {
      to: toEmail,
      cc: ccEmail,
      bcc: bccEmail,
      subject,
      body,
      attachments,
      savedAt: new Date().toISOString()
    };
    
    // Save to localStorage for persistence
    const drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
    drafts.push(draftData);
    localStorage.setItem('emailDrafts', JSON.stringify(drafts));
    
    toast.success('Draft saved!', {
      description: 'Your email draft has been saved.'
    });
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Email Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { margin-bottom: 20px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; }
            .body { white-space: pre-wrap; margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Email Preview</h2>
          </div>
          <div class="field"><span class="label">To:</span> ${toEmail}</div>
          ${ccEmail ? `<div class="field"><span class="label">Cc:</span> ${ccEmail}</div>` : ''}
          ${bccEmail ? `<div class="field"><span class="label">Bcc:</span> ${bccEmail}</div>` : ''}
          <div class="field"><span class="label">Subject:</span> ${subject}</div>
          <div class="body">${body}</div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDiscard = () => {
    setShowDiscardDialog(true);
  };

  const confirmDiscard = () => {
    setToEmail('');
    setCcEmail('');
    setBccEmail('');
    setSubject('');
    setBody('');
    setAttachments([]);
    setIsPreFilled(false);
    setShowDiscardDialog(false);
    toast.success('Email discarded');
  };

  const removeAttachment = (fileName: string) => {
    setAttachments(prev => prev.filter(a => a !== fileName));
  };

  const applyTemplate = (template: typeof sampleTemplates[0]) => {
    setSubject(template.subject);
    setBody(template.body);
    toast.success(`Template "${template.name}" applied!`, {
      description: 'Replace {{tokens}} with actual values.'
    });
  };

  return (
    <MainLayout
      title="Email Automation"
      subtitle="AI-powered email campaigns and automation"
      action={{ label: 'New Campaign', onClick: () => {} }}
      showBackButton={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Templates */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Template Library
            </h3>
            <div className="space-y-3">
              {sampleTemplates.map((template) => (
                <button 
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className="w-full flex items-start gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left border border-transparent hover:border-primary/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <template.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{template.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Email Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Emails Sent (Today)</span>
                <span className="font-bold text-foreground">234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Open Rate</span>
                <span className="font-bold text-success">52%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reply Rate</span>
                <span className="font-bold text-foreground">8.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bounced</span>
                <span className="font-bold text-destructive">2</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Compose */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Send Hotlist</p>
                <p className="text-sm text-muted-foreground">To 156 vendors</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-warning" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Follow-ups</p>
                <p className="text-sm text-muted-foreground">12 pending</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">AI Generate</p>
                <p className="text-sm text-muted-foreground">Smart emails</p>
              </div>
            </button>
          </div>

          {/* Compose Area */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Compose Email
              </h3>
              <div className="flex items-center gap-2">
                {isPreFilled && (
                  <>
                    <Badge className="gap-1 bg-success/20 text-success border border-success/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Candidate Status: APPLIED
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="w-3 h-3" />
                      Pre-filled from submission
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">To</label>
                <Input 
                  placeholder="recipient@email.com" 
                  className="bg-muted border-0"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Cc</label>
                  <Input 
                    placeholder="cc@email.com" 
                    className="bg-muted border-0"
                    value={ccEmail}
                    onChange={(e) => setCcEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Bcc</label>
                  <Input 
                    placeholder="bcc@email.com" 
                    className="bg-muted border-0"
                    value={bccEmail}
                    onChange={(e) => setBccEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
                <Input 
                  placeholder="Email subject line..." 
                  className="bg-muted border-0"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Message</label>
                <Textarea 
                  placeholder="Write your message or select a template from the library..." 
                  className="min-h-[250px] bg-muted border-0 font-mono text-sm"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              {/* Attachments Section */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Attachments ({attachments.length})
                </label>
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
                  <Button variant="outline" size="sm" className="text-xs">
                    Add Files
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Improve
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {/* Send via Email Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Send via Email
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleSendViaOutlook} className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Send via Outlook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSendViaGmail} className="gap-2">
                        <Mail className="w-4 h-4" />
                        Send via Gmail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSendViaYahoo} className="gap-2">
                        <Mail className="w-4 h-4" />
                        Send via Yahoo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleCopyToClipboard} className="gap-2">
                        <Paperclip className="w-4 h-4" />
                        Copy to Clipboard
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="outline" size="sm" className="gap-2" onClick={handleSaveDraft}>
                    <Save className="w-4 h-4" />
                    Save Draft
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive" onClick={handleDiscard}>
                    <Trash2 className="w-4 h-4" />
                    Discard
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Campaigns */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Campaigns</h3>
            <div className="space-y-3">
              {recentCampaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {campaign.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.status === 'completed' 
                          ? `${campaign.sent} sent • ${campaign.opened} opened • ${campaign.replied} replied`
                          : 'Draft - not sent yet'
                        }
                      </p>
                    </div>
                  </div>
                  <Badge variant={campaign.status === 'completed' ? 'secondary' : 'outline'}>
                    {campaign.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Email?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard this email? All content will be lost and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDiscard} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}