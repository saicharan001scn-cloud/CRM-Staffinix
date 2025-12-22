import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, Sparkles, FileText, Download, RefreshCw, 
  Target, Zap, Edit2, History, Save, Copy, Send, RotateCcw, 
  FileDown, Clock, ChevronDown, Check, Maximize2, Minimize2,
  Bold, Italic, List, Type, Undo, Redo, Eye, Bot, User,
  Star, GitCompare, ChevronRight
} from 'lucide-react';
import { mockOriginalResume, mockTailoredResume } from '@/data/mockJobMatches';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  editedBy: 'ai' | 'manual';
  changesSummary?: string;
  keywordsAdded?: string[];
  keywordsRemoved?: string[];
}

export function EnhancedTailorResumeModal({ 
  open, 
  onClose, 
  onApprove, 
  consultantName, 
  jobTitle 
}: EnhancedTailorResumeModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editedResume, setEditedResume] = useState(mockTailoredResume);
  const [customInstructions, setCustomInstructions] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'draft'>('saved');
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<string[]>(['1']);
  
  const [versions, setVersions] = useState<ResumeVersion[]>([
    { 
      id: '1', 
      content: mockTailoredResume, 
      createdAt: new Date().toISOString(), 
      type: 'AI Tailored', 
      wordCount: mockTailoredResume.split(/\s+/).length,
      editedBy: 'ai',
      changesSummary: 'Initial AI tailoring for job match',
      keywordsAdded: ['React', 'TypeScript', 'AWS'],
    },
    { 
      id: '0', 
      content: mockOriginalResume, 
      createdAt: new Date(Date.now() - 3600000).toISOString(), 
      type: 'Original', 
      wordCount: mockOriginalResume.split(/\s+/).length,
      editedBy: 'manual',
      changesSummary: 'Original resume uploaded',
    }
  ]);
  const [selectedVersionId, setSelectedVersionId] = useState('1');

  // Auto-save effect
  useEffect(() => {
    if (!isEditing) return;
    
    setAutoSaveStatus('saving');
    const timeout = setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [editedResume, isEditing]);

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
      wordCount: getWordCount(newContent),
      editedBy: 'ai',
      changesSummary: `${optionLabels[option]} - Regenerated with AI`,
      keywordsAdded: ['Node.js', 'Docker'],
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
        wordCount: getWordCount(editedResume),
        editedBy: 'manual',
        changesSummary: 'Manual edits applied',
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

  const toggleVersionExpand = (id: string) => {
    setExpandedVersions(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const selectedVersion = versions.find(v => v.id === selectedVersionId);
  const compareVersion = compareVersionId ? versions.find(v => v.id === compareVersionId) : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`flex flex-col p-0 ${isFullScreen ? 'max-w-[100vw] w-[100vw] h-[100vh] rounded-none' : 'max-w-[95vw] w-[1600px] h-[90vh]'}`}>
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
            <div className="flex items-center gap-2">
              {/* Auto-save indicator */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {autoSaveStatus === 'saving' && (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span>Auto-saved</span>
                  </>
                )}
                {autoSaveStatus === 'draft' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    <span>Draft</span>
                  </>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={!isFullScreen ? "secondary" : "ghost"} 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => setIsFullScreen(false)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Split View</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={isFullScreen ? "secondary" : "ghost"} 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => setIsFullScreen(true)}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Full Edit Mode</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Badge className="bg-primary/20 text-primary border border-primary/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className={`flex-1 grid gap-4 p-4 min-h-0 overflow-hidden ${isFullScreen ? 'grid-cols-[1fr_380px]' : 'grid-cols-[1fr_1fr_340px]'}`}>
          
          {/* Left Column - Original Resume (Hidden in full screen) */}
          {!isFullScreen && (
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
          )}

          {/* Center Column - Tailored Resume (Huge Edit Box) */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {isFullScreen ? 'Resume Editor' : 'AI Tailored Resume'}
                </h3>
                <Badge variant="secondary" className="text-[10px]">{tailoredWordCount} words</Badge>
                {selectedVersion && (
                  <Badge variant="outline" className="text-[10px] gap-1">
                    {selectedVersion.editedBy === 'ai' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    v{selectedVersion.id}
                  </Badge>
                )}
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

            {/* Rich Text Toolbar (when editing) */}
            {isEditing && (
              <div className="flex items-center gap-1 mb-2 p-2 bg-muted rounded-lg shrink-0">
                <TooltipProvider>
                  <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Bold className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Italic className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <List className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]">H1</Button>
                      </TooltipTrigger>
                      <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]">H2</Button>
                      </TooltipTrigger>
                      <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]">H3</Button>
                      </TooltipTrigger>
                      <TooltipContent>Heading 3</TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                          <Type className="w-3.5 h-3.5" />
                          12pt
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {[11, 12, 13, 14, 15, 16].map(size => (
                          <DropdownMenuItem key={size}>{size}pt</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Undo className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Undo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Redo className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

                <div className="ml-auto text-[10px] text-muted-foreground">
                  {tailoredWordCount} words • Spell check enabled
                </div>
              </div>
            )}

            {/* Resume Content Area */}
            <div className={`flex-1 rounded-lg border ${isEditing ? 'border-primary' : 'border-primary/30'} bg-primary/5 overflow-hidden`}>
              {isEditing ? (
                <Textarea
                  value={editedResume}
                  onChange={(e) => setEditedResume(e.target.value)}
                  className={`w-full h-full font-mono text-xs bg-background resize-none border-0 focus-visible:ring-0 ${isFullScreen ? 'min-h-[70vh]' : 'min-h-[600px]'}`}
                  style={{ minHeight: isFullScreen ? '70vh' : '600px' }}
                />
              ) : (
                <ScrollArea className="h-full">
                  <pre className="p-4 text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {renderTailoredContent(editedResume)}
                  </pre>
                </ScrollArea>
              )}
            </div>
          </div>

          {/* Right Column - Controls Panel (Organized) */}
          <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
            
            {/* Section 1: Download Options */}
            <Card className="p-3 shrink-0">
              <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-primary" />
                Download Options
              </h4>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Tailored Resume</p>
                  <div className="flex gap-1">
                    <Button variant="default" size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => handleDownload('tailored', 'pdf')}>
                      <FileDown className="w-3.5 h-3.5" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => handleDownload('tailored', 'docx')}>
                      <FileDown className="w-3.5 h-3.5" />
                      DOCX
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => handleDownload('tailored', 'txt')}>
                      <FileDown className="w-3.5 h-3.5" />
                      TXT
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Original Resume</p>
                  <Button variant="ghost" size="sm" className="w-full h-8 text-xs gap-1 justify-start" onClick={() => handleDownload('original', 'pdf')}>
                    <FileDown className="w-3.5 h-3.5" />
                    Download Original Format
                  </Button>
                </div>
              </div>
            </Card>

            {/* Section 2: Regenerate & Version Control */}
            <Card className="p-3 shrink-0">
              <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                Regenerate with AI
              </h4>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full h-9 text-xs gap-1 justify-between" disabled={isRegenerating}>
                    {isRegenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Choose Optimization
                        </span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuItem onClick={() => handleRegenerate('keywords')} className="gap-2 py-2">
                    <Target className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs font-medium">Match Job Keywords</p>
                      <p className="text-[10px] text-muted-foreground">Optimize for job description</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRegenerate('ats')} className="gap-2 py-2">
                    <Zap className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-xs font-medium">ATS Optimization</p>
                      <p className="text-[10px] text-muted-foreground">Format for tracking systems</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRegenerate('experience')} className="gap-2 py-2">
                    <Sparkles className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-xs font-medium">Highlight Experience</p>
                      <p className="text-[10px] text-muted-foreground">Emphasize achievements</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="mt-3 space-y-2">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Custom Instructions</p>
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
                  className="w-full h-8 text-xs"
                  onClick={() => handleRegenerate('custom')} 
                  disabled={isRegenerating || !customInstructions.trim()}
                >
                  Apply Custom Instructions
                </Button>
              </div>
            </Card>

            {/* Section 3: Version History (Clear Display) */}
            <Card className="p-3 flex-1 min-h-0 flex flex-col">
              <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2 shrink-0">
                <History className="w-3.5 h-3.5 text-primary" />
                Version History
              </h4>
              
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {versions.map((version, index) => (
                    <Collapsible 
                      key={version.id}
                      open={expandedVersions.includes(version.id)}
                      onOpenChange={() => toggleVersionExpand(version.id)}
                    >
                      <div 
                        className={`rounded-lg border transition-colors ${
                          selectedVersionId === version.id 
                            ? 'border-success/50 bg-success/5' 
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <CollapsibleTrigger className="w-full p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Version indicator */}
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                selectedVersionId === version.id 
                                  ? 'bg-success/20 text-success' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {version.editedBy === 'ai' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              </div>
                              <div className="text-left">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-medium text-foreground">
                                    {index === 0 ? 'Current' : `v${version.id}`}
                                  </span>
                                  <Badge variant="secondary" className="text-[8px] h-4 px-1">
                                    {version.type}
                                  </Badge>
                                  {index === 0 && (
                                    <Star className="w-3 h-3 text-success fill-success" />
                                  )}
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                  {formatDate(version.createdAt)}, {formatTime(version.createdAt)}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedVersions.includes(version.id) ? 'rotate-90' : ''}`} />
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="px-2 pb-2 pt-1 border-t border-border mt-1 space-y-2">
                            {/* Details */}
                            <div className="text-[10px] text-muted-foreground space-y-1">
                              <p>• Edited by: <span className="text-foreground">{version.editedBy === 'ai' ? 'AI Regeneration' : 'Manual Edit'}</span></p>
                              <p>• Word count: <span className="text-foreground">{version.wordCount}</span></p>
                              {version.changesSummary && (
                                <p>• Changes: <span className="text-foreground">{version.changesSummary}</span></p>
                              )}
                              {version.keywordsAdded && version.keywordsAdded.length > 0 && (
                                <p className="text-success">+ Keywords: {version.keywordsAdded.join(', ')}</p>
                              )}
                              {version.keywordsRemoved && version.keywordsRemoved.length > 0 && (
                                <p className="text-destructive">- Removed: {version.keywordsRemoved.join(', ')}</p>
                              )}
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-1">
                              {selectedVersionId !== version.id && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1 h-6 text-[10px] gap-1"
                                  onClick={() => restoreVersion(version)}
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Restore
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex-1 h-6 text-[10px] gap-1"
                                onClick={() => setCompareVersionId(compareVersionId === version.id ? null : version.id)}
                              >
                                <GitCompare className="w-3 h-3" />
                                Compare
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Section 4: Save & Actions */}
            <Card className="p-3 shrink-0">
              <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Save className="w-3.5 h-3.5 text-primary" />
                Save & Actions
              </h4>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => handleSaveVersion(false)}>
                    <Save className="w-3.5 h-3.5" />
                    Save Current
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => handleSaveVersion(true)}>
                    <RotateCcw className="w-3.5 h-3.5" />
                    Save as New
                  </Button>
                </div>
                
                <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1" onClick={handleSendToVendor}>
                  <Send className="w-3.5 h-3.5" />
                  Send to Vendor
                </Button>
                
                <Button variant="default" size="sm" className="w-full h-8 text-xs gap-1" onClick={handleMarkAsSubmitted}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark as Submitted
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
