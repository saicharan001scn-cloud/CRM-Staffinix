import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Save, RotateCcw, Upload, FileText, Phone } from 'lucide-react';
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
  secondarySkills: string[];
  status: ConsultantStatus;
  email?: string;
  phone?: string;
  phoneCountryCode: string;
  alternatePhone?: string;
  alternatePhoneCountryCode: string;
  preferredJobRoles: string[];
  yearsOfExperience: number;
  resumeFile?: File;
  noticePeriod?: string;
  currentCompany?: string;
  linkedinProfile?: string;
}

const visaOptions: VisaStatus[] = ['USC', 'GC', 'H1B', 'OPT', 'CPT', 'L1', 'L2', 'H4 EAD', 'TN'];
const statusOptions: { value: ConsultantStatus | 'others'; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'bench', label: 'Bench' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'interview', label: 'Interview' },
  { value: 'placed', label: 'Placed' },
  { value: 'others', label: 'Others' },
];

const commonSkills = ['Java', 'Python', 'React', 'Angular', 'Node.js', 'AWS', 'Azure', 'DevOps', 'Salesforce', 'SAP', '.NET', 'SQL'];
const jobRoleOptions = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
  'Data Engineer', 'Data Scientist', 'QA Engineer', 'Mobile Developer', 'Cloud Architect',
  'Project Manager', 'Business Analyst', 'Scrum Master', 'UI/UX Designer', 'Security Engineer'
];

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
];

const noticePeriodOptions = ['Immediate', '1 Week', '2 Weeks', '1 Month', '2 Months', '3 Months'];

