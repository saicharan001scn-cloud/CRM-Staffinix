import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, Plus, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface AddJobModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (job: NewJob) => void;
}

export interface NewJob {
  title: string;
  location: string;
  workType: 'Remote' | 'Onsite' | 'Hybrid';
  vendorCompanyName: string;
  implementationPartner: string;
  endClientName: string;
  vendorContactEmail: string;
  vendorContactPhone: string;
  vendorContactPerson: string;
  minRate: number;
  maxRate: number;
  description: string;
  requiredSkills: string[];
  secondarySkills: string[];
  minExperience: number;
  maxExperience: number;
  visaRequirements: string[];
  source: string;
  urgency: 'High' | 'Medium' | 'Low';
}

const sourceOptions = ['LinkedIn', 'Dice', 'Indeed', 'Monster', 'CareerBuilder', 'Vendor Email', 'Referral', 'Direct Client', 'Talent.com', 'Other'];
const visaOptions = ['US Citizen', 'Green Card', 'H1B', 'OPT', 'CPT', 'L1', 'L2', 'TN', 'Any'];
const commonSkills = ['Java', 'Python', 'React', 'Angular', 'Node.js', 'AWS', 'Azure', 'DevOps', 'Salesforce', 'SAP', '.NET', 'SQL', 'TypeScript', 'Kubernetes', 'Docker'];
const vendorSuggestions = ['TekSystems', 'Robert Half', 'Insight Global', 'Apex Systems', 'Randstad', 'Modis'];
const clientSuggestions = ['TechCorp', 'FinanceHub', 'HealthTech Inc', 'RetailMax', 'AutoDrive Systems', 'CloudNet Solutions'];

