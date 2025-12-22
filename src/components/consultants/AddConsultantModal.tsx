import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { VisaStatus, ConsultantStatus } from '@/types';

interface AddConsultantModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (consultant: NewConsultant) => void;
}

export interface NewConsultant {
  firstName: string;
  lastName: string;
  visaStatus: VisaStatus;
  rate: number;
  location: string;
  skills: string[];
  status: ConsultantStatus;
  email?: string;
  phone?: string;
}

const visaOptions: VisaStatus[] = ['USC', 'GC', 'H1B', 'OPT', 'CPT', 'L1', 'L2', 'H4 EAD', 'TN'];
const statusOptions: { value: ConsultantStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'bench', label: 'Bench' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'interview', label: 'Interview' },
  { value: 'placed', label: 'Placed' },
];

const commonSkills = ['Java', 'Python', 'React', 'Angular', 'Node.js', 'AWS', 'Azure', 'DevOps', 'Salesforce', 'SAP', '.NET', 'SQL'];

export function AddConsultantModal({ open, onClose, onAdd }: AddConsultantModalProps) {
  const [formData, setFormData] = useState<NewConsultant>({
    firstName: '',
    lastName: '',
    visaStatus: 'H1B',
    rate: 0,
    location: '',
    skills: [],
    status: 'bench',
    email: '',
    phone: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.visaStatus) newErrors.visaStatus = 'Visa status is required';
    if (!formData.rate || formData.rate <= 0) newErrors.rate = 'Rate must be greater than 0';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (saveAndAdd: boolean) => {
    if (!validate()) return;
    
    onAdd(formData);
    toast.success('Consultant added!', {
      description: `${formData.firstName} ${formData.lastName} has been added.`
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
      firstName: '',
      lastName: '',
      visaStatus: 'H1B',
      rate: 0,
      location: '',
      skills: [],
      status: 'bench',
      email: '',
      phone: '',
    });
    setSkillInput('');
    setErrors({});
  };

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData({ ...formData, skills: [...formData.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  return (
    <Dialog open={open} onOpenChange={() => { onClose(); resetForm(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add New Consultant</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-xs">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && <p className="text-[10px] text-destructive mt-0.5">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && <p className="text-[10px] text-destructive mt-0.5">{errors.lastName}</p>}
            </div>
          </div>

          {/* Visa & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Visa Status *</Label>
              <Select value={formData.visaStatus} onValueChange={(v) => setFormData({ ...formData, visaStatus: v as VisaStatus })}>
                <SelectTrigger className={errors.visaStatus ? 'border-destructive' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visaOptions.map(v => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.visaStatus && <p className="text-[10px] text-destructive mt-0.5">{errors.visaStatus}</p>}
            </div>
            <div>
              <Label className="text-xs">Status *</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as ConsultantStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rate & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="rate" className="text-xs">Rate ($/hr) *</Label>
              <Input
                id="rate"
                type="number"
                min={0}
                value={formData.rate || ''}
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                placeholder="75"
                className={errors.rate ? 'border-destructive' : ''}
              />
              {errors.rate && <p className="text-[10px] text-destructive mt-0.5">{errors.rate}</p>}
            </div>
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
          </div>

          {/* Skills */}
          <div>
            <Label className="text-xs">Skills *</Label>
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
              {commonSkills.filter(s => !formData.skills.includes(s)).slice(0, 6).map(skill => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-[10px] cursor-pointer hover:bg-primary/10"
                  onClick={() => addSkill(skill)}
                >
                  + {skill}
                </Badge>
              ))}
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs gap-1">
                    {skill}
                    <X className="w-2 h-2 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            )}
            {errors.skills && <p className="text-[10px] text-destructive mt-0.5">{errors.skills}</p>}
          </div>

          {/* Contact (Optional) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email" className="text-xs">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs">Phone (Optional)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
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
            Save Consultant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}