export function AddConsultantModal({ open, onClose, onAdd }: AddConsultantModalProps) {
  const [formData, setFormData] = useState<NewConsultant>({
    firstName: '',
    lastName: '',
    visaStatus: 'H1B',
    rate: 0,
    location: '',
    skills: [],
    secondarySkills: [],
    status: 'bench',
    email: '',
    phone: '',
    phoneCountryCode: '+1',
    alternatePhone: '',
    alternatePhoneCountryCode: '+1',
    preferredJobRoles: [],
    yearsOfExperience: 0,
    noticePeriod: '',
    currentCompany: '',
    linkedinProfile: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [secondarySkillInput, setSecondarySkillInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.visaStatus) newErrors.visaStatus = 'Visa status is required';
    if (!formData.rate || formData.rate <= 0) newErrors.rate = 'Rate must be greater than 0';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    if (formData.preferredJobRoles.length === 0) newErrors.preferredJobRoles = 'At least one job role is required';
    if (formData.yearsOfExperience < 0 || formData.yearsOfExperience > 50) newErrors.yearsOfExperience = 'Experience must be 0-50 years';
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
      secondarySkills: [],
      status: 'bench',
      email: '',
      phone: '',
      phoneCountryCode: '+1',
      alternatePhone: '',
      alternatePhoneCountryCode: '+1',
      preferredJobRoles: [],
      yearsOfExperience: 0,
      noticePeriod: '',
      currentCompany: '',
      linkedinProfile: '',
    });
    setSkillInput('');
    setSecondarySkillInput('');
    setRoleInput('');
    setErrors({});
  };

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData({ ...formData, skills: [...formData.skills, s] });
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
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const removeSecondarySkill = (skill: string) => {
    setFormData({ ...formData, secondarySkills: formData.secondarySkills.filter(s => s !== skill) });
  };

  const addJobRole = (role: string) => {
    const r = role.trim();
    if (r && !formData.preferredJobRoles.includes(r)) {
      setFormData({ ...formData, preferredJobRoles: [...formData.preferredJobRoles, r] });
      setRoleInput('');
    }
  };

  const removeJobRole = (role: string) => {
    setFormData({ ...formData, preferredJobRoles: formData.preferredJobRoles.filter(r => r !== role) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', { description: 'Maximum file size is 5MB' });
        return;
      }
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type', { description: 'Only PDF, DOC, DOCX files allowed' });
        return;
      }
      setFormData({ ...formData, resumeFile: file });
      toast.success('Resume uploaded', { description: file.name });
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  return (
    <Dialog open={open} onOpenChange={() => { onClose(); resetForm(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add New Consultant</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Section 1: Personal Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-1">Personal Information</h3>
            
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

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@email.com"
              />
            </div>

            {/* Primary Mobile */}
            <div>
              <Label className="text-xs">Primary Mobile *</Label>
              <div className="flex gap-2">
                <Select value={formData.phoneCountryCode} onValueChange={(v) => setFormData({ ...formData, phoneCountryCode: v })}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map(c => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                    placeholder="555-123-4567"
                    className="pl-9"
                    maxLength={12}
                  />
                </div>
              </div>
            </div>

            {/* Alternate Mobile */}
            <div>
              <Label className="text-xs">Alternate Mobile (Optional)</Label>
              <div className="flex gap-2">
                <Select value={formData.alternatePhoneCountryCode} onValueChange={(v) => setFormData({ ...formData, alternatePhoneCountryCode: v })}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map(c => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={formData.alternatePhone}
                    onChange={(e) => setFormData({ ...formData, alternatePhone: formatPhoneNumber(e.target.value) })}
                    placeholder="555-987-6543"
                    className="pl-9"
                    maxLength={12}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-1">Professional Details</h3>
            
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

            {/* Preferred Job Roles */}
            <div>
              <Label className="text-xs">Preferred Job Roles *</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="Add a role..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addJobRole(roleInput))}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => addJobRole(roleInput)}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {jobRoleOptions.filter(r => !formData.preferredJobRoles.includes(r)).slice(0, 5).map(role => (
                  <Badge key={role} variant="outline" className="text-[10px] cursor-pointer hover:bg-primary/10" onClick={() => addJobRole(role)}>
                    + {role}
                  </Badge>
                ))}
              </div>
              {formData.preferredJobRoles.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.preferredJobRoles.map(role => (
                    <Badge key={role} variant="secondary" className="text-xs gap-1">
                      {role}
                      <X className="w-2 h-2 cursor-pointer" onClick={() => removeJobRole(role)} />
                    </Badge>
                  ))}
                </div>
              )}
              {errors.preferredJobRoles && <p className="text-[10px] text-destructive mt-0.5">{errors.preferredJobRoles}</p>}
            </div>

            {/* Years of Experience */}
            <div>
              <Label htmlFor="experience" className="text-xs">Years of Experience *</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                max={50}
                step={0.5}
                value={formData.yearsOfExperience || ''}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) || 0 })}
                placeholder="5"
                className={errors.yearsOfExperience ? 'border-destructive' : ''}
              />
              {errors.yearsOfExperience && <p className="text-[10px] text-destructive mt-0.5">{errors.yearsOfExperience}</p>}
            </div>
          </div>

          {/* Section 3: Skills & Resume */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-1">Skills & Resume</h3>
            
            {/* Primary Skills */}
            <div>
              <Label className="text-xs">Primary Skills *</Label>
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
                  <Badge key={skill} variant="outline" className="text-[10px] cursor-pointer hover:bg-primary/10" onClick={() => addSkill(skill)}>
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

            {/* Secondary Skills */}
            <div>
              <Label className="text-xs">Secondary Skills (Optional)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={secondarySkillInput}
                  onChange={(e) => setSecondarySkillInput(e.target.value)}
                  placeholder="Add a secondary skill..."
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

            {/* Resume Upload */}
            <div>
              <Label className="text-xs">Resume Upload</Label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <div 
                className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && fileInputRef.current) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInputRef.current.files = dataTransfer.files;
                    handleFileChange({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
              >
                {formData.resumeFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground">{formData.resumeFile.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, resumeFile: undefined }); }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Drag & drop or click to upload</p>
                    <p className="text-[10px] text-muted-foreground">PDF, DOC, DOCX (max 5MB)</p>
                  </div>
                )}
              </div>
              <Button variant="link" size="sm" className="text-xs text-muted-foreground p-0 h-auto mt-1">
                Upload Later
              </Button>
            </div>
          </div>

          {/* Section 4: Additional Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-1">Additional Information</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Notice Period</Label>
                <Select value={formData.noticePeriod} onValueChange={(v) => setFormData({ ...formData, noticePeriod: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {noticePeriodOptions.map(np => (
                      <SelectItem key={np} value={np}>{np}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentCompany" className="text-xs">Current Company</Label>
                <Input
                  id="currentCompany"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                  placeholder="Tech Corp Inc."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="linkedin" className="text-xs">LinkedIn Profile (Optional)</Label>
              <Input
                id="linkedin"
                value={formData.linkedinProfile}
                onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
                placeholder="https://linkedin.com/in/johndoe"
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