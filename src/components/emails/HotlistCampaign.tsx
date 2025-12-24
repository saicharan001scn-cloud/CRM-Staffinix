import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft,
  ArrowRight,
  Search,
  Users,
  Building2,
  CheckCircle2,
  Eye,
  Send,
  Sparkles,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface HotlistCampaignProps {
  onBack: () => void;
}

const mockConsultants = [
  { id: '1', name: 'John Smith', skill: 'Java Developer', experience: '8 years', rate: '$75/hr', visa: 'US Citizen', available: true },
  { id: '2', name: 'Sarah Johnson', skill: 'React Developer', experience: '5 years', rate: '$70/hr', visa: 'Green Card', available: true },
  { id: '3', name: 'Mike Chen', skill: 'Full Stack Developer', experience: '6 years', rate: '$80/hr', visa: 'H1B', available: true },
  { id: '4', name: 'Emily Davis', skill: 'DevOps Engineer', experience: '7 years', rate: '$85/hr', visa: 'US Citizen', available: true },
  { id: '5', name: 'Alex Wilson', skill: 'Python Developer', experience: '4 years', rate: '$65/hr', visa: 'US Citizen', available: true },
];

const mockVendors = [
  { id: 'v1', name: 'TechRecruit Partners', email: 'jobs@techrecruit.com', contacts: 3 },
  { id: 'v2', name: 'Staffing Solutions Inc', email: 'vendor@staffingsolutions.com', contacts: 2 },
  { id: 'v3', name: 'IT Talent Hub', email: 'submissions@ittalent.com', contacts: 4 },
  { id: 'v4', name: 'Prime Consulting', email: 'requirements@primeconsulting.com', contacts: 2 },
  { id: 'v5', name: 'Global Tech Staffing', email: 'hotlist@globaltech.com', contacts: 5 },
];

export function HotlistCampaign({ onBack }: HotlistCampaignProps) {
  const [step, setStep] = useState(1);
  const [selectedConsultants, setSelectedConsultants] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [subject, setSubject] = useState('Available Consultants - IT Staffing Hotlist');
  const [emailContent, setEmailContent] = useState(`Hi {{VendorName}},

Hope this email finds you well. I wanted to share our latest available consultants who might be a good fit for your current requirements:

{{ConsultantList}}

All consultants are immediately available and open to new opportunities. Please let me know if any of these profiles match your current requirements.

Looking forward to working with you!

Best regards,
{{RecruiterName}}
{{CompanyName}}`);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const filteredConsultants = mockConsultants.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendors = mockVendors.filter(v => 
    v.name.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(vendorSearchQuery.toLowerCase())
  );

  const toggleConsultant = (id: string) => {
    setSelectedConsultants(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleVendor = (id: string) => {
    if (selectedVendors.includes(id)) {
      setSelectedVendors(prev => prev.filter(v => v !== id));
    } else if (selectedVendors.length < 50) {
      setSelectedVendors(prev => [...prev, id]);
    } else {
      toast.error('Maximum 50 recipients per campaign');
    }
  };

  const handleSend = () => {
    setShowConfirmation(false);
    toast.success(`Hotlist sent to ${selectedVendors.length} vendors successfully!`);
    onBack();
  };

  const getPreviewContent = () => {
    const consultantList = selectedConsultants.map(id => {
      const c = mockConsultants.find(con => con.id === id);
      return c ? `• ${c.name} - ${c.skill} (${c.experience}, ${c.rate})` : '';
    }).join('\n');

    return emailContent
      .replace('{{VendorName}}', 'John Doe')
      .replace('{{ConsultantList}}', consultantList || '[No consultants selected]')
      .replace('{{RecruiterName}}', 'Your Name')
      .replace('{{CompanyName}}', 'Your Company');
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
                {s === 1 ? 'Select Consultants' : s === 2 ? 'Select Vendors' : 'Compose & Send'}
              </span>
              {s < 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>
        
        <div className="w-32" />
      </div>

      {/* Step 1: Select Consultants */}
      {step === 1 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Select Consultants for Hotlist</h2>
            <Badge variant="outline">{selectedConsultants.length} selected</Badge>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search consultants by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0"
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredConsultants.map((consultant) => (
                <div
                  key={consultant.id}
                  onClick={() => toggleConsultant(consultant.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all flex items-center gap-4 ${
                    selectedConsultants.includes(consultant.id)
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted/50 border-2 border-transparent hover:border-primary/30'
                  }`}
                >
                  <Checkbox 
                    checked={selectedConsultants.includes(consultant.id)}
                    className="pointer-events-none"
                  />
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{consultant.name}</p>
                    <p className="text-sm text-muted-foreground">{consultant.skill} • {consultant.experience}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{consultant.rate}</p>
                    <Badge variant="outline" className="text-xs">{consultant.visa}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end mt-6 pt-4 border-t border-border">
            <Button 
              onClick={() => setStep(2)} 
              disabled={selectedConsultants.length === 0}
              className="gap-2"
            >
              Next: Select Vendors
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Select Vendors */}
      {step === 2 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Select Vendors (Max 50)</h2>
            <Badge variant="outline">{selectedVendors.length}/50 selected</Badge>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search vendors..."
              value={vendorSearchQuery}
              onChange={(e) => setVendorSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0"
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => toggleVendor(vendor.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all flex items-center gap-4 ${
                    selectedVendors.includes(vendor.id)
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted/50 border-2 border-transparent hover:border-primary/30'
                  }`}
                >
                  <Checkbox 
                    checked={selectedVendors.includes(vendor.id)}
                    className="pointer-events-none"
                  />
                  <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{vendor.name}</p>
                    <p className="text-sm text-muted-foreground">{vendor.email}</p>
                  </div>
                  <Badge variant="outline">{vendor.contacts} contacts</Badge>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button 
              onClick={() => setStep(3)} 
              disabled={selectedVendors.length === 0}
              className="gap-2"
            >
              Next: Compose Email
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Compose & Send */}
      {step === 3 && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Compose Hotlist Email</h2>
              
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
                    className="min-h-[300px] bg-muted border-0 font-mono text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Improve
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowPreview(true)}>
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button onClick={() => setShowConfirmation(true)} className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Hotlist
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Selected Consultants</h3>
              <div className="space-y-2">
                {selectedConsultants.map(id => {
                  const c = mockConsultants.find(con => con.id === id);
                  return c ? (
                    <div key={id} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-foreground">{c.name}</span>
                      <span className="text-muted-foreground">- {c.skill}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Selected Vendors</h3>
              <div className="space-y-2">
                {selectedVendors.map(id => {
                  const v = mockVendors.find(ven => ven.id === id);
                  return v ? (
                    <div key={id} className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{v.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Smart Placeholders</h3>
              <div className="flex flex-wrap gap-2">
                {['{{VendorName}}', '{{ConsultantList}}', '{{RecruiterName}}', '{{CompanyName}}'].map(token => (
                  <Badge key={token} variant="outline" className="cursor-pointer hover:bg-primary/10">
                    {token}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Subject</label>
              <div className="p-3 bg-muted rounded-lg mt-1">{subject}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Body</label>
              <div className="p-4 bg-muted rounded-lg mt-1 whitespace-pre-wrap text-sm">
                {getPreviewContent()}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Send</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              You are about to send a hotlist with <span className="font-semibold text-foreground">{selectedConsultants.length} consultants</span> to <span className="font-semibold text-foreground">{selectedVendors.length} vendors</span>.
            </p>
            <p className="text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
            <Button onClick={handleSend} className="gap-2">
              <Send className="w-4 h-4" />
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
