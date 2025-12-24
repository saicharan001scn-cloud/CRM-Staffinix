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
  AlertCircle,
  FileText,
  RefreshCw,
  ExternalLink,
  Paperclip,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const emailTemplates = [
  { id: '1', name: 'Hotlist Email', type: 'marketing', lastUsed: '2 hours ago', opens: 234 },
  { id: '2', name: 'Submission Follow-up', type: 'follow-up', lastUsed: '5 hours ago', opens: 156 },
  { id: '3', name: 'New Consultant Intro', type: 'marketing', lastUsed: '1 day ago', opens: 89 },
  { id: '4', name: 'Interview Confirmation', type: 'transactional', lastUsed: '3 hours ago', opens: 45 },
];

const recentCampaigns = [
  { id: '1', name: 'Weekly Hotlist - Java Developers', sent: 450, opened: 234, replied: 23, status: 'completed' },
  { id: '2', name: 'Urgent: Salesforce Consultants', sent: 120, opened: 89, replied: 12, status: 'completed' },
  { id: '3', name: 'DevOps Engineers Available', sent: 0, opened: 0, replied: 0, status: 'scheduled' },
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
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isPreFilled, setIsPreFilled] = useState(false);

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

    // Log the send action
    console.log('Email sent via Outlook:', { to: toEmail, subject });
  };

  const handleSendViaGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
    
    toast.success('Opening Gmail...', {
      description: 'Email opened in Gmail compose window.'
    });
  };

  const handleSendNow = () => {
    if (!toEmail) {
      toast.error('Please enter a recipient email address');
      return;
    }
    
    toast.success('Email sent successfully!', {
      description: `Email sent to ${toEmail}`
    });
    
    // Clear form after sending
    setToEmail('');
    setSubject('');
    setBody('');
    setAttachments([]);
    setIsPreFilled(false);
  };

  const removeAttachment = (fileName: string) => {
    setAttachments(prev => prev.filter(a => a !== fileName));
  };

  const handleCopyToClipboard = () => {
    const emailContent = `To: ${toEmail}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(emailContent);
    toast.success('Email content copied to clipboard!');
  };

  return (
    <MainLayout
      title="Email Automation"
      subtitle="AI-powered email campaigns and automation"
      action={{ label: 'New Campaign', onClick: () => {} }}
      showBackButton={false}
    >
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Compose */}
        <div className="col-span-2 space-y-6">
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
                  placeholder="Select vendors or paste email addresses..." 
                  className="bg-muted border-0"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                />
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
                  placeholder="Write your message or use AI to generate..." 
                  className="min-h-[200px] bg-muted border-0"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              {/* Attachments Section */}
              {attachments.length > 0 && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Attachments</label>
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
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Improve
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Use Template
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyToClipboard}>
                    <Paperclip className="w-4 h-4" />
                    Copy Content
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Schedule</Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleSendViaOutlook}>
                    <ExternalLink className="w-4 h-4" />
                    Send via Outlook
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleSendViaGmail}>
                    <Mail className="w-4 h-4" />
                    Send via Gmail
                  </Button>
                  <Button size="sm" className="gap-2" onClick={handleSendNow}>
                    <Send className="w-4 h-4" />
                    Send Now
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
                          : 'Scheduled for tomorrow 9:00 AM'
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

        {/* Right Column - Templates */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Email Templates</h3>
            <div className="space-y-3">
              {emailTemplates.map((template) => (
                <button 
                  key={template.id}
                  className="w-full flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-foreground">{template.name}</p>
                    <p className="text-sm text-muted-foreground">Used {template.lastUsed}</p>
                  </div>
                  <Badge variant="outline">{template.opens} opens</Badge>
                </button>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Templates
            </Button>
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

          {/* Quick Send Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSendViaOutlook}>
                <ExternalLink className="w-4 h-4" />
                Open in Outlook
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSendViaGmail}>
                <Mail className="w-4 h-4" />
                Open in Gmail
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleCopyToClipboard}>
                <Paperclip className="w-4 h-4" />
                Copy to Clipboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}