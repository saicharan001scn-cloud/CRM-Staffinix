import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  FileCheck,
  Calendar,
  Building2,
  Clock,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface FollowUpQueueProps {
  onBack: () => void;
}

const submissionFollowUps = [
  { id: '1', candidate: 'John Smith', client: 'Google', job: 'Senior Java Developer', submittedDate: '2 days ago', status: 'pending', priority: 'high' },
  { id: '2', candidate: 'Sarah Johnson', client: 'Microsoft', job: 'React Frontend Developer', submittedDate: '3 days ago', status: 'pending', priority: 'medium' },
  { id: '3', candidate: 'Mike Chen', client: 'Amazon', job: 'Full Stack Engineer', submittedDate: '5 days ago', status: 'pending', priority: 'low' },
];

const interviewFollowUps = [
  { id: '4', candidate: 'Emily Davis', client: 'Apple', job: 'DevOps Engineer', interviewDate: 'Yesterday', round: '2nd Round', status: 'pending', priority: 'high' },
  { id: '5', candidate: 'Alex Wilson', client: 'Meta', job: 'Python Developer', interviewDate: '2 days ago', round: '1st Round', status: 'pending', priority: 'medium' },
];

const vendorFollowUps = [
  { id: '6', vendor: 'TechRecruit Partners', requirement: 'Java Developer - NYC', sentDate: '1 day ago', status: 'pending' },
  { id: '7', vendor: 'Staffing Solutions Inc', requirement: 'React Developer - Remote', sentDate: '3 days ago', status: 'pending' },
  { id: '8', vendor: 'IT Talent Hub', requirement: 'DevOps - Chicago', sentDate: '4 days ago', status: 'pending' },
];

export function FollowUpQueue({ onBack }: FollowUpQueueProps) {
  const [selectedFollowUp, setSelectedFollowUp] = useState<any>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleSendFollowUp = (item: any, type: string) => {
    if (type === 'submission') {
      setEmailSubject(`Follow-up: ${item.candidate} submission for ${item.job}`);
      setEmailBody(`Hi,

I wanted to follow up on the submission of ${item.candidate} for the ${item.job} position at ${item.client}.

Could you please provide an update on the status of this submission? We're keen to move forward if there's interest.

Thank you!

Best regards,
[Your Name]`);
    } else if (type === 'interview') {
      setEmailSubject(`Interview Follow-up: ${item.candidate} - ${item.job}`);
      setEmailBody(`Hi ${item.candidate},

I hope your ${item.round} interview with ${item.client} for the ${item.job} position went well!

I wanted to check in and see how you felt about the interview. Please let me know if you have any questions or concerns.

Best regards,
[Your Name]`);
    } else {
      setEmailSubject(`Follow-up: ${item.requirement}`);
      setEmailBody(`Hi,

I wanted to follow up on my previous email regarding the ${item.requirement} requirement.

Do you have any updates on this position? We have several qualified candidates available.

Looking forward to hearing from you!

Best regards,
[Your Name]`);
    }
    setSelectedFollowUp({ ...item, type });
    setShowSendDialog(true);
  };

  const confirmSend = () => {
    toast.success('Follow-up email sent successfully!');
    setShowSendDialog(false);
    setSelectedFollowUp(null);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-destructive/20 text-destructive border-0">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning/20 text-warning border-0">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            {submissionFollowUps.length + interviewFollowUps.length + vendorFollowUps.length} Pending
          </Badge>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Follow-up Queue</h1>
        <p className="text-muted-foreground">Manage pending follow-up emails by category</p>
      </div>

      <Tabs defaultValue="submissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="submissions" className="gap-2">
            <FileCheck className="w-4 h-4" />
            Submissions ({submissionFollowUps.length})
          </TabsTrigger>
          <TabsTrigger value="interviews" className="gap-2">
            <Calendar className="w-4 h-4" />
            Interviews ({interviewFollowUps.length})
          </TabsTrigger>
          <TabsTrigger value="vendors" className="gap-2">
            <Building2 className="w-4 h-4" />
            Vendor Responses ({vendorFollowUps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <Card className="p-6">
            <div className="space-y-4">
              {submissionFollowUps.map((item) => (
                <div key={item.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.candidate}</p>
                        <p className="text-sm text-muted-foreground">{item.job} at {item.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          Submitted {item.submittedDate}
                        </div>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button size="sm" className="gap-1" onClick={() => handleSendFollowUp(item, 'submission')}>
                          <Send className="w-4 h-4" />
                          Follow Up
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="interviews">
          <Card className="p-6">
            <div className="space-y-4">
              {interviewFollowUps.map((item) => (
                <div key={item.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.candidate}</p>
                        <p className="text-sm text-muted-foreground">{item.job} at {item.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">{item.round}</Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {item.interviewDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button size="sm" className="gap-1" onClick={() => handleSendFollowUp(item, 'interview')}>
                          <Send className="w-4 h-4" />
                          Follow Up
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card className="p-6">
            <div className="space-y-4">
              {vendorFollowUps.map((item) => (
                <div key={item.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.vendor}</p>
                        <p className="text-sm text-muted-foreground">{item.requirement}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          Sent {item.sentDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button size="sm" className="gap-1" onClick={() => handleSendFollowUp(item, 'vendor')}>
                          <Send className="w-4 h-4" />
                          Follow Up
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send Follow-up Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Follow-up Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
              <Input 
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="bg-muted border-0"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Message</label>
              <Textarea 
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="min-h-[200px] bg-muted border-0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendDialog(false)}>Cancel</Button>
            <Button onClick={confirmSend} className="gap-2">
              <Send className="w-4 h-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
