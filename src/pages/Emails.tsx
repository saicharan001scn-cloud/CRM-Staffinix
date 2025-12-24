import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Send, 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  FileText,
  RefreshCw,
  Calendar,
  ArrowLeft,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from 'sonner';
import { format } from 'date-fns';

const emailTemplates = [
  { 
    id: '1', 
    name: 'Hotlist Email', 
    type: 'marketing', 
    lastUsed: '2 hours ago', 
    opens: 234,
    subject: 'Hotlist – Available IT Consultants – Immediate Joiners',
    body: `Hi {{VendorName}},

Hope you're doing well! We have the following consultants available for immediate placement:

Please let us know if you have any matching requirements.

Best regards,
{{RecruiterName}}
US IT Staffing Team`
  },
  { 
    id: '2', 
    name: 'Submission Follow-up', 
    type: 'follow-up', 
    lastUsed: '5 hours ago', 
    opens: 156,
    subject: 'Follow-up: {{JobTitle}} Submission',
    body: `Hi {{VendorName}},

I wanted to follow up on the resume I submitted for the {{JobTitle}} position.

Please let me know if you need any additional information.

Best regards,
{{RecruiterName}}`
  },
  { 
    id: '3', 
    name: 'New Consultant Intro', 
    type: 'marketing', 
    lastUsed: '1 day ago', 
    opens: 89,
    subject: 'New Consultant Available – {{Skills}}',
    body: `Hi {{VendorName}},

We have a new consultant who just became available:

Skills: {{Skills}}
Location: {{Location}}
Rate: Negotiable

Please share any matching requirements.

Best regards,
{{RecruiterName}}`
  },
  { 
    id: '4', 
    name: 'Job Requirement Blast', 
    type: 'marketing', 
    lastUsed: '3 hours ago', 
    opens: 45,
    subject: 'Hotlist – {{JobTitle}} – {{Location}}',
    body: `Hi {{VendorName}},

We have the following requirement. Please share matching profiles:

Job Title: {{JobTitle}}
Skills: {{Skills}}
Location: {{Location}}
Rate: {{Rate}}
Visa: {{VisaRequirements}}

Job Description:
{{JobDescription}}

Best regards,
{{RecruiterName}}
US IT Staffing Team`
  },
];

const recentCampaigns = [
  { id: '1', name: 'Weekly Hotlist - Java Developers', sent: 450, opened: 234, replied: 23, status: 'completed' },
  { id: '2', name: 'Urgent: Salesforce Consultants', sent: 120, opened: 89, replied: 12, status: 'completed' },
  { id: '3', name: 'DevOps Engineers Available', sent: 0, opened: 0, replied: 0, status: 'scheduled' },
];

