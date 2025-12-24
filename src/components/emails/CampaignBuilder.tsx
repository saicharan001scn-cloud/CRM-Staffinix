import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft,
  ArrowRight,
  Mail, 
  Users,
  FileText,
  Type,
  Image,
  Briefcase,
  FileCheck,
  DollarSign,
  Calendar,
  Phone,
  Link,
  Sparkles,
  Eye,
  Send,
  Clock,
  Search,
  CheckCircle2,
  GripVertical,
  X,
  Zap,
  MousePointer
} from 'lucide-react';
import { toast } from 'sonner';

interface CampaignBuilderProps {
  onBack: () => void;
}

const templates = [
  { id: '1', name: 'Cold Candidate Outreach', description: 'Sourcing new candidates', icon: Users, color: 'primary' },
  { id: '2', name: 'Submission Follow-up', description: 'After submitting candidate', icon: FileCheck, color: 'success' },
  { id: '3', name: 'Interview Preparation', description: 'Before interviews', icon: Calendar, color: 'warning' },
  { id: '4', name: 'Rate Negotiation', description: 'During offer stage', icon: DollarSign, color: 'primary' },
  { id: '5', name: 'Placement Announcement', description: 'Celebrating success', icon: CheckCircle2, color: 'success' },
  { id: '6', name: 'Referral Request', description: 'Asking for referrals', icon: Users, color: 'warning' },
  { id: '7', name: 'Market Update', description: 'Industry insights', icon: Briefcase, color: 'primary' },
];

const emailComponents = [
  { id: 'text', name: 'Text Block', icon: Type },
  { id: 'image', name: 'Image/Logo', icon: Image },
  { id: 'job', name: 'Job Description', icon: Briefcase },
  { id: 'resume', name: 'Resume Preview', icon: FileText },
  { id: 'rate', name: 'Rate/Salary Table', icon: DollarSign },
  { id: 'scheduler', name: 'Interview Scheduler', icon: Calendar },
  { id: 'cta', name: 'Call-to-Action Button', icon: Phone },
  { id: 'social', name: 'Social Links', icon: Link },
];

const mockCandidates = [
  { id: '1', name: 'John Smith', skill: 'Java Developer', location: 'New York, NY', visa: 'US Citizen', available: true },
  { id: '2', name: 'Sarah Johnson', skill: 'React Developer', location: 'San Francisco, CA', visa: 'Green Card', available: true },
  { id: '3', name: 'Mike Chen', skill: 'Full Stack Developer', location: 'Austin, TX', visa: 'H1B', available: true },
  { id: '4', name: 'Emily Davis', skill: 'Java Developer', location: 'Seattle, WA', visa: 'US Citizen', available: false },
  { id: '5', name: 'Alex Wilson', skill: 'React Developer', location: 'Chicago, IL', visa: 'US Citizen', available: true },
  { id: '6', name: 'Lisa Brown', skill: 'DevOps Engineer', location: 'Denver, CO', visa: 'Green Card', available: true },
  { id: '7', name: 'David Lee', skill: 'Java Developer', location: 'Boston, MA', visa: 'US Citizen', available: true },
  { id: '8', name: 'Jennifer Taylor', skill: 'Python Developer', location: 'Portland, OR', visa: 'H1B', available: true },
];

const personalizationTokens = [
  '{{candidate.name}}',
  '{{candidate.skill}}',
  '{{job.title}}',
  '{{job.client}}',
  '{{job.rate}}',
  '{{job.location}}',
  '{{recruiter.name}}',
  '{{recruiter.phone}}',
];

