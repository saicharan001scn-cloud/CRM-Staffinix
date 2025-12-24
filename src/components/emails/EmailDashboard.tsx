import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Users, 
  Building2, 
  Briefcase,
  Send,
  Clock,
  CheckCircle2,
  Eye,
  MousePointer,
  MessageSquare,
  TrendingUp,
  Play,
  Pause,
  MoreHorizontal,
  Zap,
  Sparkles,
  FileText,
  Calendar,
  X,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { AIEmailGenerator } from './AIEmailGenerator';

interface EmailDashboardProps {
  onCreateCampaign: () => void;
  onOpenTemplates: () => void;
  onOpenAnalytics: () => void;
  onSendHotlist: () => void;
  onOpenFollowUps: () => void;
  onViewCampaign: (campaign: any) => void;
}

const activeCampaigns = [
  { id: '1', name: 'Java Developer Sourcing', status: 'sending', sent: 24, total: 50, openRate: 78, clickRate: 45, replyRate: 28, startedAt: '10:00 AM' },
  { id: '2', name: 'Client Weekly Updates', status: 'completed', sent: 50, total: 50, openRate: 85, clickRate: 62, replyRate: 35, startedAt: '9:00 AM' },
  { id: '3', name: 'Vendor Mass Outreach', status: 'draft', sent: 0, total: 50, openRate: 0, clickRate: 0, replyRate: 0, startedAt: '-' },
  { id: '4', name: 'React Frontend Candidates', status: 'scheduled', sent: 0, total: 35, openRate: 0, clickRate: 0, replyRate: 0, startedAt: 'Tomorrow 9:00 AM' },
];

const emailTemplates = [
  { id: '1', name: 'Cold Candidate Outreach', uses: 234 },
  { id: '2', name: 'Submission Follow-up', uses: 189 },
  { id: '3', name: 'Interview Preparation', uses: 156 },
  { id: '4', name: 'Rate Negotiation', uses: 98 },
];

const templateContents: Record<string, { subject: string; body: string }> = {
  '1': { subject: 'Exciting {{JobTitle}} opportunity at {{ClientName}}', body: 'Hi {{ConsultantName}},\n\nI came across your profile and was impressed by your experience...' },
  '2': { subject: 'Update on your submission to {{ClientName}}', body: 'Hi {{ConsultantName}},\n\nI wanted to give you an update on your submission...' },
  '3': { subject: 'Interview with {{ClientName}} - Prep Guide', body: 'Hi {{ConsultantName}},\n\nCongratulations on securing an interview...' },
  '4': { subject: 'Rate discussion for {{JobTitle}}', body: 'Hi {{ConsultantName}},\n\nGreat news! {{ClientName}} is interested...' },
};

