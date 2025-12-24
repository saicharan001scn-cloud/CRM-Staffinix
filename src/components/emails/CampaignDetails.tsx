import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft,
  Eye,
  MousePointer,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';

interface CampaignDetailsProps {
  campaign: {
    id: string;
    name: string;
    status: string;
    sent: number;
    total: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
    startedAt: string;
  };
  onBack: () => void;
}

const recipientDetails = [
  { id: '1', name: 'John Smith', email: 'john.smith@email.com', status: 'opened', openedAt: '10:15 AM', clicked: true, replied: true },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@email.com', status: 'opened', openedAt: '10:22 AM', clicked: true, replied: false },
  { id: '3', name: 'Mike Chen', email: 'mike.chen@email.com', status: 'opened', openedAt: '11:05 AM', clicked: false, replied: false },
  { id: '4', name: 'Emily Davis', email: 'emily.d@email.com', status: 'delivered', openedAt: null, clicked: false, replied: false },
  { id: '5', name: 'Alex Wilson', email: 'alex.w@email.com', status: 'opened', openedAt: '2:30 PM', clicked: true, replied: true },
  { id: '6', name: 'Lisa Brown', email: 'lisa.brown@email.com', status: 'bounced', openedAt: null, clicked: false, replied: false },
  { id: '7', name: 'David Lee', email: 'david.lee@email.com', status: 'delivered', openedAt: null, clicked: false, replied: false },
];

export function CampaignDetails({ campaign, onBack }: CampaignDetailsProps) {
  const [filter, setFilter] = useState<'all' | 'opened' | 'clicked' | 'replied' | 'bounced'>('all');

  const filteredRecipients = recipientDetails.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'opened') return r.status === 'opened';
    if (filter === 'clicked') return r.clicked;
    if (filter === 'replied') return r.replied;
    if (filter === 'bounced') return r.status === 'bounced';
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'opened':
        return <Eye className="w-4 h-4 text-success" />;
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'bounced':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Mail className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sending':
        return <Badge className="bg-primary/20 text-primary border-0">Sending</Badge>;
      case 'completed':
        return <Badge className="bg-success/20 text-success border-0">Completed</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-warning/20 text-warning border-0">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openedCount = recipientDetails.filter(r => r.status === 'opened').length;
  const clickedCount = recipientDetails.filter(r => r.clicked).length;
  const repliedCount = recipientDetails.filter(r => r.replied).length;
  const bouncedCount = recipientDetails.filter(r => r.status === 'bounced').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Campaign Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" />
            Started: {campaign.startedAt}
          </p>
        </div>
        {getStatusBadge(campaign.status)}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Send className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{campaign.sent}</p>
          <p className="text-sm text-muted-foreground">Sent</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">{campaign.sent - bouncedCount}</p>
          <p className="text-sm text-muted-foreground">Delivered</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">{campaign.openRate}%</p>
          <p className="text-sm text-muted-foreground">Opened ({openedCount})</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl font-bold text-foreground">{campaign.replyRate}%</p>
          <p className="text-sm text-muted-foreground">Replied ({repliedCount})</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-2xl font-bold text-foreground">{bouncedCount}</p>
          <p className="text-sm text-muted-foreground">Bounced</p>
        </Card>
      </div>

      {/* Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Campaign Progress</span>
          <span className="font-medium text-foreground">{campaign.sent}/{campaign.total} sent</span>
        </div>
        <Progress value={(campaign.sent / campaign.total) * 100} className="h-2" />
      </Card>

      {/* Recipients Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recipients</h3>
          <div className="flex items-center gap-2">
            {(['all', 'opened', 'clicked', 'replied', 'bounced'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
                {f !== 'all' && (
                  <Badge variant="secondary" className="ml-1 px-1.5">
                    {f === 'opened' ? openedCount : f === 'clicked' ? clickedCount : f === 'replied' ? repliedCount : bouncedCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredRecipients.map((recipient) => (
              <div
                key={recipient.id}
                className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{recipient.name}</p>
                    <p className="text-sm text-muted-foreground">{recipient.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(recipient.status)}
                    <span className="text-sm text-muted-foreground capitalize">{recipient.status}</span>
                    {recipient.openedAt && (
                      <span className="text-sm text-muted-foreground">at {recipient.openedAt}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {recipient.clicked && (
                      <Badge className="bg-primary/20 text-primary border-0 gap-1">
                        <MousePointer className="w-3 h-3" />
                        Clicked
                      </Badge>
                    )}
                    {recipient.replied && (
                      <Badge className="bg-success/20 text-success border-0 gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Replied
                      </Badge>
                    )}
                    {recipient.status === 'bounced' && (
                      <Badge className="bg-destructive/20 text-destructive border-0 gap-1">
                        <XCircle className="w-3 h-3" />
                        Bounced
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
