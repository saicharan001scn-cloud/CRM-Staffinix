import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, ArrowLeft, Sparkles, FileText, Download, RefreshCw, 
  Target, Zap, Edit2, History, Save, Copy 
} from 'lucide-react';
import { mockOriginalResume, mockTailoredResume } from '@/data/mockJobMatches';
import { toast } from 'sonner';

interface EnhancedTailorResumeModalProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  consultantName: string;
  jobTitle: string;
}

type RegenerationOption = 'keywords' | 'ats' | 'experience' | 'custom';

interface ResumeVersion {
  id: string;
  content: string;
  createdAt: string;
  type: string;
}

export function EnhancedTailorResumeModal({ 
  open, 
  onClose, 
  onApprove, 
  consultantName, 
  jobTitle 
}: EnhancedTailorResumeModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResume, setEditedResume] = useState(mockTailoredResume);
  const [showRegenerateOptions, setShowRegenerateOptions] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [versions, setVersions] = useState<ResumeVersion[]>([
    { id: '1', content: mockTailoredResume, createdAt: new Date().toISOString(), type: 'AI Tailored' }
  ]);
  const [activeTab, setActiveTab] = useState('compare');

  const renderTailoredContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const text = part.slice(2, -2);
        return (
          <span key={index} className="text-primary font-semibold bg-primary/10 px-1 rounded">
            {text}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleRegenerate = async (option: RegenerationOption) => {
    setIsRegenerating(true);
    // Simulate AI regeneration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const optionLabels: Record<RegenerationOption, string> = {
      keywords: 'Keyword Optimized',
      ats: 'ATS Optimized',
      experience: 'Experience Highlighted',
      custom: 'Custom Tailored'
    };

    const newVersion: ResumeVersion = {
      id: String(versions.length + 1),
      content: editedResume + `\n\n/* ${optionLabels[option]} version generated */`,
      createdAt: new Date().toISOString(),
      type: optionLabels[option]
    };
    
    setVersions([newVersion, ...versions]);
    setIsRegenerating(false);
    setShowRegenerateOptions(false);
    toast.success('Resume regenerated!', { description: `Created ${optionLabels[option]} version.` });
  };

  const handleDownload = (type: 'original' | 'tailored', format: 'pdf' | 'docx') => {
    const content = type === 'original' ? mockOriginalResume : editedResume;
    const filename = `${consultantName.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`;
    
    // Create a simple text download (in real app, this would generate PDF/DOCX)
    const blob = new Blob([content.replace(/\*\*/g, '')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Downloading ${type} resume as ${format.toUpperCase()}`);
  };

  const handleSaveVersion = () => {
    const newVersion: ResumeVersion = {
      id: String(versions.length + 1),
      content: editedResume,
      createdAt: new Date().toISOString(),
      type: 'Manual Edit'
    };
    setVersions([newVersion, ...versions]);
    setIsEditing(false);
    toast.success('Version saved!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedResume.replace(/\*\*/g, ''));
    toast.success('Resume copied to clipboard!');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground">
                AI Resume Tailoring
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Tailoring for <span className="text-foreground font-medium">{consultantName}</span> → <span className="text-primary font-medium">{jobTitle}</span>
              </p>
            </div>
            <Badge className="bg-primary/20 text-primary border border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-fit mb-3">
            <TabsTrigger value="compare" className="text-xs gap-1">
              <FileText className="w-3 h-3" />
              Compare
            </TabsTrigger>
            <TabsTrigger value="regenerate" className="text-xs gap-1">
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs gap-1">
              <History className="w-3 h-3" />
              Versions ({versions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compare" className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            {/* Original Resume */}
            <div className="flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Original Resume</h3>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handleDownload('original', 'pdf')}>
                    <Download className="w-3 h-3" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handleDownload('original', 'docx')}>
                    <Download className="w-3 h-3" />
                    DOCX
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 rounded-lg border border-border bg-muted/30">
                <pre className="p-4 text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {mockOriginalResume}
                </pre>
              </ScrollArea>
            </div>

            {/* Tailored Resume */}
            <div className="flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">AI Tailored Resume</h3>
                  <Badge variant="secondary" className="text-[10px]">Optimized</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setIsEditing(!isEditing)}>
                    <Edit2 className="w-3 h-3" />
                    {isEditing ? 'Preview' : 'Edit'}
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleCopy}>
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handleDownload('tailored', 'pdf')}>
                    <Download className="w-3 h-3" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handleDownload('tailored', 'docx')}>
                    <Download className="w-3 h-3" />
                    DOCX
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 rounded-lg border border-primary/30 bg-primary/5">
                {isEditing ? (
                  <div className="p-2 h-full">
                    <Textarea
                      value={editedResume}
                      onChange={(e) => setEditedResume(e.target.value)}
                      className="min-h-[500px] font-mono text-xs bg-background"
                    />
                    <Button size="sm" className="mt-2 gap-1" onClick={handleSaveVersion}>
                      <Save className="w-3 h-3" />
                      Save Version
                    </Button>
                  </div>
                ) : (
                  <pre className="p-4 text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {renderTailoredContent(editedResume)}
                  </pre>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="regenerate" className="flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                onClick={() => handleRegenerate('keywords')}
                disabled={isRegenerating}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h4 className="font-medium text-foreground">Match Job Keywords</h4>
                </div>
                <p className="text-xs text-muted-foreground">Optimize resume to match job description keywords.</p>
              </button>
              
              <button
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                onClick={() => handleRegenerate('ats')}
                disabled={isRegenerating}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-warning" />
                  <h4 className="font-medium text-foreground">Optimize for ATS</h4>
                </div>
                <p className="text-xs text-muted-foreground">Format for Applicant Tracking Systems.</p>
              </button>
              
              <button
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                onClick={() => handleRegenerate('experience')}
                disabled={isRegenerating}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-success" />
                  <h4 className="font-medium text-foreground">Highlight Experience</h4>
                </div>
                <p className="text-xs text-muted-foreground">Emphasize relevant experience and achievements.</p>
              </button>
              
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Edit2 className="w-5 h-5 text-info" />
                  <h4 className="font-medium text-foreground">Custom Instructions</h4>
                </div>
                <Textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Enter custom tailoring instructions..."
                  className="text-xs mb-2"
                  rows={3}
                />
                <Button size="sm" onClick={() => handleRegenerate('custom')} disabled={isRegenerating || !customInstructions.trim()}>
                  Apply Custom
                </Button>
              </div>
            </div>
            
            {isRegenerating && (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-6 h-6 text-primary animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Regenerating resume...</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <div key={version.id} className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">{version.type}</Badge>
                        {index === 0 && <Badge className="text-[10px] bg-success/20 text-success border-success/30">Current</Badge>}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(version.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => { setEditedResume(version.content); setActiveTab('compare'); }}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => setEditedResume(version.content)}>
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI highlighted <span className="text-primary font-medium">12 enhancements</span></span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} size="sm" className="gap-1">
              <ArrowLeft className="w-3 h-3" />
              Back
            </Button>
            <Button onClick={onApprove} size="sm" className="gap-1 bg-success hover:bg-success/90">
              <CheckCircle className="w-3 h-3" />
              Approve & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}