export function CampaignBuilder({ onBack }: CampaignBuilderProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [subject, setSubject] = useState('{{candidate.name}}, {{candidate.skill}} opportunities at {{job.client}}');
  const [emailContent, setEmailContent] = useState(`Hi {{candidate.name}},

I came across your profile and was impressed by your experience as a {{candidate.skill}}. I have an exciting opportunity that I think would be a great fit for you.

Position: {{job.title}}
Client: {{job.client}}
Rate: {{job.rate}}
Location: {{job.location}}

This is a great opportunity to work with a leading technology company on cutting-edge projects.

Would you be interested in learning more? Please reply to this email or give me a call at {{recruiter.phone}}.

Best regards,
{{recruiter.name}}`);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduleType, setScheduleType] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const [filters, setFilters] = useState({
    javaDevs: false,
    reactDevs: false,
    usCitizens: false,
    available: false,
  });

  const filteredCandidates = mockCandidates.filter(candidate => {
    if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !candidate.skill.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.javaDevs && !candidate.skill.includes('Java')) return false;
    if (filters.reactDevs && !candidate.skill.includes('React')) return false;
    if (filters.usCitizens && candidate.visa !== 'US Citizen') return false;
    if (filters.available && !candidate.available) return false;
    return true;
  });

  const toggleRecipient = (id: string) => {
    if (selectedRecipients.includes(id)) {
      setSelectedRecipients(selectedRecipients.filter(r => r !== id));
    } else if (selectedRecipients.length < 50) {
      setSelectedRecipients([...selectedRecipients, id]);
    } else {
      toast.error('Maximum 50 recipients per campaign');
    }
  };

  const handleSendCampaign = () => {
    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }
    toast.success(`Campaign ${scheduleType === 'now' ? 'sent' : 'scheduled'} successfully!`);
    onBack();
  };

  const insertToken = (token: string) => {
    setEmailContent(prev => prev + ' ' + token);
  };

  return (
    <div className="space-y-6">
      {/* Header with Steps */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s 
                  ? 'bg-primary text-primary-foreground' 
                  : step > s 
                    ? 'bg-success text-success-foreground' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm ${step === s ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {s === 1 ? 'Select Template' : s === 2 ? 'Design Email' : 'Select Recipients'}
              </span>
              {s < 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>
        
        <div className="w-32" /> {/* Spacer for alignment */}
      </div>

      {/* Step 1: Select Template */}
      {step === 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Choose a Template</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTemplate === template.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    template.color === 'primary' ? 'bg-primary/10' : 
                    template.color === 'success' ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      template.color === 'primary' ? 'text-primary' : 
                      template.color === 'success' ? 'text-success' : 'text-warning'
                    }`} />
                  </div>
                  <p className="font-medium text-foreground">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setSelectedTemplate(null)} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Start from Scratch
            </Button>
            <div className="flex-1" />
            <Button 
              onClick={() => setStep(2)} 
              className="gap-2"
            >
              Next: Design Email
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Design Email */}
      {step === 2 && (
        <div className="grid grid-cols-4 gap-6">
          {/* Left Panel - Components */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Components</h3>
            <div className="space-y-2">
              {emailComponents.map((component) => {
                const Icon = component.icon;
                return (
                  <div
                    key={component.id}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-grab hover:bg-muted transition-colors"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{component.name}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-3 text-sm">Personalization Tokens</h4>
              <div className="flex flex-wrap gap-2">
                {personalizationTokens.map((token) => (
                  <button
                    key={token}
                    onClick={() => insertToken(token)}
                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Center - Email Editor */}
          <div className="col-span-2">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Subject Line</label>
                  <Input 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-muted border-0"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email Content</label>
                  <Textarea 
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="min-h-[400px] bg-muted border-0 font-mono text-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Improve
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Settings */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Personalization</span>
                <Badge className="bg-success/20 text-success border-0">ON</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Open Tracking</span>
                <Badge className="bg-success/20 text-success border-0">ON</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Click Tracking</span>
                <Badge className="bg-success/20 text-success border-0">ON</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Reply Tracking</span>
                <Badge className="bg-success/20 text-success border-0">ON</Badge>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-3 text-sm">Compliance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Unsubscribe link added</span>
                </div>
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Physical address included</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border flex flex-col gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="w-full gap-2">
                Next: Recipients
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Step 3: Select Recipients */}
      {step === 3 && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left - Recipient List */}
          <div className="col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, skill, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted border-0"
                  />
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  {selectedRecipients.length}/50 Selected
                </Badge>
              </div>
              
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Filters:</span>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox 
                    checked={filters.javaDevs}
                    onCheckedChange={(checked) => setFilters({...filters, javaDevs: checked as boolean})}
                  />
                  Java Developers
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox 
                    checked={filters.reactDevs}
                    onCheckedChange={(checked) => setFilters({...filters, reactDevs: checked as boolean})}
                  />
                  React Frontend
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox 
                    checked={filters.usCitizens}
                    onCheckedChange={(checked) => setFilters({...filters, usCitizens: checked as boolean})}
                  />
                  US Citizens Only
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox 
                    checked={filters.available}
                    onCheckedChange={(checked) => setFilters({...filters, available: checked as boolean})}
                  />
                  Available Immediately
                </label>
              </div>
              
              {/* Candidate List */}
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => toggleRecipient(candidate.id)}
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedRecipients.includes(candidate.id) 
                          ? 'bg-primary/10 border-2 border-primary' 
                          : 'bg-muted/50 border-2 border-transparent hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox 
                          checked={selectedRecipients.includes(candidate.id)}
                          onCheckedChange={() => toggleRecipient(candidate.id)}
                        />
                        <div>
                          <p className="font-medium text-foreground">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.skill} • {candidate.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{candidate.visa}</Badge>
                        {candidate.available && (
                          <Badge className="bg-success/20 text-success border-0">Available</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Right - Schedule & Send */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Schedule</h3>
              
              <div className="space-y-3">
                <label 
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                    scheduleType === 'now' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setScheduleType('now')}
                >
                  <Send className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Send Now</p>
                    <p className="text-sm text-muted-foreground">Start campaign immediately</p>
                  </div>
                </label>
                
                <label 
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                    scheduleType === 'schedule' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setScheduleType('schedule')}
                >
                  <Clock className="w-5 h-5 text-warning" />
                  <div>
                    <p className="font-medium text-foreground">Schedule</p>
                    <p className="text-sm text-muted-foreground">Set date and time</p>
                  </div>
                </label>
                
                {scheduleType === 'schedule' && (
                  <div className="space-y-3 pt-3">
                    <Input 
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="bg-muted border-0"
                    />
                    <Input 
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="bg-muted border-0"
                    />
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Recipients</span>
                  <span className="font-medium text-foreground">{selectedRecipients.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Template</span>
                  <span className="font-medium text-foreground">
                    {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'Custom'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tracking</span>
                  <span className="font-medium text-success">Enabled</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border flex flex-col gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="w-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Design
                </Button>
                <Button 
                  onClick={handleSendCampaign} 
                  className="w-full gap-2"
                  disabled={selectedRecipients.length === 0}
                >
                  {scheduleType === 'now' ? (
                    <>
                      <Send className="w-4 h-4" />
                      Send Campaign
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      Schedule Campaign
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
