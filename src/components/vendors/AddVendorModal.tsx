import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface AddVendorModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (vendor: NewVendor) => void;
}

export interface NewVendor {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  vendorType: 'Primary' | 'Secondary' | 'Exclusive';
  notes: string;
}

const vendorTypes = ['Primary', 'Secondary', 'Exclusive'] as const;

export function AddVendorModal({ open, onClose, onAdd }: AddVendorModalProps) {
  const [formData, setFormData] = useState<NewVendor>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    vendorType: 'Primary',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd(formData);
    toast.success('Vendor added successfully!', {
      description: `${formData.companyName} has been added.`
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      location: '',
      vendorType: 'Primary',
      notes: '',
    });
    setErrors({});
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  return (
    <Dialog open={open} onOpenChange={() => { onClose(); resetForm(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add New Vendor</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Company Name */}
          <div>
            <Label htmlFor="companyName" className="text-xs">Vendor Company Name *</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Tech Solutions Inc."
              className={errors.companyName ? 'border-destructive' : ''}
            />
            {errors.companyName && <p className="text-[10px] text-destructive mt-0.5">{errors.companyName}</p>}
          </div>

          {/* Contact Person */}
          <div>
            <Label htmlFor="contactPerson" className="text-xs">Contact Person</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="John Smith"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@vendor.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-[10px] text-destructive mt-0.5">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <Label className="text-xs">Phone</Label>
            <div className="relative">
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

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-xs">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="New York, NY"
            />
          </div>

          {/* Vendor Type */}
          <div>
            <Label className="text-xs">Vendor Type</Label>
            <Select value={formData.vendorType} onValueChange={(v) => setFormData({ ...formData, vendorType: v as NewVendor['vendorType'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vendorTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-xs">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about the vendor..."
              rows={3}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => { onClose(); resetForm(); }}>
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-3 h-3 mr-1" />
            Add Vendor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
