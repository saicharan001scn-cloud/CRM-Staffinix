import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Send, Link2, FileText, Users, Calendar, AlertCircle } from 'lucide-react';

interface RequestIntegrationModalProps {
  open: boolean;
  onClose: () => void;
}

const integrationTypes = [
  { value: 'job-board', label: 'Job Board API' },
  { value: 'ats', label: 'ATS Integration' },
  { value: 'calendar', label: 'Calendar Service' },
  { value: 'email', label: 'Email Service' },
  { value: 'storage', label: 'Document Storage' },
  { value: 'video', label: 'Video Interview' },
  { value: 'other', label: 'Other' },
];

const priorityOptions = [
  { value: 'high', label: 'High (Blocking workflow)', color: 'bg-destructive/20 text-destructive border-destructive/30' },
  { value: 'medium', label: 'Medium (Important improvement)', color: 'bg-warning/20 text-warning border-warning/30' },
  { value: 'low', label: 'Low (Nice to have)', color: 'bg-muted text-muted-foreground border-border' },
];

export function RequestIntegrationModal({ open, onClose }: RequestIntegrationModalProps) {
  const [formData, setFormData] = useState({
    integrationName: '',
    integrationType: '',
    vendor: '',
    websiteUrl: '',
    apiDocsUrl: '',
    businessNeed: '',
    estimatedUsers: '',
    priority: '',
    contactPerson: '',
    expectedTimeline: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.integrationName || !formData.integrationType || !formData.businessNeed || !formData.priority) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const ticketId = `INT-REQ-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    toast.success('Integration request submitted!', {
      description: `Ticket ID: ${ticketId}. We'll review within 48 hours.`,
    });
    
    setIsSubmitting(false);
    setFormData({
      integrationName: '',
      integrationType: '',
      vendor: '',
      websiteUrl: '',
      apiDocsUrl: '',
      businessNeed: '',
      estimatedUsers: '',
      priority: '',
      contactPerson: '',
      expectedTimeline: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Request New Integration
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Submit a request for a new integration. Our team will review and respond within 48 hours.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              Integration Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="integrationName">
                  Integration Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="integrationName"
                  placeholder="e.g., New Job Board, HR Software"
                  value={formData.integrationName}
                  onChange={(e) => handleChange('integrationName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="integrationType">
                  Integration Type <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.integrationType} onValueChange={(v) => handleChange('integrationType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {integrationTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor / Provider</Label>
                <Input
                  id="vendor"
                  placeholder="Company providing the integration"
                  value={formData.vendor}
                  onChange={(e) => handleChange('vendor', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.websiteUrl}
                  onChange={(e) => handleChange('websiteUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiDocsUrl">API Documentation Link</Label>
              <Input
                id="apiDocsUrl"
                type="url"
                placeholder="Link to their API docs if available"
                value={formData.apiDocsUrl}
                onChange={(e) => handleChange('apiDocsUrl', e.target.value)}
              />
            </div>
          </div>

          {/* Business Need */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Business Justification
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="businessNeed">
                Business Need <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="businessNeed"
                placeholder="Why do we need this integration? What problem does it solve?"
                value={formData.businessNeed}
                onChange={(e) => handleChange('businessNeed', e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
              />
              <p className="text-[10px] text-muted-foreground text-right">
                {formData.businessNeed.length}/500 characters
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedUsers">
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  Estimated Users
                </Label>
                <Input
                  id="estimatedUsers"
                  type="number"
                  placeholder="How many team members will use it?"
                  value={formData.estimatedUsers}
                  onChange={(e) => handleChange('estimatedUsers', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">
                  Priority <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.priority} onValueChange={(v) => handleChange('priority', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-[10px] ${option.color}`}>
                            {option.value.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{option.label.split('(')[1]?.replace(')', '')}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact & Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Contact & Timeline
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="Who requested this integration?"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedTimeline">Expected Timeline</Label>
                <Input
                  id="expectedTimeline"
                  placeholder="When do you need it by?"
                  value={formData.expectedTimeline}
                  onChange={(e) => handleChange('expectedTimeline', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-info/10 border border-info/30">
            <AlertCircle className="w-4 h-4 text-info shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">What happens next?</p>
              <p className="mt-1">
                After submission, you'll receive a ticket ID. Our team will review your request and provide updates within 48 hours. 
                You can track the status in Settings → My Integration Requests.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
