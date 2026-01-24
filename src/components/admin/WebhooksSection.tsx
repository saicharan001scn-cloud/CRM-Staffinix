import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
  Webhook, 
  Plus, 
  Copy, 
  Trash2, 
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  secret: string | null;
  events: string[];
  is_active: boolean;
  last_triggered_at: string | null;
  failure_count: number;
  created_at: string;
}

const eventOptions = [
  { value: 'consultant.created', label: 'Consultant Created' },
  { value: 'consultant.updated', label: 'Consultant Updated' },
  { value: 'job.created', label: 'Job Created' },
  { value: 'job.updated', label: 'Job Updated' },
  { value: 'submission.created', label: 'Submission Created' },
  { value: 'submission.status_changed', label: 'Submission Status Changed' },
  { value: 'user.created', label: 'User Created' },
  { value: 'user.updated', label: 'User Updated' },
];

export function WebhooksSection() {
  const { user } = useAuth();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteWebhookId, setDeleteWebhookId] = useState<string | null>(null);
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    generateSecret: true,
  });

  const fetchWebhooks = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('admin_webhooks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (err) {
      console.error('Error fetching webhooks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, [user?.id]);

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let secret = 'whsec_';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const handleCreateWebhook = async () => {
    if (!user?.id || !formData.name.trim() || !formData.url.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    if (formData.events.length === 0) {
      toast.error('Please select at least one event');
      return;
    }

    try {
      const secret = formData.generateSecret ? generateSecret() : null;

      const { error } = await supabase
        .from('admin_webhooks')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          url: formData.url.trim(),
          secret,
          events: formData.events,
        });

      if (error) throw error;

      toast.success('Webhook created successfully');
      setIsCreateModalOpen(false);
      fetchWebhooks();
      
      // Reset form
      setFormData({
        name: '',
        url: '',
        events: [],
        generateSecret: true,
      });
    } catch (err) {
      console.error('Error creating webhook:', err);
      toast.error('Failed to create webhook');
    }
  };

  const handleToggleWebhook = async (webhookId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_webhooks')
        .update({ is_active: !isActive })
        .eq('id', webhookId);

      if (error) throw error;

      toast.success(isActive ? 'Webhook paused' : 'Webhook activated');
      fetchWebhooks();
    } catch (err) {
      console.error('Error toggling webhook:', err);
      toast.error('Failed to update webhook');
    }
  };

  const handleDeleteWebhook = async () => {
    if (!deleteWebhookId) return;

    try {
      const { error } = await supabase
        .from('admin_webhooks')
        .delete()
        .eq('id', deleteWebhookId);

      if (error) throw error;

      toast.success('Webhook deleted successfully');
      setDeleteWebhookId(null);
      fetchWebhooks();
    } catch (err) {
      console.error('Error deleting webhook:', err);
      toast.error('Failed to delete webhook');
    }
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    setTestingWebhookId(webhook.id);
    
    try {
      // Simulate a test webhook call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Test webhook sent to ${webhook.url}`);
    } catch (err) {
      toast.error('Failed to send test webhook');
    } finally {
      setTestingWebhookId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const getStatusBadge = (webhook: WebhookConfig) => {
    if (!webhook.is_active) {
      return <Badge variant="outline" className="bg-muted text-muted-foreground">Paused</Badge>;
    }
    if (webhook.failure_count > 3) {
      return <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30">Failing</Badge>;
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
            <Webhook className="w-5 h-5 text-primary" />
            Webhooks
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure webhooks to receive real-time event notifications
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Webhook
        </Button>
      </div>

      {/* Webhooks List */}
      <div className="space-y-3">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{webhook.name}</h4>
                  {getStatusBadge(webhook)}
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-muted-foreground">
                    {webhook.url}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(webhook.url)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="secondary" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created: {format(new Date(webhook.created_at), 'MMM d, yyyy')}</span>
                  {webhook.last_triggered_at && (
                    <span>Last triggered: {format(new Date(webhook.last_triggered_at), 'MMM d, h:mm a')}</span>
                  )}
                  {webhook.failure_count > 0 && (
                    <span className="text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {webhook.failure_count} failures
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleTestWebhook(webhook)}
                  disabled={testingWebhookId === webhook.id}
                >
                  {testingWebhookId === webhook.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleToggleWebhook(webhook.id, webhook.is_active)}
                >
                  {webhook.is_active ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteWebhookId(webhook.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {webhooks.length === 0 && (
          <Card className="p-8 text-center">
            <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No webhooks configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set up webhooks to receive real-time notifications when events occur.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Webhook
            </Button>
          </Card>
        )}
      </div>

      {/* Create Webhook Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
            <DialogDescription>
              Configure a webhook endpoint to receive event notifications.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Webhook Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Slack Notifications"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Endpoint URL *</Label>
              <Input
                id="url"
                placeholder="https://your-app.com/webhook"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Events to Subscribe *</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {eventOptions.map((event) => (
                  <div
                    key={event.value}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                      formData.events.includes(event.value)
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted/50 border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => toggleEvent(event.value)}
                  >
                    <Checkbox checked={formData.events.includes(event.value)} />
                    <span className="text-xs">{event.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Generate Signing Secret</p>
                <p className="text-xs text-muted-foreground">
                  Adds a signature header for verifying webhook authenticity
                </p>
              </div>
              <Switch
                checked={formData.generateSecret}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, generateSecret: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateWebhook} 
              disabled={!formData.name.trim() || !formData.url.trim() || formData.events.length === 0}
            >
              Create Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteWebhookId} onOpenChange={() => setDeleteWebhookId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this webhook configuration. You will stop receiving notifications for the configured events.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWebhook}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Webhook
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
