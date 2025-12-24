import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles,
  FileText,
  Users,
  Calendar,
  Briefcase,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AIEmailGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (subject: string, body: string) => void;
}

const emailTypes = [
  { id: 'hotlist', name: 'Hotlist', description: 'Share available consultants', icon: Users },
  { id: 'followup', name: 'Follow-up', description: 'Check on submissions', icon: FileText },
  { id: 'interview', name: 'Interview', description: 'Schedule or confirm', icon: Calendar },
  { id: 'jobintro', name: 'Job Introduction', description: 'Introduce new opportunity', icon: Briefcase },
];

const tones = [
  { id: 'professional', name: 'Professional', description: 'Formal and business-like' },
  { id: 'direct', name: 'Direct', description: 'Straight to the point' },
  { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
];

const generatedEmails: Record<string, Record<string, { subject: string; body: string }>> = {
  hotlist: {
    professional: {
      subject: 'Available IT Consultants - {{ConsultantName}} Skills',
      body: `Dear {{RecipientName}},

I hope this email finds you well. I am reaching out to share our current roster of highly qualified IT consultants who are immediately available for new opportunities.

Our consultants possess extensive experience in various technologies and have successfully delivered projects for Fortune 500 companies.

Please find below our available resources:
{{ConsultantList}}

I would be happy to provide detailed profiles and discuss how our consultants can contribute to your projects. Please let me know a convenient time for a brief call.

Best regards,
{{RecruiterName}}
{{CompanyName}}`
    },
    direct: {
      subject: 'Hot Candidates Available Now - {{Skill}}',
      body: `Hi {{RecipientName}},

Quick update - we have these consultants available immediately:

{{ConsultantList}}

All are ready to start within 1-2 weeks. Let me know if any match your current needs.

{{RecruiterName}}
{{Phone}}`
    },
    friendly: {
      subject: 'Great Talent Alert! 🌟 Available {{Skill}} Consultants',
      body: `Hey {{RecipientName}}!

Hope you're having a great day! I wanted to share some awesome consultants we have on our bench right now:

{{ConsultantList}}

These folks are super talented and looking for their next adventure. I think they could be a great fit for what you're working on!

Let's chat if any of them catch your eye!

Cheers,
{{RecruiterName}}`
    }
  },
  followup: {
    professional: {
      subject: 'Follow-up: {{CandidateName}} - {{JobTitle}} Application',
      body: `Dear {{RecipientName}},

I am writing to follow up on the submission of {{CandidateName}} for the {{JobTitle}} position at {{ClientName}}, submitted on {{SubmissionDate}}.

We remain confident that {{CandidateName}} would be an excellent fit for this role and would appreciate any update you could provide regarding the status of this application.

Please let me know if you require any additional information or documentation.

Thank you for your time and consideration.

Best regards,
{{RecruiterName}}`
    },
    direct: {
      subject: 'Update Request: {{CandidateName}} for {{JobTitle}}',
      body: `Hi {{RecipientName}},

Following up on {{CandidateName}}'s submission for {{JobTitle}} at {{ClientName}}.

Any updates? The candidate is still available and interested.

Thanks,
{{RecruiterName}}`
    },
    friendly: {
      subject: 'Quick Check-in on {{CandidateName}} 👋',
      body: `Hey {{RecipientName}}!

Just checking in on how things are going with {{CandidateName}}'s application for the {{JobTitle}} role!

I know you're probably super busy, but wanted to see if there's any news. {{CandidateName}} is really excited about this opportunity!

Let me know when you have a moment!

Thanks so much,
{{RecruiterName}}`
    }
  },
  interview: {
    professional: {
      subject: 'Interview Confirmation: {{JobTitle}} at {{ClientName}}',
      body: `Dear {{CandidateName}},

I am pleased to confirm your interview for the {{JobTitle}} position at {{ClientName}}.

Interview Details:
- Date: {{InterviewDate}}
- Time: {{InterviewTime}}
- Format: {{InterviewFormat}}
- Duration: {{Duration}}

Please ensure you have a stable internet connection and a quiet environment for the interview. I will send you preparation materials separately.

Please confirm your availability by replying to this email.

Best regards,
{{RecruiterName}}`
    },
    direct: {
      subject: 'Interview Scheduled: {{JobTitle}} - {{InterviewDate}}',
      body: `Hi {{CandidateName}},

Your interview is confirmed:

Position: {{JobTitle}}
Company: {{ClientName}}
Date/Time: {{InterviewDate}} at {{InterviewTime}}
Format: {{InterviewFormat}}

Prep guide to follow. Please confirm you can make it.

{{RecruiterName}}`
    },
    friendly: {
      subject: 'Exciting News! Your Interview with {{ClientName}} 🎉',
      body: `Hey {{CandidateName}}!

Great news - your interview is all set!

Here are the details:
📅 Date: {{InterviewDate}}
⏰ Time: {{InterviewTime}}
💻 Format: {{InterviewFormat}}

I'm so excited for you! This is a fantastic opportunity and I know you're going to do great.

I'll send over some prep tips soon. Let me know if you have any questions!

You've got this! 💪
{{RecruiterName}}`
    }
  },
  jobintro: {
    professional: {
      subject: 'Opportunity: {{JobTitle}} at {{ClientName}}',
      body: `Dear {{CandidateName}},

I am reaching out regarding an exciting opportunity that aligns well with your professional background and expertise.

Position: {{JobTitle}}
Client: {{ClientName}}
Location: {{Location}}
Rate: {{Rate}}
Duration: {{Duration}}

This role would involve:
{{JobDescription}}

Given your experience in {{Skill}}, I believe you would be an excellent candidate for this position.

Would you be interested in discussing this opportunity further? Please let me know your availability for a brief call.

Best regards,
{{RecruiterName}}`
    },
    direct: {
      subject: '{{JobTitle}} Role - {{Rate}} - {{Location}}',
      body: `Hi {{CandidateName}},

New opportunity that fits your profile:

Role: {{JobTitle}}
Client: {{ClientName}}
Rate: {{Rate}}
Location: {{Location}}

Interested? Reply with your updated resume and best time to talk.

{{RecruiterName}}`
    },
    friendly: {
      subject: 'Found Something Perfect for You! {{JobTitle}} 🚀',
      body: `Hey {{CandidateName}}!

I just came across a role that made me think of you immediately!

Check this out:
✨ Position: {{JobTitle}}
🏢 Company: {{ClientName}}
📍 Location: {{Location}}
💰 Rate: {{Rate}}

This seems like it could be an amazing fit for your skills! The team is great and the work sounds really interesting.

Want to hear more? Let me know and we can chat!

Excited to share this with you,
{{RecruiterName}}`
    }
  }
};

export function AIEmailGenerator({ open, onOpenChange, onGenerate }: AIEmailGeneratorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!selectedType || !selectedTone) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const content = generatedEmails[selectedType]?.[selectedTone];
      if (content) {
        setGeneratedContent(content);
      }
      setIsGenerating(false);
    }, 1500);
  };

  const handleUseEmail = () => {
    if (generatedContent) {
      onGenerate(generatedContent.subject, generatedContent.body);
      onOpenChange(false);
      resetState();
      toast.success('Email content applied!');
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(`Subject: ${generatedContent.subject}\n\n${generatedContent.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard!');
    }
  };

  const resetState = () => {
    setSelectedType(null);
    setSelectedTone(null);
    setGeneratedContent(null);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetState(); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Email Generator
          </DialogTitle>
        </DialogHeader>

        {!generatedContent ? (
          <div className="space-y-6 py-4">
            {/* Email Type Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Select Email Type</label>
              <div className="grid grid-cols-4 gap-3">
                {emailTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedType === type.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${selectedType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="font-medium text-foreground text-sm">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Select Tone</label>
              <div className="grid grid-cols-3 gap-3">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTone === tone.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium text-foreground">{tone.name}</p>
                    <p className="text-sm text-muted-foreground">{tone.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{emailTypes.find(t => t.id === selectedType)?.name}</Badge>
              <Badge variant="outline">{tones.find(t => t.id === selectedTone)?.name}</Badge>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Subject</label>
              <div className="p-3 bg-muted rounded-lg mt-1 text-sm">{generatedContent.subject}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Body</label>
              <div className="p-4 bg-muted rounded-lg mt-1 text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                {generatedContent.body}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!generatedContent ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button 
                onClick={handleGenerate} 
                disabled={!selectedType || !selectedTone || isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Email
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setGeneratedContent(null)}>
                Regenerate
              </Button>
              <Button variant="outline" onClick={handleCopy} className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button onClick={handleUseEmail} className="gap-2">
                Use This Email
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
