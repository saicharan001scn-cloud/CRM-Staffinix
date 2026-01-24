import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  User, Bell, Shield, Palette, Sun, Moon, Monitor
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminOnly } from '@/components/layout/RoleBasedContent';

type Theme = 'light' | 'dark' | 'system';

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('light', !systemDark);
    } else {
      root.classList.toggle('light', theme === 'light');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  return (
    <MainLayout title="Settings" subtitle="Manage your account and preferences" showBackButton={false} hideGlobalSearch={true}>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Profile Settings
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">Full Name</label><Input defaultValue="Admin User" className="bg-muted border-0 h-8 text-xs" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Email</label><Input defaultValue="admin@staffinix.com" className="bg-muted border-0 h-8 text-xs" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Role</label><Input defaultValue="Administrator" className="bg-muted border-0 h-8 text-xs" disabled /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Phone</label><Input defaultValue="+1 (555) 123-4567" className="bg-muted border-0 h-8 text-xs" /></div>
            </div>
            <Button size="sm" className="mt-3 h-7 text-xs">Save Changes</Button>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Notification Preferences
            </h3>
            <div className="space-y-2">
              {[
                { label: 'New job requirement alerts', description: 'Get notified when new jobs match', enabled: true },
                { label: 'Submission status updates', description: 'Updates when status changes', enabled: true },
                { label: 'Interview reminders', description: 'Reminders before interviews', enabled: true },
                { label: 'Weekly performance reports', description: 'Receive weekly analytics', enabled: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div><p className="text-xs font-medium text-foreground">{item.label}</p><p className="text-[10px] text-muted-foreground">{item.description}</p></div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </div>
          </Card>

          <AdminOnly>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Security
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div><p className="text-xs font-medium text-foreground">Two-Factor Authentication</p><p className="text-[10px] text-muted-foreground">Add extra security</p></div>
                  <Button variant="outline" size="sm" className="h-6 text-xs">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div><p className="text-xs font-medium text-foreground">Change Password</p><p className="text-[10px] text-muted-foreground">Last changed 30 days ago</p></div>
                  <Button variant="outline" size="sm" className="h-6 text-xs">Update</Button>
                </div>
              </div>
            </Card>
          </AdminOnly>
        </div>

        <div className="space-y-4">
          {/* Theme Toggle - Working */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              Appearance
            </h3>
            <p className="text-xs text-muted-foreground mb-3">Theme Preference</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" className="h-9 text-xs gap-1.5" onClick={() => handleThemeChange('light')}>
                <Sun className="w-3.5 h-3.5" />Light
              </Button>
              <Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" className="h-9 text-xs gap-1.5" onClick={() => handleThemeChange('dark')}>
                <Moon className="w-3.5 h-3.5" />Dark
              </Button>
              <Button variant={theme === 'system' ? 'default' : 'outline'} size="sm" className="h-9 text-xs gap-1.5" onClick={() => handleThemeChange('system')}>
                <Monitor className="w-3.5 h-3.5" />System
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
