import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useActivityLogger } from '@/hooks/useUserRole';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  onSuccess?: () => void;
}

interface UserFormData {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  department: string;
  notes: string;
  can_view_analytics: boolean;
}

export function EditUserModal({ open, onOpenChange, userId, onSuccess }: EditUserModalProps) {
  const { user } = useAuth();
  const { logActivity } = useActivityLogger();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    department: '',
    notes: '',
    can_view_analytics: false,
  });

  useEffect(() => {
    if (open && userId) {
      fetchUser();
    }
  }, [open, userId]);

  const fetchUser = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setFormData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        company_name: data.company_name || '',
        department: data.department || '',
        notes: data.notes || '',
        can_view_analytics: data.can_view_analytics || false,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          company_name: formData.company_name,
          department: formData.department,
          notes: formData.notes,
          can_view_analytics: formData.can_view_analytics,
          analytics_access_granted_by: formData.can_view_analytics ? user?.id : null,
          analytics_access_granted_at: formData.can_view_analytics ? new Date().toISOString() : null,
        })
        .eq('user_id', userId);

      if (error) throw error;

      await logActivity('updated_user', 'user', userId, {
        updated_fields: Object.keys(formData),
      });

      toast.success('User updated successfully');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="Company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="Department"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add notes about this user..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="analytics_access" className="font-medium">
                  Analytics Access
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow user to view analytics dashboard
                </p>
              </div>
              <Switch
                id="analytics_access"
                checked={formData.can_view_analytics}
                onCheckedChange={(checked) => handleChange('can_view_analytics', checked)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
