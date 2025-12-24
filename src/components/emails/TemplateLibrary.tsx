import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Search,
  Users,
  FileCheck,
  Calendar,
  DollarSign,
  CheckCircle2,
  Briefcase,
  Star,
  Eye,
  Copy,
  Edit,
  Trash2,
  Plus,
  Mail
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TemplateLibraryProps {
  onBack: () => void;
  onUseTemplate: () => void;
}

const templates = [
  { 
    id: '1', 
    name: 'Cold Candidate Outreach', 
    description: 'First contact with potential candidates', 
    icon: Users, 
    color: 'primary',
    category: 'Sourcing',
    uses: 234,
    openRate: 45,
    subject: '{{candidate.name}}, exciting {{candidate.skill}} opportunity at {{job.client}}',
    preview: `Hi {{candidate.name}},

I came across your profile and was impressed by your experience as a {{candidate.skill}}. I have an exciting opportunity that I think would be a great fit for you.

Position: {{job.title}}
Client: {{job.client}}
Rate: {{job.rate}}
Location: {{job.location}}

Would you be interested in learning more?

Best regards,
{{recruiter.name}}`
  },
  { 
    id: '2', 
    name: 'Submission Follow-up', 
    description: 'Update after submitting to client', 
    icon: FileCheck, 
    color: 'success',
    category: 'Follow-up',
    uses: 189,
    openRate: 68,
    subject: 'Update on your submission to {{job.client}}',
    preview: `Hi {{candidate.name}},

I wanted to give you an update on your submission to {{job.client}} for the {{job.title}} position.

Your profile has been submitted and we're awaiting feedback from the client. I'll keep you posted on any developments.

In the meantime, please let me know if you have any questions.

Best regards,
{{recruiter.name}}`
  },
  { 
    id: '3', 
    name: 'Interview Preparation', 
    description: 'Pre-interview guidance', 
    icon: Calendar, 
    color: 'warning',
    category: 'Interview',
    uses: 156,
    openRate: 82,
    subject: 'Interview with {{job.client}} - Preparation Guide',
    preview: `Hi {{candidate.name}},

Congratulations on securing an interview with {{job.client}} for the {{job.title}} position!

Here are some tips to help you prepare:
1. Research the company
2. Review the job requirements
3. Prepare questions to ask
4. Test your video/audio setup

Interview Details:
Date: [Interview Date]
Time: [Interview Time]
Format: [Video/Phone/In-person]

Good luck!
{{recruiter.name}}`
  },
  { 
    id: '4', 
    name: 'Rate Negotiation', 
    description: 'Discussing compensation', 
    icon: DollarSign, 
    color: 'primary',
    category: 'Negotiation',
    uses: 98,
    openRate: 72,
    subject: 'Rate discussion for {{job.title}} position',
    preview: `Hi {{candidate.name}},

Great news! {{job.client}} is interested in moving forward with your candidacy for the {{job.title}} position.

They've offered a rate of {{job.rate}}. I wanted to discuss this with you before proceeding.

Please let me know your thoughts and if this aligns with your expectations.

Best regards,
{{recruiter.name}}`
  },
  { 
    id: '5', 
    name: 'Placement Announcement', 
    description: 'Celebrating successful placement', 
    icon: CheckCircle2, 
    color: 'success',
    category: 'Placement',
    uses: 67,
    openRate: 91,
    subject: 'Congratulations on your new position!',
    preview: `Hi {{candidate.name}},

Congratulations! You've been officially placed at {{job.client}} as a {{job.title}}!

Start Date: [Start Date]
Rate: {{job.rate}}
Location: {{job.location}}

We're thrilled to have helped you land this opportunity. Please don't hesitate to reach out if you need anything.

Welcome aboard!
{{recruiter.name}}`
  },
  { 
    id: '6', 
    name: 'Referral Request', 
    description: 'Asking for candidate referrals', 
    icon: Users, 
    color: 'warning',
    category: 'Sourcing',
    uses: 145,
    openRate: 38,
    subject: 'Know any {{candidate.skill}} professionals?',
    preview: `Hi {{candidate.name}},

I hope you're doing well! I wanted to reach out because we have several exciting opportunities for {{candidate.skill}} professionals.

If you know anyone who might be interested, I'd really appreciate a referral. We offer referral bonuses for successful placements!

Feel free to share my contact information or have them reach out directly.

Thanks in advance!
{{recruiter.name}}`
  },
];

export function TemplateLibrary({ onBack, onUseTemplate }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null);

  const categories = ['All', 'Sourcing', 'Follow-up', 'Interview', 'Negotiation', 'Placement'];

  const filteredTemplates = templates.filter(template => {
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && selectedCategory !== 'All' && template.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-0"
          />
        </div>
        <div className="flex items-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category || (category === 'All' && !selectedCategory) ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  template.color === 'primary' ? 'bg-primary/10' : 
                  template.color === 'success' ? 'bg-success/10' : 'bg-warning/10'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    template.color === 'primary' ? 'text-primary' : 
                    template.color === 'success' ? 'text-success' : 'text-warning'
                  }`} />
                </div>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              
              <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
              
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{template.uses} uses</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{template.openRate}% open</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-2"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 gap-2"
                  onClick={onUseTemplate}
                >
                  <Copy className="w-4 h-4" />
                  Use
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {previewTemplate && (
                <>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    previewTemplate.color === 'primary' ? 'bg-primary/10' : 
                    previewTemplate.color === 'success' ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    {(() => {
                      const Icon = previewTemplate.icon;
                      return <Icon className={`w-5 h-5 ${
                        previewTemplate.color === 'primary' ? 'text-primary' : 
                        previewTemplate.color === 'success' ? 'text-success' : 'text-warning'
                      }`} />;
                    })()}
                  </div>
                  {previewTemplate.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {previewTemplate && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject Line</label>
                <div className="p-3 bg-muted rounded-lg mt-1 text-sm font-mono">
                  {previewTemplate.subject}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Body</label>
                <div className="p-4 bg-muted rounded-lg mt-1 text-sm whitespace-pre-wrap font-mono">
                  {previewTemplate.preview}
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Template
                </Button>
                <Button className="gap-2" onClick={onUseTemplate}>
                  <Copy className="w-4 h-4" />
                  Use This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
