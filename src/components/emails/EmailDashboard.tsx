import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EmailDashboardProps {
  onCreateCampaign: () => void;
  onOpenTemplates: () => void;
  onOpenAnalytics: () => void;
}

const activeCampaigns = [
  { 
    id: '1', 
    name: 'Java Developer Sourcing', 
    status: 'sending', 
    sent: 24, 
    total: 50, 
    openRate: 78,
    clickRate: 45,
    replyRate: 28,
    startedAt: '10:00 AM'
  },
  { 
    id: '2', 
    name: 'Client Weekly Updates', 
    status: 'completed', 
    sent: 50, 
    total: 50, 
    openRate: 85,
    clickRate: 62,
    replyRate: 35,
    startedAt: '9:00 AM'
  },
  { 
    id: '3', 
    name: 'Vendor Mass Outreach', 
    status: 'draft', 
    sent: 0, 
    total: 50, 
    openRate: 0,
    clickRate: 0,
    replyRate: 0,
    startedAt: '-'
  },
  { 
    id: '4', 
    name: 'React Frontend Candidates', 
    status: 'scheduled', 
    sent: 0, 
    total: 35, 
    openRate: 0,
    clickRate: 0,
    replyRate: 0,
    startedAt: 'Tomorrow 9:00 AM'
  },
];

export function EmailDashboard({ onCreateCampaign, onOpenTemplates, onOpenAnalytics }: EmailDashboardProps) {
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
      case 'paused':
        return <Badge className="bg-muted text-muted-foreground border-0">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
            <button 
              onClick={onCreateCampaign}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Send to 50 Candidates</p>
                <p className="text-sm text-muted-foreground">Start new campaign</p>
              </div>
            </button>

            <button 
              onClick={onCreateCampaign}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-warning" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Schedule Client Update</p>
                <p className="text-sm text-muted-foreground">23 clients pending</p>
              </div>
            </button>

            <button 
              onClick={onCreateCampaign}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Vendor Mass Email</p>
                <p className="text-sm text-muted-foreground">156 vendors</p>
              </div>
            </button>
          </div>

          {/* Active Campaigns */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Active Campaigns</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {campaign.status === 'sending' && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Send className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                      )}
                      {campaign.status === 'completed' && (
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                      )}
                      {campaign.status === 'draft' && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      {campaign.status === 'scheduled' && (
                        <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-warning" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.status === 'scheduled' ? `Scheduled: ${campaign.startedAt}` : `Started: ${campaign.startedAt}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(campaign.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {campaign.status === 'sending' && (
                            <DropdownMenuItem>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause Campaign
                            </DropdownMenuItem>
                          )}
                          {campaign.status === 'draft' && (
                            <DropdownMenuItem>
                              <Play className="w-4 h-4 mr-2" />
                              Start Campaign
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{campaign.sent}/{campaign.total} sent</span>
                    </div>
                    <Progress value={(campaign.sent / campaign.total) * 100} className="h-2" />
                  </div>
                  
                  {/* Stats */}
                  {campaign.status !== 'draft' && campaign.status !== 'scheduled' && (
                    <div className="flex items-center gap-6 pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Open:</span>
                        <span className="text-sm font-medium text-foreground">{campaign.openRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MousePointer className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click:</span>
                        <span className="text-sm font-medium text-foreground">{campaign.clickRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Reply:</span>
                        <span className="text-sm font-medium text-foreground">{campaign.replyRate}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Stats & Performance */}
        <div className="space-y-6">
          {/* Today's Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Today's Performance</h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Campaigns</span>
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">82 emails sent</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Eye className="w-5 h-5 text-success mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground">78%</p>
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <MousePointer className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground">45%</p>
                  <p className="text-xs text-muted-foreground">Click Rate</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-warning mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground">28%</p>
                  <p className="text-xs text-muted-foreground">Reply Rate</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Top Performers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Performers</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-sm font-bold text-success">1</div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">John Smith</p>
                  <p className="text-xs text-muted-foreground">Opened 3x, Replied ✅</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">2</div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">Sarah Lee</p>
                  <p className="text-xs text-muted-foreground">Opened immediately, Applied</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center text-sm font-bold text-warning">3</div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">Mike Chen</p>
                  <p className="text-xs text-muted-foreground">Forwarded to friend</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Compliance Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Compliance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unsubscribe Link</span>
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Physical Address</span>
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Privacy Policy</span>
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rate Limiting</span>
                <Badge className="bg-success/20 text-success border-0">Active</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
