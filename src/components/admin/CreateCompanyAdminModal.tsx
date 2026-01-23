import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Eye, EyeOff, Copy, RefreshCw, Building2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const createCompanyAdminSchema = z.object({
  company_id: z.string().min(1, 'Please select a company'),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

interface Company {
  id: string;
  company_name: string;
  status: string;
}

interface CreateCompanyAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCompanyAdminModal({ open, onOpenChange, onSuccess }: CreateCompanyAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  
  const [formData, setFormData] = useState({
    company_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch companies on modal open
  useEffect(() => {
    if (open) {
      fetchCompanies();
    }
  }, [open]);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const { data, error } = await supabase
        .from('company_subscriptions')
        .select('id, company_name, status')
        .order('company_name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      toast.error('Failed to load companies');
    } finally {
      setLoadingCompanies(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(formData.password);
    toast.success('Password copied to clipboard');
  };

  const resetForm = () => {
    setFormData({
      company_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = createCompanyAdminSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const full_name = `${formData.first_name} ${formData.last_name}`.trim();
      const selectedCompany = companies.find(c => c.id === formData.company_id);

      // Call edge function to create user
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: formData.email,
          password: formData.password,
          full_name,
          role: 'admin',
          company_name: selectedCompany?.company_name,
          phone: formData.phone || undefined,
        },
      });

      if (error) throw error;

      // Update the company subscription with the new admin
      if (data?.user?.id && selectedCompany) {
        await supabase
          .from('company_subscriptions')
          .update({ admin_user_id: data.user.id })
          .eq('id', formData.company_id);
      }

      // Send welcome email if enabled
      if (sendWelcomeEmail && data?.user?.id) {
        const loginUrl = `${window.location.origin}/login`;
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: formData.email,
            full_name,
            temp_password: formData.password,
            login_url: loginUrl,
          },
        });
      }

      toast.success('Company admin created successfully');
      onSuccess();
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating company admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create company admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create New Company Admin</DialogTitle>
              <DialogDescription>
                Add a new administrator for a company
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Selection */}
          <div className="space-y-2">
            <Label htmlFor="company_id">Company *</Label>
            <Select
              value={formData.company_id}
              onValueChange={(v) => setFormData(prev => ({ ...prev, company_id: v }))}
              disabled={loadingCompanies}
            >
              <SelectTrigger className={errors.company_id ? 'border-destructive' : ''}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={loadingCompanies ? "Loading companies..." : "Select a company"} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    <div className="flex items-center gap-2">
                      <span>{company.company_name}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        ({company.status})
                      </span>
                    </div>
                  </SelectItem>
                ))}
                {companies.length === 0 && !loadingCompanies && (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No companies found
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.company_id && <p className="text-xs text-destructive">{errors.company_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="John"
                className={errors.first_name ? 'border-destructive' : ''}
              />
              {errors.first_name && <p className="text-xs text-destructive">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Doe"
                className={errors.last_name ? 'border-destructive' : ''}
              />
              {errors.last_name && <p className="text-xs text-destructive">{errors.last_name}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john@company.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Initial Password *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  className={`pr-20 ${errors.password ? 'border-destructive' : ''}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={copyPassword}
                    disabled={!formData.password}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button type="button" variant="outline" onClick={generatePassword} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Generate
              </Button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          {/* Send Welcome Email */}
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="sendWelcomeEmail"
              checked={sendWelcomeEmail}
              onCheckedChange={(checked) => setSendWelcomeEmail(checked as boolean)}
            />
            <Label htmlFor="sendWelcomeEmail" className="text-sm font-normal cursor-pointer">
              Send welcome email with login credentials
            </Label>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Admin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
