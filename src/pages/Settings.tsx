import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, Bell, Link2, Key, Webhook, Eye, EyeOff, Copy, Check,
  Plus, RefreshCw, Trash2, Settings as SettingsIcon, CheckCircle, XCircle, ExternalLink,
  AlertTriangle, Calendar, Shield
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
const initialIntegrations = [
  { id: '1', name: 'SendGrid', status: 'connected' as const, category: 'Email', description: 'Email service for notifications' },
  { id: '2', name: 'Dice API', status: 'connected' as const, category: 'Job Boards', description: 'Sync job postings with Dice.com' },
  { id: '3', name: 'LinkedIn', status: 'pending' as const, category: 'Job Boards', description: 'Import jobs and candidates' },
  { id: '4', name: 'MongoDB', status: 'connected' as const, category: 'Storage', description: 'Database connection for CRM data' },
];

// Mock data for API keys
const initialApiKeys = [
  { id: '1', name: 'Production Key', key: 'sk_live_xxxxxxxxxxxxxxxxxxxx', service: 'LinkedIn', status: 'active' as const, createdAt: '2024-01-01', expiresAt: '2024-04-01' },
  { id: '2', name: 'Test Key', key: 'sk_test_xxxxxxxxxxxxxxxxxxxx', service: 'Dice', status: 'active' as const, createdAt: '2024-01-05', expiresAt: '2024-07-05' },
];

// Mock notification preferences
const mockNotifications = [
  { id: '1', label: 'New job requirement alerts', description: 'Get notified when new jobs match your criteria', enabled: true },
  { id: '2', label: 'Submission status updates', description: 'Updates when candidate submission status changes', enabled: true },
  { id: '3', label: 'Interview reminders', description: 'Get reminders before scheduled interviews', enabled: true },
  { id: '4', label: 'Weekly performance reports', description: 'Receive weekly analytics and performance summary', enabled: false },
];

const serviceOptions = ['LinkedIn', 'Dice', 'Indeed', 'Monster', 'SendGrid', 'Gmail', 'Custom'];

export default function Settings() {
  const { isAdmin, isSuperAdmin } = useUserRole();
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'dark';
  });
  const [activeTab, setActiveTab] = useState('profile');

  // Hide back button for admins and super admins
  const showBackButton = !isAdmin && !isSuperAdmin;

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
      hideGlobalSearch={isAdmin || isSuperAdmin}
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

interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'pending' | 'disconnected';
  category: string;
  description: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  status: 'active' | 'expiring' | 'expired';
  createdAt: string;
  expiresAt: string;
}

