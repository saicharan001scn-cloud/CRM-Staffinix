import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  key: string;
  createdAt: string;
  expiresAt: string;
  lastUsed?: string;
  description: string;
  status: 'active' | 'expiring' | 'expired';
}

const mockApiKeys: ApiKey[] = [
  { 
    id: '1', 
    name: 'LinkedIn API Key', 
    service: 'LinkedIn', 
    key: 'sk_live_abc123def456ghi789jkl012mno345', 
    createdAt: '2024-01-01', 
    expiresAt: '2024-04-01',
    lastUsed: '2024-01-15 10:30 AM',
    description: 'Production key for LinkedIn integration',
    status: 'active'
  },
  { 
    id: '2', 
    name: 'Dice API Key', 
    service: 'Dice', 
    key: 'dice_prod_xyz789abc456def123ghi890', 
    createdAt: '2024-01-05', 
    expiresAt: '2024-02-05',
    lastUsed: '2024-01-14 03:45 PM',
    description: 'Dice job board API access',
    status: 'expiring'
  },
  { 
    id: '3', 
    name: 'SendGrid API Key', 
    service: 'Email', 
    key: 'SG.abcdefghijklmnopqrstuvwxyz123456', 
    createdAt: '2023-12-15', 
    expiresAt: '2024-06-15',
    lastUsed: '2024-01-15 11:00 AM',
    description: 'Email service for notifications',
    status: 'active'
  },
  { 
    id: '4', 
    name: 'Indeed API Key', 
    service: 'Indeed', 
    key: 'indeed_api_oldkey123456789', 
    createdAt: '2023-10-01', 
    expiresAt: '2024-01-01',
    description: 'Indeed job posting integration',
    status: 'expired'
  },
];

const serviceOptions = ['LinkedIn', 'Dice', 'Indeed', 'Monster', 'Email', 'Calendar', 'Storage', 'Custom'];

export default function ApiKeysManagement() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    service: '',
    description: '',
    expiresAt: ''
  });

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const maskKey = (key: string) => {
    return key.slice(0, 8) + '••••••••••••' + key.slice(-4);
  };

  const handleRevoke = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast.success('API key revoked');
  };

  const handleRegenerate = (id: string) => {
    const newKeyValue = 'sk_new_' + Math.random().toString(36).substring(2, 30);
    setApiKeys(prev => prev.map(k => 
      k.id === id 
        ? { ...k, key: newKeyValue, createdAt: new Date().toISOString().split('T')[0] }
        : k
    ));
    toast.success('API key regenerated', { description: 'Please update your integration.' });
  };

  const handleAddKey = () => {
    if (!newKey.name || !newKey.service) {
      toast.error('Please fill in required fields');
      return;
    }
    
    const generatedKey = `${newKey.service.toLowerCase()}_${Math.random().toString(36).substring(2, 30)}`;
    const newApiKey: ApiKey = {
      id: String(apiKeys.length + 1),
      name: newKey.name,
      service: newKey.service,
      key: generatedKey,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: newKey.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: newKey.description,
      status: 'active'
    };
    
    setApiKeys([newApiKey, ...apiKeys]);
    setIsAddOpen(false);
    setNewKey({ name: '', service: '', description: '', expiresAt: '' });
    toast.success('API key generated!', { description: 'Make sure to copy and save it securely.' });
  };

  const getStatusBadge = (status: ApiKey['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success border-success/30 gap-1"><CheckCircle className="w-3 h-3" />Active</Badge>;
      case 'expiring':
        return <Badge className="bg-warning/20 text-warning border-warning/30 gap-1"><AlertTriangle className="w-3 h-3" />Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Expired</Badge>;
    }
  };

  return (
    <MainLayout
      title="API Keys & Access Tokens"
      subtitle="Manage API keys for external integrations"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Keep your API keys secure. Never share them publicly.</span>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add New API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="keyName" className="text-xs">Key Name *</Label>
                  <Input
                    id="keyName"
                    value={newKey.name}
                    onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                    placeholder="e.g., Production LinkedIn Key"
                  />
                </div>
                <div>
                  <Label className="text-xs">Service *</Label>
                  <Select value={newKey.service} onValueChange={(v) => setNewKey({ ...newKey, service: v })}>
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
                  <Label htmlFor="description" className="text-xs">Description</Label>
                  <Textarea
                    id="description"
                    value={newKey.description}
                    onChange={(e) => setNewKey({ ...newKey, description: e.target.value })}
                    placeholder="What is this key used for?"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="expiresAt" className="text-xs">Expiry Date</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={newKey.expiresAt}
                    onChange={(e) => setNewKey({ ...newKey, expiresAt: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Leave empty for 90-day default</p>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddKey} className="gap-1">
                    <Key className="w-3 h-3" />
                    Generate Key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total Keys</p>
            <p className="text-2xl font-bold text-foreground">{apiKeys.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success">{apiKeys.filter(k => k.status === 'active').length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Expiring Soon</p>
            <p className="text-2xl font-bold text-warning">{apiKeys.filter(k => k.status === 'expiring').length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Expired</p>
            <p className="text-2xl font-bold text-destructive">{apiKeys.filter(k => k.status === 'expired').length}</p>
          </Card>
        </div>

        {/* API Keys List */}
        <div className="space-y-3">
          {apiKeys.map(apiKey => (
            <Card key={apiKey.id} className={`p-4 ${apiKey.status === 'expired' ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Key className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground">{apiKey.name}</h4>
                      {getStatusBadge(apiKey.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{apiKey.description}</p>
                    
                    {/* Key Display */}
                    <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded-lg font-mono text-xs">
                      <span className="text-muted-foreground">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
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
                        onClick={() => copyKey(apiKey.key)}
                      >
                        <Copy className="w-3 h-3" />
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
                      {apiKey.lastUsed && (
                        <span>Last used: {apiKey.lastUsed}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs gap-1"
                    onClick={() => handleRegenerate(apiKey.id)}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-destructive hover:text-destructive gap-1"
                    onClick={() => handleRevoke(apiKey.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Revoke
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
