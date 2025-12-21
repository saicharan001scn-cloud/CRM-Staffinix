import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Submission } from '@/types';
import { cn } from '@/lib/utils';
import { DollarSign, TrendingUp, TrendingDown, Minus, AlertTriangle, User } from 'lucide-react';

interface RateUpdateModalProps {
  open: boolean;
  onClose: () => void;
  submission: Submission;
  onUpdateRate: (newRate: number, reason?: string, vendorContact?: string) => void;
}

export function RateUpdateModal({ 
  open, 
  onClose, 
  submission,
  onUpdateRate 
}: RateUpdateModalProps) {
  const [newRate, setNewRate] = useState<string>(
    submission.submissionRate?.toString() || submission.appliedRate.toString()
  );
  const [reason, setReason] = useState('');
  const [vendorContact, setVendorContact] = useState(submission.vendorContact || '');

  const appliedRate = submission.appliedRate;
  const currentRate = parseFloat(newRate) || 0;
  const rateDiff = currentRate - appliedRate;
  const ratePercentage = appliedRate > 0 ? ((rateDiff / appliedRate) * 100).toFixed(1) : '0';
  const isSignificantChange = Math.abs(parseFloat(ratePercentage)) > 20;

  const handleSubmit = () => {
    if (currentRate > 0) {
      onUpdateRate(currentRate, reason || undefined, vendorContact || undefined);
      setNewRate('');
      setReason('');
      onClose();
    }
  };

  const handleClose = () => {
    setNewRate(submission.submissionRate?.toString() || submission.appliedRate.toString());
    setReason('');
    setVendorContact(submission.vendorContact || '');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-foreground">Update Negotiated Rate</DialogTitle>
          <p className="text-[10px] text-muted-foreground mt-1">
            {submission.consultantName} • {submission.jobTitle}
          </p>
        </DialogHeader>

        <div className="space-y-3">
          {/* Current Rates Display */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-warning/10 border border-warning/30">
              <p className="text-[8px] text-muted-foreground">Applied Rate</p>
              <p className="text-sm font-bold text-warning">${appliedRate}/hr</p>
            </div>
            <div className="p-2 rounded-lg bg-info/10 border border-info/30">
              <p className="text-[8px] text-muted-foreground">Current Negotiated</p>
              <p className="text-sm font-bold text-info">
                {submission.submissionRate ? `$${submission.submissionRate}/hr` : 'Not set'}
              </p>
            </div>
          </div>

          {/* New Rate Input */}
          <div>
            <Label htmlFor="newRate" className="text-[10px] text-muted-foreground">
              Final Agreed Rate ($/hr) <span className="text-destructive">*</span>
            </Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                id="newRate"
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="Enter negotiated rate"
                className="pl-6 h-8 text-[10px]"
                min={0}
              />
            </div>
          </div>

          {/* Rate Difference Preview */}
          {currentRate > 0 && (
            <div className={cn(
              "p-2 rounded-lg border",
              rateDiff > 0 && "bg-success/10 border-success/30",
              rateDiff < 0 && "bg-destructive/10 border-destructive/30",
              rateDiff === 0 && "bg-info/10 border-info/30"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {rateDiff > 0 && <TrendingUp className="w-3 h-3 text-success" />}
                  {rateDiff < 0 && <TrendingDown className="w-3 h-3 text-destructive" />}
                  {rateDiff === 0 && <Minus className="w-3 h-3 text-info" />}
                  <span className="text-[10px] text-muted-foreground">Rate Difference</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "text-[10px] font-bold",
                    rateDiff > 0 && "text-success",
                    rateDiff < 0 && "text-destructive",
                    rateDiff === 0 && "text-info"
                  )}>
                    {rateDiff >= 0 ? '+' : ''}{rateDiff.toFixed(0)}/hr
                  </span>
                  <span className={cn(
                    "px-1 py-0.5 rounded text-[8px] font-semibold",
                    rateDiff > 0 && "bg-success/20 text-success",
                    rateDiff < 0 && "bg-destructive/20 text-destructive",
                    rateDiff === 0 && "bg-info/20 text-info"
                  )}>
                    {rateDiff >= 0 ? '+' : ''}{ratePercentage}%
                  </span>
                </div>
              </div>
              
              {isSignificantChange && (
                <div className="flex items-center gap-1 mt-1.5 p-1 bg-amber-500/10 rounded">
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                  <span className="text-[8px] text-amber-500">
                    Significant rate change ({ratePercentage}% from applied rate)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Vendor Contact */}
          <div>
            <Label htmlFor="vendorContact" className="text-[10px] text-muted-foreground">
              Vendor Contact Person
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                id="vendorContact"
                value={vendorContact}
                onChange={(e) => setVendorContact(e.target.value)}
                placeholder="Who confirmed the rate?"
                className="pl-6 h-8 text-[10px]"
              />
            </div>
          </div>

          {/* Reason/Notes */}
          <div>
            <Label htmlFor="reason" className="text-[10px] text-muted-foreground">
              Negotiation Notes
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Vendor countered at $70, we agreed after discussion..."
              className="mt-1 h-16 text-[10px] resize-none"
            />
          </div>

          {/* Rate History Preview */}
          {submission.rateHistory.length > 0 && (
            <div className="border-t border-border pt-2">
              <p className="text-[9px] text-muted-foreground mb-1.5">Rate History</p>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {submission.rateHistory.slice().reverse().map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between text-[8px] p-1 bg-muted/20 rounded">
                    <span className="text-muted-foreground">
                      {entry.oldRate ? `$${entry.oldRate} → ` : ''}${entry.newRate}/hr
                    </span>
                    <span className={cn(
                      "px-1 rounded",
                      entry.type === 'applied' ? 'bg-warning/20 text-warning' : 'bg-info/20 text-info'
                    )}>
                      {entry.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={handleClose} className="text-[10px]">
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSubmit} 
            disabled={!currentRate || currentRate <= 0}
            className="text-[10px]"
          >
            Save Rate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}