function SettingsGrid() {
  const [profile, setProfile] = useState(mockProfile);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Modal states
  const [integrationsModalOpen, setIntegrationsModalOpen] = useState(false);
  const [apiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [addIntegrationOpen, setAddIntegrationOpen] = useState(false);
  const [addApiKeyOpen, setAddApiKeyOpen] = useState(false);
  
  // Form states
  const [newIntegration, setNewIntegration] = useState({ name: '', category: '', description: '' });
  const [newApiKey, setNewApiKey] = useState({ name: '', service: '', description: '', expiresAt: '' });
  const [isTesting, setIsTesting] = useState<string | null>(null);

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

  // Integration handlers
  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'connected' as const } : i
    ));
    toast.success('Integration connected!');
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'disconnected' as const } : i
    ));
    toast.success('Integration disconnected');
  };

  const handleTestConnection = async (id: string) => {
    setIsTesting(id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTesting(null);
    toast.success('Connection test successful!');
  };

  const handleAddIntegration = () => {
    if (!newIntegration.name || !newIntegration.category) {
      toast.error('Please fill in required fields');
      return;
    }
    const newInt: Integration = {
      id: String(Date.now()),
      name: newIntegration.name,
      category: newIntegration.category,
      description: newIntegration.description || `${newIntegration.name} integration`,
      status: 'disconnected'
    };
    setIntegrations([...integrations, newInt]);
    setNewIntegration({ name: '', category: '', description: '' });
    setAddIntegrationOpen(false);
    toast.success('Integration added successfully');
  };

  const handleDeleteIntegration = (id: string) => {
    setIntegrations(prev => prev.filter(i => i.id !== id));
    toast.success('Integration removed');
  };

  // API Key handlers
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

  const maskKey = (key: string, visible: boolean) => {
    if (visible) return key;
    const prefix = key.substring(0, 7);
    const suffix = key.substring(key.length - 4);
    return `${prefix}${'•'.repeat(12)}${suffix}`;
  };

  const handleAddApiKey = () => {
    if (!newApiKey.name || !newApiKey.service) {
      toast.error('Please fill in required fields');
      return;
    }
    const generatedKey = `sk_${newApiKey.service.toLowerCase()}_${Math.random().toString(36).substring(2, 26)}`;
    const newKey: ApiKey = {
      id: String(Date.now()),
      name: newApiKey.name,
      key: generatedKey,
      service: newApiKey.service,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: newApiKey.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewApiKey({ name: '', service: '', description: '', expiresAt: '' });
    setAddApiKeyOpen(false);
    toast.success('API key generated! Make sure to copy and save it securely.');
  };

  const handleRegenerateKey = (id: string) => {
    const newKeyValue = 'sk_new_' + Math.random().toString(36).substring(2, 26);
    setApiKeys(prev => prev.map(k => 
      k.id === id ? { ...k, key: newKeyValue, createdAt: new Date().toISOString().split('T')[0] } : k
    ));
    toast.success('API key regenerated');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast.success('API key revoked');
  };

  const getIntegrationStatusBadge = (status: 'connected' | 'pending' | 'disconnected') => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-success/20 text-success border-success/30 text-xs gap-1"><CheckCircle className="w-3 h-3" />Connected</Badge>;
      case 'pending':
        return <Badge className="bg-warning/20 text-warning border-warning/30 text-xs gap-1"><RefreshCw className="w-3 h-3" />Pending</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="text-muted-foreground text-xs gap-1"><XCircle className="w-3 h-3" />Disconnected</Badge>;
    }
  };

  const getApiKeyStatusBadge = (status: 'active' | 'expiring' | 'expired') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success border-success/30 text-xs gap-1"><CheckCircle className="w-3 h-3" />Active</Badge>;
      case 'expiring':
        return <Badge className="bg-warning/20 text-warning border-warning/30 text-xs gap-1"><AlertTriangle className="w-3 h-3" />Expiring</Badge>;
      case 'expired':
        return <Badge variant="destructive" className="text-xs gap-1"><AlertTriangle className="w-3 h-3" />Expired</Badge>;
    }
  };

  return (
    <>
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
              {integrations.slice(0, 4).map((integration) => (
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
                  {getIntegrationStatusBadge(integration.status)}
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-4 border-border/50 hover:bg-muted/50"
                onClick={() => setIntegrationsModalOpen(true)}
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
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
              {apiKeys.slice(0, 2).map((apiKey) => (
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
                onClick={() => setApiKeysModalOpen(true)}
              >
                <Key className="w-4 h-4 mr-2" />
                Manage API Keys
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manage Integrations Modal */}
      <Dialog open={integrationsModalOpen} onOpenChange={setIntegrationsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Manage Integrations
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">{integrations.length}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Connected</p>
                <p className="text-xl font-bold text-success">{integrations.filter(i => i.status === 'connected').length}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-warning">{integrations.filter(i => i.status === 'pending').length}</p>
              </div>
            </div>

            {/* Add Integration Button */}
            <Button onClick={() => setAddIntegrationOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Integration
            </Button>

            {/* Integrations List */}
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div key={integration.id} className="p-4 bg-muted/30 rounded-lg border border-border/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Link2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-foreground">{integration.name}</h4>
                          {getIntegrationStatusBadge(integration.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Category: {integration.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs gap-1"
                            onClick={() => handleTestConnection(integration.id)}
                            disabled={isTesting === integration.id}
                          >
                            {isTesting === integration.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            Test
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            className="h-7 text-xs gap-1"
                            onClick={() => handleConnect(integration.id)}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Connect
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDeleteIntegration(integration.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Integration Modal */}
      <Dialog open={addIntegrationOpen} onOpenChange={setAddIntegrationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Integration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs">Integration Name *</Label>
              <Input
                value={newIntegration.name}
                onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                placeholder="e.g., Slack, Zoom, HubSpot"
              />
            </div>
            <div>
              <Label className="text-xs">Category *</Label>
              <Select value={newIntegration.category} onValueChange={(v) => setNewIntegration({ ...newIntegration, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Job Boards">Job Boards</SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="Calendar">Calendar</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={newIntegration.description}
                onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })}
                placeholder="What does this integration do?"
                rows={2}
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setAddIntegrationOpen(false)}>Cancel</Button>
              <Button onClick={handleAddIntegration} className="gap-1">
                <Plus className="w-3 h-3" />
                Add Integration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage API Keys Modal */}
      <Dialog open={apiKeysModalOpen} onOpenChange={setApiKeysModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Manage API Keys
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg border border-border/30">
              <Shield className="w-4 h-4" />
              <span>Keep your API keys secure. Never share them publicly.</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Total Keys</p>
                <p className="text-xl font-bold text-foreground">{apiKeys.length}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-success">{apiKeys.filter(k => k.status === 'active').length}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Expired</p>
                <p className="text-xl font-bold text-destructive">{apiKeys.filter(k => k.status === 'expired').length}</p>
              </div>
            </div>

            {/* Add API Key Button */}
            <Button onClick={() => setAddApiKeyOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Generate New API Key
            </Button>

            {/* API Keys List */}
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 bg-muted/30 rounded-lg border border-border/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Key className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-foreground">{apiKey.name}</h4>
                          {getApiKeyStatusBadge(apiKey.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">Service: {apiKey.service}</p>
                        
                        {/* Key Display */}
                        <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded-lg font-mono text-xs">
                          <span className="text-muted-foreground">
                            {maskKey(apiKey.key, visibleKeys.has(apiKey.id))}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {visibleKeys.has(apiKey.id) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => copyKey(apiKey.key, apiKey.id)}
                          >
                            {copiedKey === apiKey.id ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created: {apiKey.createdAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expires: {apiKey.expiresAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs gap-1"
                        onClick={() => handleRegenerateKey(apiKey.id)}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Regenerate
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs text-destructive hover:text-destructive gap-1"
                        onClick={() => handleRevokeKey(apiKey.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add API Key Modal */}
      <Dialog open={addApiKeyOpen} onOpenChange={setAddApiKeyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs">Key Name *</Label>
              <Input
                value={newApiKey.name}
                onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                placeholder="e.g., Production LinkedIn Key"
              />
            </div>
            <div>
              <Label className="text-xs">Service *</Label>
              <Select value={newApiKey.service} onValueChange={(v) => setNewApiKey({ ...newApiKey, service: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service..." />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={newApiKey.description}
                onChange={(e) => setNewApiKey({ ...newApiKey, description: e.target.value })}
                placeholder="What is this key used for?"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs">Expiry Date</Label>
              <Input
                type="date"
                value={newApiKey.expiresAt}
                onChange={(e) => setNewApiKey({ ...newApiKey, expiresAt: e.target.value })}
              />
              <p className="text-[10px] text-muted-foreground mt-1">Leave empty for 90-day default</p>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setAddApiKeyOpen(false)}>Cancel</Button>
              <Button onClick={handleAddApiKey} className="gap-1">
                <Key className="w-3 h-3" />
                Generate Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