export function AddJobModal({ open, onClose, onAdd }: AddJobModalProps) {
  const [formData, setFormData] = useState<NewJob>({
    title: '',
    location: '',
    workType: 'Remote',
    vendorCompanyName: '',
    implementationPartner: '',
    endClientName: '',
    vendorContactEmail: '',
    vendorContactPhone: '+1 ',
    vendorContactPerson: '',
    minRate: 0,
    maxRate: 0,
    description: '',
    requiredSkills: [],
    secondarySkills: [],
    minExperience: 0,
    maxExperience: 10,
    visaRequirements: [],
    source: '',
    urgency: 'Medium',
  });
  const [skillInput, setSkillInput] = useState('');
  const [secondarySkillInput, setSecondarySkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Job role is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.vendorCompanyName.trim()) newErrors.vendorCompanyName = 'Vendor company name is required';
    if (!formData.endClientName.trim()) newErrors.endClientName = 'End client name is required';
    if (!formData.vendorContactEmail.trim()) newErrors.vendorContactEmail = 'Vendor contact email is required';
    if (formData.vendorContactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vendorContactEmail)) {
      newErrors.vendorContactEmail = 'Invalid email format';
    }
    if (!formData.vendorContactPhone.trim() || formData.vendorContactPhone === '+1 ') {
      newErrors.vendorContactPhone = 'Vendor contact phone is required';
    }
    if (!formData.minRate || formData.minRate <= 0) newErrors.minRate = 'Min rate is required';
    if (!formData.maxRate || formData.maxRate < formData.minRate) newErrors.maxRate = 'Max rate must be >= min rate';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (formData.requiredSkills.length === 0) newErrors.requiredSkills = 'At least one skill is required';
    if (!formData.source) newErrors.source = 'Job source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (saveAndAdd: boolean) => {
    if (!validate()) return;
    
    onAdd(formData);
    toast.success('Job added!', {
      description: `${formData.title} at ${formData.endClientName} (via ${formData.vendorCompanyName}) has been added.`
    });
    
    if (saveAndAdd) {
      resetForm();
    } else {
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      workType: 'Remote',
      vendorCompanyName: '',
      implementationPartner: '',
      endClientName: '',
      vendorContactEmail: '',
      vendorContactPhone: '+1 ',
      vendorContactPerson: '',
      minRate: 0,
      maxRate: 0,
      description: '',
      requiredSkills: [],
      secondarySkills: [],
      minExperience: 0,
      maxExperience: 10,
      visaRequirements: [],
      source: '',
      urgency: 'Medium',
    });
    setSkillInput('');
    setSecondarySkillInput('');
    setErrors({});
  };

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !formData.requiredSkills.includes(s)) {
      setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, s] });
      setSkillInput('');
    }
  };

  const addSecondarySkill = (skill: string) => {
    const s = skill.trim();
    if (s && !formData.secondarySkills.includes(s)) {
      setFormData({ ...formData, secondarySkills: [...formData.secondarySkills, s] });
      setSecondarySkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, requiredSkills: formData.requiredSkills.filter(s => s !== skill) });
  };

  const removeSecondarySkill = (skill: string) => {
    setFormData({ ...formData, secondarySkills: formData.secondarySkills.filter(s => s !== skill) });
  };

  const toggleVisa = (visa: string) => {
    if (formData.visaRequirements.includes(visa)) {
      setFormData({ ...formData, visaRequirements: formData.visaRequirements.filter(v => v !== visa) });
    } else {
      setFormData({ ...formData, visaRequirements: [...formData.visaRequirements, visa] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => { onClose(); resetForm(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add New Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Job Role */}
          <div>
            <Label htmlFor="title" className="text-xs">Job Role *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Senior Java Developer, React Frontend Engineer"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-[10px] text-destructive mt-0.5">{errors.title}</p>}
          </div>

          {/* Location & Work Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="location" className="text-xs">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Dallas, TX"
                className={errors.location ? 'border-destructive' : ''}
              />
              {errors.location && <p className="text-[10px] text-destructive mt-0.5">{errors.location}</p>}
            </div>
            <div>
              <Label className="text-xs">Work Type *</Label>
              <RadioGroup 
                value={formData.workType} 
                onValueChange={(v) => setFormData({ ...formData, workType: v as 'Remote' | 'Onsite' | 'Hybrid' })}
                className="flex gap-3 mt-2"
              >
                {['Remote', 'Onsite', 'Hybrid'].map(type => (
                  <div key={type} className="flex items-center gap-1">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="text-xs font-normal">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Client Chain Section */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground -mt-1">Client Chain</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="vendorCompanyName" className="text-xs flex items-center gap-1">
                  Vendor Company Name *
                  <span className="text-muted-foreground text-[10px]" title="The staffing vendor company we're working with">(ℹ️)</span>
                </Label>
                <Input
                  id="vendorCompanyName"
                  value={formData.vendorCompanyName}
                  onChange={(e) => setFormData({ ...formData, vendorCompanyName: e.target.value })}
                  placeholder="e.g., TekSystems"
                  className={errors.vendorCompanyName ? 'border-destructive' : ''}
                  list="vendor-suggestions"
                />
                <datalist id="vendor-suggestions">
                  {vendorSuggestions.map(v => <option key={v} value={v} />)}
                </datalist>
                {errors.vendorCompanyName && <p className="text-[10px] text-destructive mt-0.5">{errors.vendorCompanyName}</p>}
              </div>
              
              <div>
                <Label htmlFor="implementationPartner" className="text-xs flex items-center gap-1">
                  Implementation Partner
                  <span className="text-muted-foreground text-[10px]" title="The implementation/delivery partner (if different from vendor)">(ℹ️)</span>
                </Label>
                <Input
                  id="implementationPartner"
                  value={formData.implementationPartner}
                  onChange={(e) => setFormData({ ...formData, implementationPartner: e.target.value })}
                  placeholder="Optional - e.g., Accenture"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="endClientName" className="text-xs flex items-center gap-1">
                End Client / Final Client *
                <span className="text-muted-foreground text-[10px]" title="The final company where consultant will work">(ℹ️)</span>
              </Label>
              <Input
                id="endClientName"
                value={formData.endClientName}
                onChange={(e) => setFormData({ ...formData, endClientName: e.target.value })}
                placeholder="e.g., Bank of America"
                className={errors.endClientName ? 'border-destructive' : ''}
                list="client-suggestions"
              />
              <datalist id="client-suggestions">
                {clientSuggestions.map(c => <option key={c} value={c} />)}
              </datalist>
              {errors.endClientName && <p className="text-[10px] text-destructive mt-0.5">{errors.endClientName}</p>}
            </div>
          </div>

          {/* Vendor Contact Details Section */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground -mt-1">Vendor Contact Details</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="vendorContactEmail" className="text-xs">Vendor Contact Email *</Label>
                <Input
                  id="vendorContactEmail"
                  type="email"
                  value={formData.vendorContactEmail}
                  onChange={(e) => setFormData({ ...formData, vendorContactEmail: e.target.value })}
                  placeholder="vendor@company.com"
                  className={errors.vendorContactEmail ? 'border-destructive' : ''}
                />
                {errors.vendorContactEmail && <p className="text-[10px] text-destructive mt-0.5">{errors.vendorContactEmail}</p>}
              </div>
              
              <div>
                <Label htmlFor="vendorContactPhone" className="text-xs">Vendor Contact Phone *</Label>
                <Input
                  id="vendorContactPhone"
                  value={formData.vendorContactPhone}
                  onChange={(e) => setFormData({ ...formData, vendorContactPhone: e.target.value })}
                  placeholder="+1 555-123-4567"
                  className={errors.vendorContactPhone ? 'border-destructive' : ''}
                />
                {errors.vendorContactPhone && <p className="text-[10px] text-destructive mt-0.5">{errors.vendorContactPhone}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="vendorContactPerson" className="text-xs">Vendor Contact Person Name</Label>
              <Input
                id="vendorContactPerson"
                value={formData.vendorContactPerson}
                onChange={(e) => setFormData({ ...formData, vendorContactPerson: e.target.value })}
                placeholder="John Smith"
              />
            </div>
          </div>

          {/* Rate Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="minRate" className="text-xs">Min Rate ($/hr) *</Label>
              <Input
                id="minRate"
                type="number"
                min={0}
                value={formData.minRate || ''}
                onChange={(e) => setFormData({ ...formData, minRate: parseFloat(e.target.value) || 0 })}
                placeholder="60"
                className={errors.minRate ? 'border-destructive' : ''}
              />
              {errors.minRate && <p className="text-[10px] text-destructive mt-0.5">{errors.minRate}</p>}
            </div>
            <div>
              <Label htmlFor="maxRate" className="text-xs">Max Rate ($/hr) *</Label>
              <Input
                id="maxRate"
                type="number"
                min={0}
                value={formData.maxRate || ''}
                onChange={(e) => setFormData({ ...formData, maxRate: parseFloat(e.target.value) || 0 })}
                placeholder="85"
                className={errors.maxRate ? 'border-destructive' : ''}
              />
              {errors.maxRate && <p className="text-[10px] text-destructive mt-0.5">{errors.maxRate}</p>}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <Label htmlFor="description" className="text-xs">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Paste or enter the full job description..."
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && <p className="text-[10px] text-destructive mt-0.5">{errors.description}</p>}
          </div>

          {/* Required Skills */}
          <div>
            <Label className="text-xs">Required Skills *</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={() => addSkill(skillInput)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {commonSkills.filter(s => !formData.requiredSkills.includes(s)).slice(0, 6).map(skill => (
                <Badge key={skill} variant="outline" className="text-[10px] cursor-pointer hover:bg-primary/10" onClick={() => addSkill(skill)}>
                  + {skill}
                </Badge>
              ))}
            </div>
            {formData.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.requiredSkills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs gap-1">
                    {skill}
                    <X className="w-2 h-2 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            )}
            {errors.requiredSkills && <p className="text-[10px] text-destructive mt-0.5">{errors.requiredSkills}</p>}
          </div>

          {/* Secondary Skills */}
          <div>
            <Label className="text-xs">Secondary Skills (Optional)</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={secondarySkillInput}
                onChange={(e) => setSecondarySkillInput(e.target.value)}
                placeholder="Add nice-to-have skill..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSecondarySkill(secondarySkillInput))}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={() => addSecondarySkill(secondarySkillInput)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {formData.secondarySkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.secondarySkills.map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs gap-1">
                    {skill}
                    <X className="w-2 h-2 cursor-pointer" onClick={() => removeSecondarySkill(skill)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Experience Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="minExp" className="text-xs">Min Experience (years)</Label>
              <Input
                id="minExp"
                type="number"
                min={0}
                value={formData.minExperience || ''}
                onChange={(e) => setFormData({ ...formData, minExperience: parseInt(e.target.value) || 0 })}
                placeholder="3"
              />
            </div>
            <div>
              <Label htmlFor="maxExp" className="text-xs">Max Experience (years)</Label>
              <Input
                id="maxExp"
                type="number"
                min={0}
                value={formData.maxExperience || ''}
                onChange={(e) => setFormData({ ...formData, maxExperience: parseInt(e.target.value) || 0 })}
                placeholder="10"
              />
            </div>
          </div>

          {/* Visa Requirements */}
          <div>
            <Label className="text-xs">Visa Requirements</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {visaOptions.map(visa => (
                <div key={visa} className="flex items-center gap-1.5">
                  <Checkbox 
                    id={visa}
                    checked={formData.visaRequirements.includes(visa)}
                    onCheckedChange={() => toggleVisa(visa)}
                  />
                  <Label htmlFor={visa} className="text-xs font-normal">{visa}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Source & Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Job Source *</Label>
              <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v })}>
                <SelectTrigger className={errors.source ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.source && <p className="text-[10px] text-destructive mt-0.5">{errors.source}</p>}
            </div>
            <div>
              <Label className="text-xs">Urgency Level</Label>
              <Select value={formData.urgency} onValueChange={(v) => setFormData({ ...formData, urgency: v as 'High' | 'Medium' | 'Low' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={() => { onClose(); resetForm(); }}>
            Cancel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSubmit(true)} className="gap-1">
            <RotateCcw className="w-3 h-3" />
            Save & Add Another
          </Button>
          <Button size="sm" onClick={() => handleSubmit(false)} className="gap-1">
            <Save className="w-3 h-3" />
            Save Job
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}