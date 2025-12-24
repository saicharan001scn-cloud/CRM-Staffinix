import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Eye,
  MousePointer,
  MessageSquare,
  Send,
  TrendingUp,
  TrendingDown,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  Phone,
  ExternalLink,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmailAnalyticsProps {
  onBack: () => void;
}

const performanceData = [
  { month: 'Jan', sent: 450, opened: 315, clicked: 180, replied: 90 },
  { month: 'Feb', sent: 520, opened: 390, clicked: 210, replied: 105 },
  { month: 'Mar', sent: 480, opened: 355, clicked: 195, replied: 95 },
  { month: 'Apr', sent: 550, opened: 420, clicked: 245, replied: 125 },
  { month: 'May', sent: 620, opened: 485, clicked: 290, replied: 155 },
  { month: 'Jun', sent: 580, opened: 450, clicked: 275, replied: 140 },
];

const campaignPerformance = [
  { name: 'Java Sourcing', sent: 50, opened: 39, clicked: 22, replied: 14 },
  { name: 'Client Updates', sent: 50, opened: 42, clicked: 31, replied: 18 },
  { name: 'Vendor Outreach', sent: 45, opened: 32, clicked: 18, replied: 8 },
  { name: 'React Candidates', sent: 35, opened: 28, clicked: 15, replied: 10 },
];

const heatmapData = [
  { element: 'Subject Line', clicks: 145 },
  { element: 'Job Details Section', clicks: 98 },
  { element: 'Apply Button', clicks: 72 },
  { element: 'Rate Information', clicks: 56 },
  { element: 'Recruiter Contact', clicks: 34 },
];

const recipientJourney = [
  { 
    id: '1',
    name: 'John Smith', 
    email: 'john.smith@email.com',
    events: [
      { type: 'sent', time: 'Dec 24, 10:00 AM', device: null },
      { type: 'opened', time: 'Dec 24, 10:15 AM', device: 'Mobile' },
      { type: 'clicked', time: 'Dec 24, 2:31 PM', device: 'Desktop' },
      { type: 'replied', time: 'Dec 24, 2:45 PM', device: 'Desktop' },
    ],
    status: 'Call Scheduled'
  },
  { 
    id: '2',
    name: 'Sarah Johnson', 
    email: 'sarah.j@email.com',
    events: [
      { type: 'sent', time: 'Dec 24, 10:00 AM', device: null },
      { type: 'opened', time: 'Dec 24, 10:05 AM', device: 'Desktop' },
      { type: 'clicked', time: 'Dec 24, 10:08 AM', device: 'Desktop' },
    ],
    status: 'Applied'
  },
  { 
    id: '3',
    name: 'Mike Chen', 
    email: 'mike.chen@email.com',
    events: [
      { type: 'sent', time: 'Dec 24, 10:00 AM', device: null },
      { type: 'opened', time: 'Dec 24, 11:30 AM', device: 'Mobile' },
    ],
    status: 'Forwarded to Friend'
  },
];

const statusColors = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

export function EmailAnalytics({ onBack }: EmailAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          {['7d', '30d', '3m', '6m', '1y'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Send className="w-5 h-5 text-primary" />
            <Badge className="bg-success/20 text-success border-0 gap-1">
              <TrendingUp className="w-3 h-3" />
              12%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">3,200</p>
          <p className="text-sm text-muted-foreground">Emails Sent</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-success" />
            <Badge className="bg-success/20 text-success border-0 gap-1">
              <TrendingUp className="w-3 h-3" />
              8%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">78%</p>
          <p className="text-sm text-muted-foreground">Open Rate</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <MousePointer className="w-5 h-5 text-primary" />
            <Badge className="bg-success/20 text-success border-0 gap-1">
              <TrendingUp className="w-3 h-3" />
              5%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">45%</p>
          <p className="text-sm text-muted-foreground">Click Rate</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-5 h-5 text-warning" />
            <Badge className="bg-destructive/20 text-destructive border-0 gap-1">
              <TrendingDown className="w-3 h-3" />
              2%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">28%</p>
          <p className="text-sm text-muted-foreground">Reply Rate</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Performance Trend */}
        <Card className="col-span-2 p-6">
          <h3 className="font-semibold text-foreground mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="sent" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
              <Line type="monotone" dataKey="opened" stroke="hsl(var(--success))" strokeWidth={2} dot={{ fill: 'hsl(var(--success))' }} />
              <Line type="monotone" dataKey="clicked" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ fill: 'hsl(var(--warning))' }} />
              <Line type="monotone" dataKey="replied" stroke="hsl(212 95% 68%)" strokeWidth={2} dot={{ fill: 'hsl(212 95% 68%)' }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Sent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Opened</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">Clicked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(212 95% 68%)' }} />
              <span className="text-sm text-muted-foreground">Replied</span>
            </div>
          </div>
        </Card>

        {/* Heat Map */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Click Heat Map</h3>
          <div className="space-y-3">
            {heatmapData.map((item, index) => (
              <div key={item.element}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground">{item.element}</span>
                  <span className="font-medium text-foreground">{item.clicks}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-warning to-destructive rounded-full"
                    style={{ width: `${(item.clicks / 145) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Campaign Performance */}
        <Card className="col-span-2 p-6">
          <h3 className="font-semibold text-foreground mb-4">Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={campaignPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="sent" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              <Bar dataKey="opened" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} />
              <Bar dataKey="replied" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recipient Journey */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Individual Tracking</h3>
          <ScrollArea className="h-[250px]">
            <div className="space-y-4">
              {recipientJourney.map((recipient) => (
                <div key={recipient.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">{recipient.email}</p>
                      </div>
                    </div>
                    <Badge className="bg-success/20 text-success border-0 text-xs">
                      {recipient.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 pl-10">
                    {recipient.events.map((event, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {event.type === 'sent' && <Send className="w-3 h-3 text-primary" />}
                        {event.type === 'opened' && <Eye className="w-3 h-3 text-success" />}
                        {event.type === 'clicked' && <MousePointer className="w-3 h-3 text-warning" />}
                        {event.type === 'replied' && <MessageSquare className="w-3 h-3 text-primary" />}
                        <span className="text-muted-foreground">{event.time}</span>
                        {event.device && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {event.device}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
