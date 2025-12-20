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
  Zap
} from 'lucide-react';

const integrations = [
  { name: 'SendGrid', status: 'connected', icon: Mail },
  { name: 'Dice API', status: 'connected', icon: Globe },
  { name: 'LinkedIn', status: 'pending', icon: Link2 },
  { name: 'MongoDB', status: 'connected', icon: Database },
];

export default function Settings() {
  return (
    <MainLayout
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Profile */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                <Input defaultValue="Admin User" className="bg-muted border-0" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input defaultValue="admin@staffinix.com" className="bg-muted border-0" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Role</label>
                <Input defaultValue="Administrator" className="bg-muted border-0" disabled />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
                <Input defaultValue="+1 (555) 123-4567" className="bg-muted border-0" />
              </div>
            </div>
            <Button className="mt-4">Save Changes</Button>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { label: 'New job requirement alerts', description: 'Get notified when new jobs match your consultants', enabled: true },
                { label: 'Submission status updates', description: 'Updates when submission status changes', enabled: true },
                { label: 'Interview reminders', description: 'Reminders before scheduled interviews', enabled: true },
                { label: 'Weekly performance reports', description: 'Receive weekly analytics summary', enabled: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Change Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Integrations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Integrations
            </h3>
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div 
                  key={integration.name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <integration.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{integration.name}</span>
                  </div>
                  <Badge 
                    variant={integration.status === 'connected' ? 'default' : 'secondary'}
                    className={integration.status === 'connected' ? 'bg-success/20 text-success' : ''}
                  >
                    {integration.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage Integrations
            </Button>
          </Card>

          {/* API Keys */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Keys
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium text-foreground">Production Key</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">sk_live_••••••••••••4x2k</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium text-foreground">Test Key</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">sk_test_••••••••••••8y3m</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Generate New Key
            </Button>
          </Card>

          {/* Theme */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Appearance
            </h3>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="font-medium text-foreground">Dark Mode</span>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