export function EmailDashboard({ onCreateCampaign, onOpenTemplates, onOpenAnalytics, onSendHotlist, onOpenFollowUps, onViewCampaign }: EmailDashboardProps) {
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showTemplateDrawer, setShowTemplateDrawer] = useState(false);
  const [showConfirmSend, setShowConfirmSend] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [emailCategory, setEmailCategory] = useState('');
  const [complianceFooter, setComplianceFooter] = useState(true);
  
  // Compose email state
  const [toEmails, setToEmails] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sending': return <Badge className="bg-primary/20 text-primary border-0">Sending</Badge>;
      case 'completed': return <Badge className="bg-success/20 text-success border-0">Completed</Badge>;
      case 'draft': return <Badge variant="outline">Draft</Badge>;
      case 'scheduled': return <Badge className="bg-warning/20 text-warning border-0">Scheduled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAIImprove = () => {
    if (!emailBody.trim()) {
      toast.error('Please write some content first');
      return;
    }
    toast.success('AI is improving your email...');
    setTimeout(() => {
      setEmailBody(prev => prev + '\n\n[AI Enhanced: Improved clarity and professional tone]');
      toast.success('Email improved!');
    }, 1500);
  };

  const handleUseTemplate = (templateId: string) => {
    const template = templateContents[templateId];
    if (template) {
      setEmailSubject(template.subject);
      setEmailBody(template.body);
      setShowTemplateDrawer(false);
      toast.success('Template applied!');
    }
  };

  const handleSendNow = () => {
    if (!toEmails.trim() || !emailSubject.trim() || !emailBody.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setShowConfirmSend(true);
  };

  const confirmSend = () => {
    toast.success('Email sent successfully!');
    setShowConfirmSend(false);
    setToEmails('');
    setEmailSubject('');
    setEmailBody('');
  };

  const handleSchedule = () => {
    if (!toEmails.trim() || !emailSubject.trim() || !emailBody.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setShowScheduleModal(true);
  };

  const confirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      toast.error('Please select date and time');
      return;
    }
    setIsScheduled(true);
    setShowScheduleModal(false);
    toast.success(`Email scheduled for ${scheduleDate} at ${scheduleTime}`);
  };

  const handleAIGenerate = (subject: string, body: string) => {
    setEmailSubject(subject);
    setEmailBody(body);
  };

  const handleStatClick = (stat: string) => {
    onOpenAnalytics();
    toast.info(`Viewing ${stat} analytics`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Buttons */}
      <div className="flex items-center gap-3">
        <Button onClick={onCreateCampaign} className="gap-2">
          <Mail className="w-4 h-4" />
          Create Campaign
        </Button>
        <Button variant="outline" onClick={onOpenTemplates} className="gap-2">
          <Zap className="w-4 h-4" />
          Template Library
        </Button>
        <Button variant="outline" onClick={onOpenAnalytics} className="gap-2">
          <TrendingUp className="w-4 h-4" />
          Analytics
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <button onClick={onSendHotlist} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Send Hotlist</p>
                <p className="text-sm text-muted-foreground">Share consultants</p>
              </div>
            </button>

            <button onClick={onOpenFollowUps} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Follow-ups</p>
                <p className="text-sm text-muted-foreground">8 pending</p>
              </div>
            </button>

            <button onClick={() => setShowAIGenerator(true)} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">AI Generate</p>
                <p className="text-sm text-muted-foreground">Smart emails</p>
              </div>
            </button>
          </div>

          {/* Compose Email Panel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Compose Email</h3>
              <Select value={emailCategory} onValueChange={setEmailCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Email Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotlist">Consultant Hotlist</SelectItem>
                  <SelectItem value="requirement">Job Requirement</SelectItem>
                  <SelectItem value="submission">Submission Follow-up</SelectItem>
                  <SelectItem value="interview">Interview Confirmation</SelectItem>
                  <SelectItem value="vendor">Vendor Outreach</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">To (comma separated)</label>
                <Input 
                  placeholder="email@example.com, another@example.com"
                  value={toEmails}
                  onChange={(e) => setToEmails(e.target.value)}
                  className="bg-muted border-0"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
                <Input 
                  placeholder="Email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="bg-muted border-0"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Message</label>
                <Textarea 
                  placeholder="Write your message..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="min-h-[150px] bg-muted border-0"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleAIImprove}>
                    <Sparkles className="w-4 h-4" />
                    AI Improve
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowTemplateDrawer(true)}>
                    <FileText className="w-4 h-4" />
                    Use Template
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={complianceFooter} onCheckedChange={setComplianceFooter} />
                  <span className="text-sm text-muted-foreground">Compliance Footer</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                {isScheduled && (
                  <Badge className="bg-warning/20 text-warning border-0 gap-1">
                    <Clock className="w-3 h-3" />
                    Scheduled: {scheduleDate} {scheduleTime}
                  </Badge>
                )}
                <div className="flex-1" />
                <Button variant="outline" className="gap-2" onClick={handleSchedule}>
                  <Calendar className="w-4 h-4" />
                  Schedule
                </Button>
                <Button className="gap-2" onClick={handleSendNow}>
                  <Send className="w-4 h-4" />
                  Send Now
                </Button>
              </div>
            </div>
          </Card>

          {/* Active Campaigns */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Campaigns</h3>
              <Button variant="ghost" size="sm" onClick={onOpenAnalytics}>View All</Button>
            </div>
            
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => onViewCampaign(campaign)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {campaign.status === 'sending' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><Send className="w-4 h-4 text-primary animate-pulse" /></div>}
                      {campaign.status === 'completed' && <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-success" /></div>}
                      {campaign.status === 'draft' && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Mail className="w-4 h-4 text-muted-foreground" /></div>}
                      {campaign.status === 'scheduled' && <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center"><Clock className="w-4 h-4 text-warning" /></div>}
                      <div>
                        <p className="font-medium text-foreground">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.status === 'scheduled' ? `Scheduled: ${campaign.startedAt}` : `Started: ${campaign.startedAt}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(campaign.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewCampaign(campaign); }}><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                          {campaign.status === 'sending' && <DropdownMenuItem><Pause className="w-4 h-4 mr-2" />Pause Campaign</DropdownMenuItem>}
                          {campaign.status === 'draft' && <DropdownMenuItem><Play className="w-4 h-4 mr-2" />Start Campaign</DropdownMenuItem>}
                          <DropdownMenuItem className="text-destructive">Delete Campaign</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{campaign.sent}/{campaign.total} sent</span>
                    </div>
                    <Progress value={(campaign.sent / campaign.total) * 100} className="h-2" />
                  </div>
                  {campaign.status !== 'draft' && campaign.status !== 'scheduled' && (
                    <div className="flex items-center gap-6 pt-2 border-t border-border">
                      <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Open:</span><span className="text-sm font-medium text-foreground">{campaign.openRate}%</span></div>
                      <div className="flex items-center gap-2"><MousePointer className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Click:</span><span className="text-sm font-medium text-foreground">{campaign.clickRate}%</span></div>
                      <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Reply:</span><span className="text-sm font-medium text-foreground">{campaign.replyRate}%</span></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Email Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Today's Stats</h3>
            <div className="space-y-4">
              <button onClick={() => handleStatClick('sent')} className="w-full p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Emails Sent</span>
                  <span className="text-2xl font-bold text-primary">82</span>
                </div>
              </button>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleStatClick('opens')} className="text-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <Eye className="w-5 h-5 text-success mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground">78%</p>
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                </button>
                <button onClick={() => handleStatClick('replies')} className="text-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <MessageSquare className="w-5 h-5 text-warning mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground">28%</p>
                  <p className="text-xs text-muted-foreground">Reply Rate</p>
                </button>
                <button onClick={() => handleStatClick('bounced')} className="text-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-destructive mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground">2</p>
                  <p className="text-xs text-muted-foreground">Bounced</p>
                </button>
              </div>
            </div>
          </Card>

          {/* Templates */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Templates</h3>
              <Button variant="ghost" size="sm" onClick={onOpenTemplates}>View All</Button>
            </div>
            <div className="space-y-2">
              {emailTemplates.map((template) => (
                <button key={template.id} onClick={() => handleUseTemplate(template.id)} className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left">
                  <span className="text-sm text-foreground">{template.name}</span>
                  <Badge variant="outline" className="text-xs">{template.uses}</Badge>
                </button>
              ))}
            </div>
          </Card>

          {/* Compliance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Compliance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Unsubscribe Link</span><CheckCircle2 className="w-5 h-5 text-success" /></div>
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Physical Address</span><CheckCircle2 className="w-5 h-5 text-success" /></div>
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Rate Limiting</span><Badge className="bg-success/20 text-success border-0">Active</Badge></div>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Generator Modal */}
      <AIEmailGenerator open={showAIGenerator} onOpenChange={setShowAIGenerator} onGenerate={handleAIGenerate} />

      {/* Template Drawer */}
      <Dialog open={showTemplateDrawer} onOpenChange={setShowTemplateDrawer}>
        <DialogContent>
          <DialogHeader><DialogTitle>Select Template</DialogTitle></DialogHeader>
          <div className="space-y-2 py-4">
            {emailTemplates.map((template) => (
              <button key={template.id} onClick={() => handleUseTemplate(template.id)} className="w-full flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left">
                <span className="font-medium text-foreground">{template.name}</span>
                <Badge variant="outline">{template.uses} uses</Badge>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Confirmation */}
      <Dialog open={showConfirmSend} onOpenChange={setShowConfirmSend}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Send</DialogTitle></DialogHeader>
          <p className="text-muted-foreground py-4">Are you sure you want to send this email to {toEmails.split(',').length} recipient(s)?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmSend(false)}>Cancel</Button>
            <Button onClick={confirmSend} className="gap-2"><Send className="w-4 h-4" />Send Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Email</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Date</label>
              <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-muted border-0" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Time</label>
              <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-muted border-0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
            <Button onClick={confirmSchedule} className="gap-2"><Calendar className="w-4 h-4" />Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