export default function Emails() {
  const location = useLocation();
  const navigate = useNavigate();
  const jobContext = location.state as {
    fromJob?: boolean;
    jobId?: string;
    jobTitle?: string;
    jobLocation?: string;
    jobSkills?: string[];
    jobRate?: { min: number; max: number };
    jobClient?: string;
    jobType?: string;
    jobDescription?: string;
    visaRequirements?: string[];
    vendorEmails?: string;
    breadcrumb?: string;
  } | null;

  // Form state
  const [toField, setToField] = useState('');
  const [subjectField, setSubjectField] = useState('');
  const [messageField, setMessageField] = useState('');
  const [includeComplianceFooter, setIncludeComplianceFooter] = useState(true);

  // Modal states
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [aiGenerateModalOpen, setAiGenerateModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [hotlistModalOpen, setHotlistModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState('09:00');

  // Recruiter name (mock)
  const recruiterName = 'John Smith';

  // Auto-fill from job context
  useEffect(() => {
    if (jobContext?.fromJob) {
      setToField(jobContext.vendorEmails || '');
      
      const subject = `Hotlist – ${jobContext.jobTitle} – ${jobContext.jobLocation}`;
      setSubjectField(subject);
      
      const body = `Hi,

We have the following requirement. Please share matching profiles:

Job Title: ${jobContext.jobTitle}
Client: ${jobContext.jobClient}
Skills: ${jobContext.jobSkills?.join(', ')}
Location: ${jobContext.jobLocation}
Rate: $${jobContext.jobRate?.min}-${jobContext.jobRate?.max}/hr (${jobContext.jobType})
Visa: ${jobContext.visaRequirements?.join(', ')}

Job Description:
${jobContext.jobDescription}

We are looking for an experienced professional with strong skills in the required technologies. The ideal candidate should have excellent communication skills and ability to work in a fast-paced environment.

Best regards,
${recruiterName}
US IT Staffing Team`;
      
      setMessageField(body);
    }
  }, [jobContext]);

  const replacePlaceholders = (text: string) => {
    return text
      .replace(/\{\{JobTitle\}\}/g, jobContext?.jobTitle || '[Job Title]')
      .replace(/\{\{Skills\}\}/g, jobContext?.jobSkills?.join(', ') || '[Skills]')
      .replace(/\{\{Location\}\}/g, jobContext?.jobLocation || '[Location]')
      .replace(/\{\{VendorName\}\}/g, '[Vendor]')
      .replace(/\{\{RecruiterName\}\}/g, recruiterName)
      .replace(/\{\{Rate\}\}/g, jobContext?.jobRate ? `$${jobContext.jobRate.min}-${jobContext.jobRate.max}/hr` : '[Rate]')
      .replace(/\{\{VisaRequirements\}\}/g, jobContext?.visaRequirements?.join(', ') || '[Visa]')
      .replace(/\{\{JobDescription\}\}/g, jobContext?.jobDescription || '[Description]');
  };

  const handleAIImprove = () => {
    // Simulate AI improvement
    const improvedMessage = messageField
      .replace('Hi,', 'Dear Hiring Manager,')
      .replace('Best regards,', 'Thank you for your time and consideration.\n\nBest regards,');
    
    setMessageField(improvedMessage);
    toast.success('Email improved by AI', {
      description: 'Tone and clarity have been enhanced.'
    });
  };

  const handleSelectTemplate = (template: typeof emailTemplates[0]) => {
    setSubjectField(replacePlaceholders(template.subject));
    setMessageField(replacePlaceholders(template.body));
    setTemplateModalOpen(false);
    toast.success('Template applied', {
      description: `"${template.name}" template loaded.`
    });
  };

  const handleSendNow = () => {
    setSendConfirmOpen(false);
    toast.success('Email sent successfully!', {
      description: `Sent to ${toField.split(',').length} recipient(s).`
    });
    
    // Navigate back or show success state
    if (jobContext?.fromJob) {
      navigate('/jobs');
    }
  };

  const handleSchedule = () => {
    if (!scheduleDate) {
      toast.error('Please select a date');
      return;
    }
    
    setScheduleOpen(false);
    toast.success('Email scheduled!', {
      description: `Scheduled for ${format(scheduleDate, 'PPP')} at ${scheduleTime}.`
    });
    
    if (jobContext?.fromJob) {
      navigate('/jobs');
    }
  };

  const handleHotlistClick = () => {
    setHotlistModalOpen(true);
  };

  const handleFollowUpClick = () => {
    setFollowUpModalOpen(true);
  };

  const handleAIGenerateClick = () => {
    setAiGenerateModalOpen(true);
  };

  const getComplianceFooter = () => {
    return `

---
US IT Staffing Solutions
123 Business Center, Suite 456
City, State 12345
Phone: (555) 123-4567

To unsubscribe from our mailing list, please reply with "UNSUBSCRIBE" in the subject line.
This email and any attachments are confidential and intended solely for the addressee.`;
  };

  const getFullMessage = () => {
    return includeComplianceFooter ? messageField + getComplianceFooter() : messageField;
  };

  return (
    <MainLayout
      title="Email Automation"
      subtitle="AI-powered email campaigns and automation"
      action={{ label: 'New Campaign', onClick: () => {} }}
      showBackButton={false}
    >
      {/* Breadcrumb from Job */}
      {jobContext?.breadcrumb && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/jobs/${jobContext.jobId}`)}
            className="gap-2 text-xs"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Job
          </Button>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-primary font-medium">{jobContext.breadcrumb}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Compose */}
        <div className="col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={handleHotlistClick}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Send Hotlist</p>
                <p className="text-sm text-muted-foreground">To 156 vendors</p>
              </div>
            </button>

            <button 
              onClick={handleFollowUpClick}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-warning" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Follow-ups</p>
                <p className="text-sm text-muted-foreground">12 pending</p>
              </div>
            </button>

            <button 
              onClick={handleAIGenerateClick}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
            >
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
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Compose Email
              {jobContext?.fromJob && (
                <Badge variant="secondary" className="ml-2 text-xs">From Job Requirement</Badge>
              )}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">To</label>
                <Input 
                  placeholder="Select vendors or paste email addresses..." 
                  className="bg-muted border-0"
                  value={toField}
                  onChange={(e) => setToField(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
                <Input 
                  placeholder="Email subject line..." 
                  className="bg-muted border-0"
                  value={subjectField}
                  onChange={(e) => setSubjectField(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Message</label>
                <Textarea 
                  placeholder="Write your message or use AI to generate..." 
                  className="min-h-[200px] bg-muted border-0"
                  value={messageField}
                  onChange={(e) => setMessageField(e.target.value)}
                />
              </div>

              {/* Placeholder Help */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>Available Placeholders:</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {['{{JobTitle}}', '{{Skills}}', '{{Location}}', '{{VendorName}}', '{{RecruiterName}}', '{{Rate}}'].map(placeholder => (
                    <Badge 
                      key={placeholder} 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-primary/10"
                      onClick={() => setMessageField(prev => prev + ' ' + placeholder)}
                    >
                      {placeholder}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Compliance Footer Toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="compliance-footer" className="text-sm font-medium">
                    Include Compliance Footer
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Adds company details and unsubscribe text
                  </p>
                </div>
                <Switch
                  id="compliance-footer"
                  checked={includeComplianceFooter}
                  onCheckedChange={setIncludeComplianceFooter}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleAIImprove}>
                    <Sparkles className="w-4 h-4" />
                    AI Improve
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setTemplateModalOpen(true)}>
                    <FileText className="w-4 h-4" />
                    Use Template
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" className="gap-2" onClick={() => setSendConfirmOpen(true)}>
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
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
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
                  onClick={() => handleSelectTemplate(template)}
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
        </div>
      </div>

      {/* Send Confirmation Modal */}
      <Dialog open={sendConfirmOpen} onOpenChange={setSendConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Send Email</DialogTitle>
            <DialogDescription>
              Are you sure you want to send this email now?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">To:</p>
              <p className="text-sm text-foreground">{toField || 'No recipients'}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Subject:</p>
              <p className="text-sm text-foreground">{subjectField || 'No subject'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNow} className="gap-2">
              <Send className="w-4 h-4" />
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Email</DialogTitle>
            <DialogDescription>
              Choose when to send this email.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label className="mb-2 block">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    {scheduleDate ? format(scheduleDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={scheduleDate}
                    onSelect={setScheduleDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="mb-2 block">Select Time</Label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="bg-muted"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} className="gap-2">
              <Clock className="w-4 h-4" />
              Schedule Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Selection Modal */}
      <Dialog open={templateModalOpen} onOpenChange={setTemplateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Email Template</DialogTitle>
            <DialogDescription>
              Choose a template to use for your email.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3 max-h-[400px] overflow-y-auto">
            {emailTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="w-full text-left p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{template.name}</p>
                  <Badge variant="outline">{template.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Subject: {template.subject}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.body}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Generate Modal */}
      <Dialog open={aiGenerateModalOpen} onOpenChange={setAiGenerateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Email Generator</DialogTitle>
            <DialogDescription>
              Let AI help you create the perfect email.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label className="mb-2 block">What type of email do you want to create?</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Hotlist Email', 'Job Requirement', 'Follow-up', 'Introduction'].map(type => (
                  <Button
                    key={type}
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      const template = emailTemplates.find(t => t.name.includes(type.split(' ')[0]));
                      if (template) handleSelectTemplate(template);
                      setAiGenerateModalOpen(false);
                    }}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiGenerateModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hotlist Modal */}
      <Dialog open={hotlistModalOpen} onOpenChange={setHotlistModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Hotlist Email</DialogTitle>
            <DialogDescription>
              Send your consultant hotlist to all vendors.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm text-foreground font-medium">Recipients: 156 vendors</p>
              <p className="text-xs text-muted-foreground">
                This will send your current bench list to all active vendors in your database.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHotlistModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              const template = emailTemplates.find(t => t.name === 'Hotlist Email');
              if (template) handleSelectTemplate(template);
              setHotlistModalOpen(false);
            }}>
              Prepare Hotlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Follow-up Modal */}
      <Dialog open={followUpModalOpen} onOpenChange={setFollowUpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pending Follow-ups</DialogTitle>
            <DialogDescription>
              12 submissions need follow-up.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3 max-h-[300px] overflow-y-auto">
            {[
              { name: 'Rajesh Kumar', job: 'Senior Java Developer', days: 3 },
              { name: 'Priya Sharma', job: 'React Frontend Engineer', days: 5 },
              { name: 'Amit Patel', job: 'ML Engineer', days: 2 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.job} • {item.days} days ago</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => {
                  const template = emailTemplates.find(t => t.name === 'Submission Follow-up');
                  if (template) {
                    setSubjectField(template.subject.replace('{{JobTitle}}', item.job));
                    setMessageField(template.body.replace('{{JobTitle}}', item.job));
                  }
                  setFollowUpModalOpen(false);
                }}>
                  Follow Up
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUpModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
