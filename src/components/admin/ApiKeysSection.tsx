import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  RefreshCw,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  service: string;
  description: string | null;
  scopes: string[];
  expires_at: string | null;
  last_used_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface AuditLog {
  id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

const serviceOptions = [
  { value: 'general', label: 'General API' },
  { value: 'crm', label: 'CRM Integration' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'reporting', label: 'Reporting API' },
];

const scopeOptions = [
  { value: 'read:consultants', label: 'Read Consultants' },
  { value: 'write:consultants', label: 'Write Consultants' },
  { value: 'read:jobs', label: 'Read Jobs' },
  { value: 'write:jobs', label: 'Write Jobs' },
  { value: 'read:submissions', label: 'Read Submissions' },
  { value: 'write:submissions', label: 'Write Submissions' },
];

export function ApiKeysSection() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [showFullKey, setShowFullKey] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    service: 'general',
    description: '',
    scopes: [] as string[],
    expiresIn: 'never',
  });

  const fetchApiKeys = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('admin_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (err) {
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('api_key_audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAuditLogs((data || []).map(log => ({
        ...log,
        details: (typeof log.details === 'object' && log.details !== null ? log.details : {}) as Record<string, unknown>
      })));
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  };

  useEffect(() => {
    fetchApiKeys();
    fetchAuditLogs();
  }, [user?.id]);

  const generateSecureKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const prefix = 'sk_live_';
    let key = prefix;
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const hashKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const logAuditAction = async (apiKeyId: string | null, action: string, details: object = {}) => {
    if (!user?.id) return;
    
    await supabase.from('api_key_audit_logs').insert([{
      api_key_id: apiKeyId,
      user_id: user.id,
      action,
      details: details as any,
      user_agent: navigator.userAgent,
    }]);
  };

  const handleCreateKey = async () => {
    if (!user?.id || !formData.name.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    try {
      const newKey = generateSecureKey();
      const keyHash = await hashKey(newKey);
      const keyPrefix = newKey.substring(0, 12) + '...';

      let expiresAt: string | null = null;
      if (formData.expiresIn !== 'never') {
        const days = parseInt(formData.expiresIn);
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + days);
        expiresAt = expDate.toISOString();
      }

      const { data, error } = await supabase
        .from('admin_api_keys')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          key_hash: keyHash,
          key_prefix: keyPrefix,
          service: formData.service,
          description: formData.description || null,
          scopes: formData.scopes,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      await logAuditAction(data.id, 'created', { name: formData.name, service: formData.service });

      setGeneratedKey(newKey);
      toast.success('API key created successfully');
      fetchApiKeys();
      fetchAuditLogs();
      
      // Reset form
      setFormData({
        name: '',
        service: 'general',
        description: '',
        scopes: [],
        expiresIn: 'never',
      });
    } catch (err) {
      console.error('Error creating API key:', err);
      toast.error('Failed to create API key');
    }
  };

  const handleRevokeKey = async () => {
    if (!deleteKeyId) return;

    try {
      const { error } = await supabase
        .from('admin_api_keys')
        .update({ is_active: false })
        .eq('id', deleteKeyId);

      if (error) throw error;

      await logAuditAction(deleteKeyId, 'revoked', {});

      toast.success('API key revoked successfully');
      setDeleteKeyId(null);
      fetchApiKeys();
      fetchAuditLogs();
    } catch (err) {
      console.error('Error revoking API key:', err);
      toast.error('Failed to revoke API key');
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      await logAuditAction(keyId, 'deleted', {});

      const { error } = await supabase
        .from('admin_api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      toast.success('API key deleted successfully');
      fetchApiKeys();
      fetchAuditLogs();
    } catch (err) {
      console.error('Error deleting API key:', err);
      toast.error('Failed to delete API key');
    }
  };

  const handleRegenerateKey = async (keyId: string) => {
    try {
      const newKey = generateSecureKey();
      const keyHash = await hashKey(newKey);
      const keyPrefix = newKey.substring(0, 12) + '...';

      const { error } = await supabase
        .from('admin_api_keys')
        .update({ 
          key_hash: keyHash, 
          key_prefix: keyPrefix,
          updated_at: new Date().toISOString()
        })
        .eq('id', keyId);

      if (error) throw error;

      await logAuditAction(keyId, 'regenerated', {});

      setGeneratedKey(newKey);
      toast.success('API key regenerated successfully');
      fetchApiKeys();
      fetchAuditLogs();
    } catch (err) {
      console.error('Error regenerating API key:', err);
      toast.error('Failed to regenerate API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope]
    }));
  };

  const getStatusBadge = (key: ApiKey) => {
    if (!key.is_active) {
      return <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30">Revoked</Badge>;
    }
    if (key.expires_at && new Date(key.expires_at) < new Date()) {
      return <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">Expired</Badge>;
    }
    return <Badge variant="outline" className="bg-success/20 text-success border-success/30">Active</Badge>;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            API Keys & Integrations
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your API keys for third-party integrations
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Generate New Key
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{apiKeys.length}</p>
              <p className="text-xs text-muted-foreground">Total Keys</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{apiKeys.filter(k => k.is_active).length}</p>
              <p className="text-xs text-muted-foreground">Active Keys</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/20 rounded-lg">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{apiKeys.filter(k => !k.is_active).length}</p>
              <p className="text-xs text-muted-foreground">Revoked Keys</p>
            </div>
          </div>
        </Card>
      </div>

      {/* API Keys Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{key.name}</p>
                    {key.description && (
                      <p className="text-xs text-muted-foreground">{key.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {key.key_prefix}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(key.key_prefix)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{key.service}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(key)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {key.last_used_at 
                    ? format(new Date(key.last_used_at), 'MMM d, yyyy')
                    : 'Never'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(key.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleRegenerateKey(key.id)}
                      disabled={!key.is_active}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => setDeleteKeyId(key.id)}
                      disabled={!key.is_active}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {apiKeys.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No API keys found. Generate your first key to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Recent Audit Logs */}
      {auditLogs.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent API Key Activity
          </h4>
          <div className="space-y-2">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                <span className="capitalize">{log.action.replace('_', ' ')}</span>
                <span className="text-muted-foreground">
                  {format(new Date(log.created_at), 'MMM d, h:mm a')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create Key Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for accessing the platform programmatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Key Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Production API Key"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select
                value={formData.service}
                onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this key used for?"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Scopes</Label>
              <div className="grid grid-cols-2 gap-2">
                {scopeOptions.map((scope) => (
                  <div
                    key={scope.value}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                      formData.scopes.includes(scope.value)
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted/50 border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => toggleScope(scope.value)}
                  >
                    <Shield className="w-3 h-3" />
                    <span className="text-xs">{scope.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Expiration</Label>
              <Select
                value={formData.expiresIn}
                onValueChange={(value) => setFormData(prev => ({ ...prev, expiresIn: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never expires</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={!formData.name.trim()}>
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generated Key Display Modal */}
      <Dialog open={!!generatedKey} onOpenChange={() => setGeneratedKey(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Save Your API Key
            </DialogTitle>
            <DialogDescription>
              This is the only time you will see this key. Copy it now and store it securely.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm font-mono break-all">{generatedKey}</code>
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full gap-2"
              onClick={() => {
                if (generatedKey) copyToClipboard(generatedKey);
              }}
            >
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={() => setGeneratedKey(null)}>
              I've Saved My Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!deleteKeyId} onOpenChange={() => setDeleteKeyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately invalidate the API key. Any applications using this key will lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeKey}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
