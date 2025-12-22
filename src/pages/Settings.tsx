import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Link2, 
  Mail, 
  Database,
  Key,
  Globe,
  Zap,
  ChevronRight
} from 'lucide-react';

const integrations = [
  { name: 'SendGrid', status: 'connected', icon: Mail },
  { name: 'Dice API', status: 'connected', icon: Globe },
  { name: 'LinkedIn', status: 'pending', icon: Link2 },
  { name: 'MongoDB', status: 'connected', icon: Database },
];

export default function Settings() {
  const navigate = useNavigate();

  return (
    <MainLayout
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="col-span-2 space-y-4">
          {/* Profile */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Profile Settings
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                <Input defaultValue="Admin User" className="bg-muted border-0 h-8 text-xs" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <Input defaultValue="admin@staffinix.com" className="bg-muted border-0 h-8 text-xs" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Role</label>
                <Input defaultValue="Administrator" className="bg-muted border-0 h-8 text-xs" disabled />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                <Input defaultValue="+1 (555) 123-4567" className="bg-muted border-0 h-8 text-xs" />
              </div>
            </div>
            <Button size="sm" className="mt-3 h-7 text-xs">Save Changes</Button>
          </Card>

          {/* Notifications */}
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
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </div>
          </Card>

          {/* Security */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Security
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-[10px] text-muted-foreground">Add extra security</p>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-xs">Enable</Button>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-foreground">Change Password</p>
                  <p className="text-[10px] text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-xs">Update</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Integrations - Now Clickable */}
          <Card 
            className="p-4 cursor-pointer hover:border-primary/50 transition-colors group"
            onClick={() => navigate('/settings/integrations')}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Integrations
              </h3>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="space-y-2">
              {integrations.map((integration) => (
                <div 
                  key={integration.name}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <integration.icon className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground">{integration.name}</span>
                  </div>
                  <Badge 
                    variant={integration.status === 'connected' ? 'default' : 'secondary'}
                    className={`text-[10px] ${integration.status === 'connected' ? 'bg-success/20 text-success' : ''}`}
                  >
                    {integration.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 h-7 text-xs">
              Manage Integrations
            </Button>
          </Card>

          {/* API Keys - Now Clickable */}
          <Card 
            className="p-4 cursor-pointer hover:border-primary/50 transition-colors group"
            onClick={() => navigate('/settings/api-keys')}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                API Keys
              </h3>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs font-medium text-foreground">Production Key</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">sk_live_••••••••4x2k</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs font-medium text-foreground">Test Key</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">sk_test_••••••••8y3m</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 h-7 text-xs">
              Manage API Keys
            </Button>
          </Card>

          {/* Theme */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              Appearance
            </h3>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <span className="text-xs font-medium text-foreground">Dark Mode</span>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
