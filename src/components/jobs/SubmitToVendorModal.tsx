import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, 
  User, 
  CheckCircle, 
  X, 
  DollarSign, 
  Clock, 
  Building2, 
  FileText,
  Send,
  Users
} from 'lucide-react';
import { JobMatch } from '@/data/mockJobMatches';
import { JobRequirement } from '@/types';

interface SubmitToVendorModalProps {
  open: boolean;
  onClose: () => void;
  job: JobRequirement;
  matches: JobMatch[];
  onConfirmSubmit: (selectedMatches: JobMatch[]) => void;
}

export function SubmitToVendorModal({ 
  open, 
  onClose, 
  job, 
  matches,
  onConfirmSubmit 
}: SubmitToVendorModalProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleCandidate = (consultantId: string) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(consultantId)) {
        newSet.delete(consultantId);
      } else {
        newSet.add(consultantId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.size === matches.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(matches.map(m => m.consultant.id)));
    }
  };

  const handleProceedToConfirm = () => {
    if (selectedCandidates.size > 0) {
      setShowConfirmation(true);
    }
  };

  const handleBackToSelection = () => {
    setShowConfirmation(false);
  };

  const handleConfirmAndMail = () => {
    const selectedMatches = matches.filter(m => selectedCandidates.has(m.consultant.id));
    onConfirmSubmit(selectedMatches);
    setShowConfirmation(false);
    setSelectedCandidates(new Set());
    onClose();
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setSelectedCandidates(new Set());
    onClose();
  };

  const selectedMatches = matches.filter(m => selectedCandidates.has(m.consultant.id));

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Confirm & Mail Submission
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Review and confirm the submission details
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Submission Details */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Job:</span>
                <span className="font-medium text-foreground">{job.title} at {job.client}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Vendor:</span>
                <span className="font-medium text-foreground">{job.vendorName || 'Vendor'}</span>
                {job.vendorEmail && (
                  <span className="text-muted-foreground">({job.vendorEmail})</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Candidates Selected:</span>
                <span className="font-medium text-foreground">{selectedMatches.length}</span>
              </div>
              
              {/* Selected Candidates List */}
              <div className="pt-2 border-t border-border space-y-1">
                {selectedMatches.map(match => (
                  <div key={match.consultant.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span className="text-foreground">{match.consultant.name}</span>
                    <span className="text-muted-foreground">- {match.consultant.skills[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Updates */}
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg space-y-2">
              <h4 className="text-sm font-medium text-success flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Submission Status
              </h4>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-success" />
                  <span>Candidate status will be updated to: <strong className="text-warning">APPLIED</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-success" />
                  <span>Email will be prepared for sending</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-success" />
                  <span>Submission tracker will be updated</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleBackToSelection} className="flex-1 gap-2">
              <X className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={handleConfirmAndMail} className="flex-1 gap-2 bg-success hover:bg-success/90">
              <Send className="w-4 h-4" />
              Confirm & Mail
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-500" />
            Select Candidate for Submission
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {job.title} at {job.client} • Vendor: {job.vendorName || 'Vendor'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {/* Select All */}
          <div className="flex items-center justify-between py-2 mb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="select-all"
                checked={selectedCandidates.size === matches.length && matches.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium text-foreground cursor-pointer">
                Select All ({matches.length})
              </label>
            </div>
            <Badge variant="secondary" className="text-xs">
              {selectedCandidates.size} selected
            </Badge>
          </div>

          {/* Candidates List */}
          <ScrollArea className="h-[300px] pr-2">
            <div className="space-y-2">
              {matches.map(match => (
                <div 
                  key={match.consultant.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedCandidates.has(match.consultant.id)
                      ? 'bg-primary/10 border-primary/50'
                      : 'bg-muted/50 border-border hover:border-primary/30'
                  }`}
                  onClick={() => toggleCandidate(match.consultant.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={selectedCandidates.has(match.consultant.id)}
                      onCheckedChange={() => toggleCandidate(match.consultant.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">{match.consultant.name}</span>
                          {selectedCandidates.has(match.consultant.id) && (
                            <CheckCircle className="w-3 h-3 text-success" />
                          )}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            match.matchScore >= 85 
                              ? 'bg-success/20 text-success border-success/30' 
                              : 'bg-primary/20 text-primary border-primary/30'
                          }`}
                        >
                          {match.matchScore}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {match.consultant.skills.slice(0, 4).join(', ')}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-3 h-3" />
                          <span>${match.consultant.rate}/hr</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{match.consultant.status === 'available' ? 'Available Now' : match.consultant.status}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {match.consultant.visaStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex gap-3 pt-2 border-t border-border">
          <Button variant="outline" onClick={handleClose} className="flex-1 gap-2">
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleProceedToConfirm} 
            className="flex-1 gap-2"
            disabled={selectedCandidates.size === 0}
          >
            <Send className="w-4 h-4" />
            Submit Selected ({selectedCandidates.size})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
