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
  RefreshCw
} from 'lucide-react';

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

export default function Emails() {
  return (
    <MainLayout
      title="Email Automation"
      subtitle="AI-powered email campaigns and automation"
      action={{ label: 'New Campaign', onClick: () => {} }}
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
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Compose Email
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">To</label>
                <Input placeholder="Select vendors or paste email addresses..." className="bg-muted border-0" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
                <Input placeholder="Email subject line..." className="bg-muted border-0" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Message</label>
                <Textarea 
                  placeholder="Write your message or use AI to generate..." 
                  className="min-h-[200px] bg-muted border-0"
                />
              </div>
              
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
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Schedule</Button>
                  <Button size="sm" className="gap-2">
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
        </div>
      </div>
    </MainLayout>
  );
}
