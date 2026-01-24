import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Eye, EyeOff, Copy, RefreshCw, Info, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import type { AppRole } from '@/types/admin';

const createUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['super_admin', 'admin', 'user']),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  notes: z.string().optional(),
  can_view_analytics: z.boolean().optional(),
});

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateUserModal({ open, onOpenChange, onSuccess }: CreateUserModalProps) {
  const { session, user } = useAuth();
  const { isSuperAdmin, canCreateSuperAdmin, canCreateAdmin, canCreateUser } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user' as AppRole,
    company_name: '',
    phone: '',
    department: '',
    notes: '',
    can_view_analytics: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get available roles based on permissions
  const getAvailableRoles = (): { value: AppRole; label: string; disabled: boolean }[] => {
    return [
      { value: 'user', label: 'User', disabled: !canCreateUser },
      { value: 'admin', label: 'Admin', disabled: !canCreateAdmin },
      { value: 'super_admin', label: 'Super Admin', disabled: !canCreateSuperAdmin },
    ];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate role permissions
    if (formData.role === 'super_admin' && !canCreateSuperAdmin) {
      toast.error("You don't have permission to create Super Admins");
      return;
    }

    if (formData.role === 'admin' && !canCreateAdmin) {
      toast.error("You don't have permission to create Admins");
      return;
    }

    // Validate form
    const result = createUserSchema.safeParse(formData);
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
      // Call edge function to create user
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          ...formData,
          created_by: user?.id, // Track who created this user
        },
      });

      if (error) throw error;

      // Send welcome email if enabled
      if (sendWelcomeEmail && data?.user?.id) {
        const loginUrl = `${window.location.origin}/login`;
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: formData.email,
            full_name: formData.full_name,
            temp_password: formData.password,
            login_url: loginUrl,
          },
        });
      }

      toast.success('User created successfully');
      onSuccess();
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'user',
        company_name: '',
        phone: '',
        department: '',
        notes: '',
        can_view_analytics: false,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = getAvailableRoles();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none border-none flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl">Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will receive login credentials via email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="John Doe"
                className={errors.full_name ? 'border-destructive' : ''}
              />
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            {/* Role */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="role">Role *</Label>
                {!isSuperAdmin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">You can only create users with roles equal or below your own</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData(prev => ({ ...prev, role: v as AppRole }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => (
                    <SelectItem 
                      key={role.value} 
                      value={role.value}
                      disabled={role.disabled}
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Sales, HR, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="Acme Inc."
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this user..."
              rows={2}
            />
          </div>

          {/* Analytics Access */}
          <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <Label htmlFor="can_view_analytics" className="font-medium cursor-pointer">
                  Analytics Access
                </Label>
                <p className="text-xs text-muted-foreground">
                  {formData.role === 'admin' || formData.role === 'super_admin' 
                    ? 'Admins automatically have analytics access'
                    : 'Allow this user to view analytics dashboard'}
                </p>
              </div>
            </div>
            <Switch
              id="can_view_analytics"
              checked={formData.role === 'admin' || formData.role === 'super_admin' || formData.can_view_analytics}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, can_view_analytics: checked }))}
              disabled={formData.role === 'admin' || formData.role === 'super_admin'}
            />
          </div>

          {/* Send Welcome Email */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendWelcomeEmail"
              checked={sendWelcomeEmail}
              onCheckedChange={(checked) => setSendWelcomeEmail(checked as boolean)}
            />
            <Label htmlFor="sendWelcomeEmail" className="text-sm font-normal">
              Send welcome email with login credentials
            </Label>
          </div>

          <div className="sticky bottom-0 bg-background border-t p-6 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
