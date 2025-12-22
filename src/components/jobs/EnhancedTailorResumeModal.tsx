import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, ArrowLeft, Sparkles, FileText, Download, RefreshCw, 
  Target, Zap, Edit2, History, Save, Copy, Send, RotateCcw, 
  FileDown, Clock, ChevronDown, Check
} from 'lucide-react';
import { mockOriginalResume, mockTailoredResume } from '@/data/mockJobMatches';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  wordCount: number;
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
  const [customInstructions, setCustomInstructions] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [versions, setVersions] = useState<ResumeVersion[]>([
    { id: '1', content: mockTailoredResume, createdAt: new Date().toISOString(), type: 'AI Tailored', wordCount: mockTailoredResume.split(/\s+/).length }
  ]);
  const [selectedVersionId, setSelectedVersionId] = useState('1');

  const getWordCount = (text: string) => text.replace(/\*\*/g, '').split(/\s+/).filter(w => w).length;
  const originalWordCount = getWordCount(mockOriginalResume);
  const tailoredWordCount = getWordCount(editedResume);

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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const optionLabels: Record<RegenerationOption, string> = {
      keywords: 'Keyword Optimized',
      ats: 'ATS Optimized',
      experience: 'Experience Highlighted',
      custom: 'Custom Tailored'
    };

    const newContent = editedResume + `\n\n/* ${optionLabels[option]} version generated */`;
    const newVersion: ResumeVersion = {
      id: String(versions.length + 1),
      content: newContent,
      createdAt: new Date().toISOString(),
      type: optionLabels[option],
      wordCount: getWordCount(newContent)
    };
    
    setVersions([newVersion, ...versions]);
    setEditedResume(newContent);
    setSelectedVersionId(newVersion.id);
    setIsRegenerating(false);
    toast.success('Resume regenerated!', { description: `Created ${optionLabels[option]} version.` });
  };

  const handleDownload = (type: 'original' | 'tailored', format: 'pdf' | 'docx' | 'txt') => {
    const content = type === 'original' ? mockOriginalResume : editedResume;
    const filename = `${consultantName.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}_${type === 'tailored' ? 'Tailored_' : ''}${new Date().toISOString().split('T')[0]}.${format}`;
    
    const blob = new Blob([content.replace(/\*\*/g, '')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Downloading ${type} resume as ${format.toUpperCase()}`);
  };

  const handleSaveVersion = (asNew: boolean) => {
    if (asNew) {
      const newVersion: ResumeVersion = {
        id: String(versions.length + 1),
        content: editedResume,
        createdAt: new Date().toISOString(),
        type: 'Manual Edit',
        wordCount: getWordCount(editedResume)
      };
      setVersions([newVersion, ...versions]);
      setSelectedVersionId(newVersion.id);
      toast.success('Saved as new version!');
    } else {
      const updated = versions.map(v => 
        v.id === selectedVersionId 
          ? { ...v, content: editedResume, wordCount: getWordCount(editedResume) } 
          : v
      );
      setVersions(updated);
      toast.success('Version updated!');
    }
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedResume.replace(/\*\*/g, ''));
    toast.success('Resume copied to clipboard!');
  };

  const handleSendToVendor = () => {
    toast.success('Opening email composer...', { description: 'Resume attached to vendor email.' });
  };

  const handleMarkAsSubmitted = () => {
    toast.success('Marked as submitted!', { description: 'Updated submission tracker.' });
    onApprove();
  };

  const restoreVersion = (version: ResumeVersion) => {
    setEditedResume(version.content);
    setSelectedVersionId(version.id);
    toast.success(`Restored to ${version.type}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
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

        {/* Three Column Layout */}
        <div className="flex-1 grid grid-cols-[1fr_1fr_320px] gap-4 p-4 min-h-0 overflow-hidden">
          
          {/* Left Column - Original Resume */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Original Resume</h3>
                <Badge variant="outline" className="text-[10px]">{originalWordCount} words</Badge>
              </div>
            </div>
            <ScrollArea className="flex-1 rounded-lg border border-border bg-muted/30">
              <pre className="p-4 text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {mockOriginalResume}
              </pre>
            </ScrollArea>
          </div>

          {/* Center Column - Tailored Resume */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">AI Tailored Resume</h3>
                <Badge variant="secondary" className="text-[10px]">{tailoredWordCount} words</Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setIsEditing(!isEditing)}>
                  <Edit2 className="w-3 h-3" />
                  {isEditing ? 'Preview' : 'Edit'}
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleCopy}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 rounded-lg border border-primary/30 bg-primary/5">
              {isEditing ? (
                <div className="p-3 h-full">
                  <Textarea
                    value={editedResume}
                    onChange={(e) => setEditedResume(e.target.value)}
                    className="min-h-[calc(100%-40px)] font-mono text-xs bg-background resize-none"
                  />
                </div>
              ) : (
                <pre className="p-4 text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {renderTailoredContent(editedResume)}
                </pre>
              )}
            </ScrollArea>
          </div>

          {/* Right Column - Controls Panel */}
          <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
            
            {/* Download Options */}
            <Card className="p-3 shrink-0">
              <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-primary" />
                Download Options
              </h4>
              
              <div className="space-y-2">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground">Tailored Resume</p>
                  <div className="flex gap-1">
                    <Button variant="default" size="sm" className="flex-1 h-7 text-[10px] gap-1" onClick={() => handleDownload('tailored', 'pdf')}>
                      <FileDown className="w-3 h-3" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1" onClick={() => handleDownload('tailored', 'docx')}>
                      <FileDown className="w-3 h-3" />
                      DOCX
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1" onClick={() => handleDownload('tailored', 'txt')}>
                      <FileDown className="w-3 h-3" />
                      TXT
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground">Original Resume</p>
                  <Button variant="ghost" size="sm" className="w-full h-7 text-[10px] gap-1 justify-start" onClick={() => handleDownload('original', 'pdf')}>
                    <FileDown className="w-3 h-3" />
                    Download Original Format
                  </Button>
                </div>
              </div>
            </Card>

            {/* Regenerate & Version Control */}
            <Card className="p-3 shrink-0">
              <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                Regenerate with AI
              </h4>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1 justify-between" disabled={isRegenerating}>
                    {isRegenerating ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Choose Optimization
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => handleRegenerate('keywords')} className="gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs font-medium">Match Job Keywords</p>
                      <p className="text-[10px] text-muted-foreground">Optimize for job description</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRegenerate('ats')} className="gap-2">
                    <Zap className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-xs font-medium">ATS Optimization</p>
                      <p className="text-[10px] text-muted-foreground">Format for tracking systems</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRegenerate('experience')} className="gap-2">
                    <Sparkles className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-xs font-medium">Highlight Experience</p>
                      <p className="text-[10px] text-muted-foreground">Emphasize achievements</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="mt-3 space-y-2">
                <p className="text-[10px] text-muted-foreground">Custom Instructions</p>
                <Textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Enter custom tailoring instructions..."
                  className="text-xs min-h-[60px] resize-none"
                  rows={2}
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full h-7 text-xs"
                  onClick={() => handleRegenerate('custom')} 
                  disabled={isRegenerating || !customInstructions.trim()}
                >
                  Apply Custom Instructions
                </Button>
              </div>
            </Card>

            {/* Version History */}
            <Card className="p-3 flex-1 min-h-0 flex flex-col">
              <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2 shrink-0">
                <History className="w-3.5 h-3.5 text-primary" />
                Version History ({versions.length})
              </h4>
              
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {versions.map((version, index) => (
                    <div 
                      key={version.id} 
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        selectedVersionId === version.id 
                          ? 'border-primary/50 bg-primary/5' 
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => restoreVersion(version)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-[9px] h-4">{version.type}</Badge>
                          {index === 0 && <Badge className="text-[9px] h-4 bg-success/20 text-success border-success/30">Current</Badge>}
                        </div>
                        {selectedVersionId === version.id && <Check className="w-3 h-3 text-primary" />}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(version.createdAt).toLocaleTimeString()}
                        <span>•</span>
                        <span>{version.wordCount} words</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Save & Actions */}
            <Card className="p-3 shrink-0">
              <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Save className="w-3.5 h-3.5 text-primary" />
                Save & Actions
              </h4>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => handleSaveVersion(false)}>
                    <Save className="w-3 h-3" />
                    Save Current
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => handleSaveVersion(true)}>
                    <RotateCcw className="w-3 h-3" />
                    Save as New
                  </Button>
                </div>
                
                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] gap-1" onClick={handleSendToVendor}>
                  <Send className="w-3 h-3" />
                  Send to Vendor
                </Button>
                
                <Button size="sm" className="w-full h-8 text-xs gap-1 bg-success hover:bg-success/90" onClick={handleMarkAsSubmitted}>
                  <CheckCircle className="w-3 h-3" />
                  Mark as Submitted
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI highlighted <span className="text-primary font-medium">12 enhancements</span></span>
            <span className="mx-2">•</span>
            <span>Changes: <span className="text-success font-medium">+{tailoredWordCount - originalWordCount} words</span></span>
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
