import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, ArrowLeft, Sparkles, FileText } from 'lucide-react';
import { mockOriginalResume, mockTailoredResume } from '@/data/mockJobMatches';

interface TailorResumeModalProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  consultantName: string;
  jobTitle: string;
}

export function TailorResumeModal({ 
  open, 
  onClose, 
  onApprove, 
  consultantName, 
  jobTitle 
}: TailorResumeModalProps) {
  const renderTailoredContent = (content: string) => {
    // Convert **text** to highlighted spans
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const text = part.slice(2, -2);
        return (
          <span 
            key={index} 
            className="text-primary font-semibold bg-primary/10 px-1 rounded"
          >
            {text}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                AI Resume Tailoring
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tailoring resume for <span className="text-foreground font-medium">{consultantName}</span> → <span className="text-primary font-medium">{jobTitle}</span>
              </p>
            </div>
            <Badge className="bg-primary/20 text-primary border border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0 py-4">
          {/* Original Resume */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Original Resume</h3>
            </div>
            <ScrollArea className="flex-1 rounded-lg border border-border bg-muted/30">
              <pre className="p-4 text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {mockOriginalResume}
              </pre>
            </ScrollArea>
          </div>

          {/* Tailored Resume */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">AI Tailored Resume</h3>
              <Badge variant="secondary" className="text-xs">Optimized for Job</Badge>
            </div>
            <ScrollArea className="flex-1 rounded-lg border border-primary/30 bg-primary/5">
              <pre className="p-4 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {renderTailoredContent(mockTailoredResume)}
              </pre>
            </ScrollArea>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI has highlighted <span className="text-primary font-medium">12 enhancements</span> based on job requirements</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Matches
            </Button>
            <Button onClick={onApprove} className="gap-2 bg-success hover:bg-success/90">
              <CheckCircle className="w-4 h-4" />
              Approve Tailored Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
