import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Bell, Link2, Key, Webhook, Eye, EyeOff, Copy, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';
import { ApiKeysSection } from '@/components/admin/ApiKeysSection';
import { WebhooksSection } from '@/components/admin/WebhooksSection';

type Theme = 'light' | 'dark' | 'system';

// Mock data for profile
const mockProfile = {
  fullName: 'Admin User',
  email: 'admin@staffinix.com',
  role: 'Administrator',
  phone: '+1 (555) 123-4567'
};

// Mock data for integrations
const mockIntegrations = [
  { id: '1', name: 'SendGrid', status: 'connected' as const },
  { id: '2', name: 'Dice API', status: 'connected' as const },
  { id: '3', name: 'LinkedIn', status: 'pending' as const },
  { id: '4', name: 'MongoDB', status: 'connected' as const },
];

// Mock data for API keys
const mockApiKeys = [
  { id: '1', name: 'Production Key', key: 'sk_live_xxxxxxxxxxxxxxxxxxxx' },
  { id: '2', name: 'Test Key', key: 'sk_test_xxxxxxxxxxxxxxxxxxxx' },
];

// Mock notification preferences
const mockNotifications = [
  { id: '1', label: 'New job requirement alerts', description: 'Get notified when new jobs match your criteria', enabled: true },
  { id: '2', label: 'Submission status updates', description: 'Updates when candidate submission status changes', enabled: true },
  { id: '3', label: 'Interview reminders', description: 'Get reminders before scheduled interviews', enabled: true },
  { id: '4', label: 'Weekly performance reports', description: 'Receive weekly analytics and performance summary', enabled: false },
];

export default function Settings() {
  const { isAdmin, isSuperAdmin } = useUserRole();
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'dark';
  });
  const [activeTab, setActiveTab] = useState('profile');

  // Show back button only for super admins
  const showBackButton = isSuperAdmin;

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

  return (
    <MainLayout 
      title="Settings" 
      subtitle="Manage your account and preferences" 
      showBackButton={showBackButton} 
      hideGlobalSearch={false}
    >
      {/* Tabs for admins to access API Keys & Webhooks management */}
      {isAdmin && !isSuperAdmin ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex bg-card/50 border border-border">
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Webhook className="w-4 h-4" />
              <span className="hidden sm:inline">Webhooks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <SettingsGrid />
          </TabsContent>

          <TabsContent value="api-keys">
            <ApiKeysSection />
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhooksSection />
          </TabsContent>
        </Tabs>
      ) : (
        <SettingsGrid />
      )}
    </MainLayout>
  );
}

function SettingsGrid() {
  const [profile, setProfile] = useState(mockProfile);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
    toast.success('Notification preference updated');
  };

  const handleSaveProfile = () => {
    toast.success('Profile settings saved successfully');
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusBadge = (status: 'connected' | 'pending' | 'disconnected') => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-success/20 text-success border-success/30 text-xs">Connected</Badge>;
      case 'pending':
        return <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">Pending</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="text-muted-foreground text-xs">Disconnected</Badge>;
    }
  };

  const maskKey = (key: string, visible: boolean) => {
    if (visible) return key;
    const prefix = key.substring(0, 7);
    const suffix = key.substring(key.length - 4);
    return `${prefix}${'•'.repeat(12)}${suffix}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Profile Settings Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <Input 
                  value={profile.fullName}
                  onChange={(e) => handleProfileChange('fullName', e.target.value)}
                  className="bg-muted/50 border-border/50 focus:border-primary h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <Input 
                  value={profile.email}
                  className="bg-muted/50 border-border/50 h-10 text-muted-foreground cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <Input 
                  value={profile.role}
                  className="bg-muted/50 border-border/50 h-10 text-muted-foreground cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <Input 
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="bg-muted/50 border-border/50 focus:border-primary h-10"
                />
              </div>
            </div>
            <Button 
              onClick={handleSaveProfile}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
                <Switch 
                  checked={item.enabled}
                  onCheckedChange={() => handleNotificationToggle(item.id)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Integrations Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockIntegrations.map((integration) => (
              <div 
                key={integration.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{integration.name}</span>
                </div>
                {getStatusBadge(integration.status)}
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-4 border-border/50 hover:bg-muted/50"
            >
              Manage Integrations
            </Button>
          </CardContent>
        </Card>

        {/* API Keys Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Key className="w-5 h-5 text-primary" />
              </div>
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockApiKeys.map((apiKey) => (
              <div 
                key={apiKey.id}
                className="p-4 bg-muted/30 rounded-lg border border-border/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{apiKey.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyKey(apiKey.key, apiKey.id)}
                    >
                      {copiedKey === apiKey.id ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <code className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded block overflow-hidden text-ellipsis">
                  {maskKey(apiKey.key, visibleKeys.has(apiKey.id))}
                </code>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-4 border-border/50 hover:bg-muted/50"
            >
              Manage API Keys
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
