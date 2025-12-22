import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Settings, Key, RefreshCw, Eye, EyeOff, Copy, 
  CheckCircle, AlertCircle, Trash2, RotateCcw, Link2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ConfigureIntegrationModalProps {
  open: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    status: 'connected' | 'disconnected' | 'pending';
    lastSynced?: string;
    description: string;
  };
}

const syncFrequencies = [
  { value: '15min', label: 'Every 15 minutes' },
  { value: '1hour', label: 'Every hour' },
  { value: '6hours', label: 'Every 6 hours' },
  { value: 'daily', label: 'Daily' },
];

const jobSyncFields = [
  { id: 'jobTitle', label: 'Job Title' },
  { id: 'description', label: 'Description' },
  { id: 'location', label: 'Location' },
  { id: 'salaryRange', label: 'Salary Range' },
  { id: 'requirements', label: 'Requirements' },
];

const candidateSyncFields = [
  { id: 'nameContact', label: 'Name & Contact' },
  { id: 'resume', label: 'Resume' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
];

export function ConfigureIntegrationModal({ open, onClose, integration }: ConfigureIntegrationModalProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [config, setConfig] = useState({
    apiKey: 'sk_live_abc123def456ghi789jkl012mno345pqr',
    syncFrequency: '1hour',
    autoPostJobs: true,
    autoImportCandidates: true,
    jobSyncFields: ['jobTitle', 'description', 'location', 'requirements'],
    candidateSyncFields: ['nameContact', 'resume', 'experience', 'skills'],
    webhookUrl: 'https://yourcrm.com/api/webhooks/' + integration.name.toLowerCase().replace(/\s+/g, '-'),
  });

  const maskedApiKey = config.apiKey.slice(0, 12) + '•'.repeat(20) + config.apiKey.slice(-4);

  const handleTestConnection = async () => {
    setIsTesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTesting(false);
    toast.success('Connection test successful!', {
      description: `${integration.name} is responding correctly.`,
    });
  };

  const handleRegenerateKey = async () => {
    toast.success('API key regenerated!', {
      description: 'New key has been applied. Update any external systems using the old key.',
    });
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(config.webhookUrl);
    toast.success('Webhook URL copied to clipboard!');
  };

  const handleTestWebhook = async () => {
    toast.success('Test webhook sent!', {
      description: 'Check your endpoint for the incoming request.',
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Configuration saved!');
    onClose();
  };

  const handleDisconnect = () => {
    toast.success(`${integration.name} disconnected`);
    onClose();
  };

  const handleResetDefaults = () => {
    setConfig({
      ...config,
      syncFrequency: '1hour',
      autoPostJobs: true,
      autoImportCandidates: true,
      jobSyncFields: ['jobTitle', 'description', 'location', 'requirements'],
      candidateSyncFields: ['nameContact', 'resume', 'experience', 'skills'],
    });
    toast.success('Settings reset to defaults');
  };

  const toggleJobField = (fieldId: string) => {
    setConfig(prev => ({
      ...prev,
      jobSyncFields: prev.jobSyncFields.includes(fieldId)
        ? prev.jobSyncFields.filter(f => f !== fieldId)
        : [...prev.jobSyncFields, fieldId]
    }));
  };

  const toggleCandidateField = (fieldId: string) => {
    setConfig(prev => ({
      ...prev,
      candidateSyncFields: prev.candidateSyncFields.includes(fieldId)
        ? prev.candidateSyncFields.filter(f => f !== fieldId)
        : [...prev.candidateSyncFields, fieldId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Configure {integration.name} Integration
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">Connection Status:</span>
            <Badge className="bg-success/20 text-success border-success/30 gap-1">
              <CheckCircle className="w-3 h-3" />
              Connected
            </Badge>
            {integration.lastSynced && (
              <span className="text-xs text-muted-foreground">
                Last synced: {integration.lastSynced}
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* API Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              API Settings
            </h3>
            
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={showApiKey ? config.apiKey : maskedApiKey}
                    readOnly
                    className="pr-10 font-mono text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={handleRegenerateKey}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Regenerate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTestConnection}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5 mr-1" />
                      Test
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <Select value={config.syncFrequency} onValueChange={(v) => setConfig(prev => ({ ...prev, syncFrequency: v }))}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {syncFrequencies.map(freq => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Auto-post Jobs</Label>
                  <p className="text-xs text-muted-foreground">Automatically post new jobs to {integration.name}</p>
                </div>
                <Switch 
                  checked={config.autoPostJobs} 
                  onCheckedChange={(v) => setConfig(prev => ({ ...prev, autoPostJobs: v }))}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Auto-import Candidates</Label>
                  <p className="text-xs text-muted-foreground">Import applicants from {integration.name}</p>
                </div>
                <Switch 
                  checked={config.autoImportCandidates} 
                  onCheckedChange={(v) => setConfig(prev => ({ ...prev, autoImportCandidates: v }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Sync Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Data Sync Settings</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Sync Job Fields</Label>
                {jobSyncFields.map(field => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`job-${field.id}`}
                      checked={config.jobSyncFields.includes(field.id)}
                      onCheckedChange={() => toggleJobField(field.id)}
                    />
                    <Label htmlFor={`job-${field.id}`} className="text-sm cursor-pointer">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Candidate Import Fields</Label>
                {candidateSyncFields.map(field => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`candidate-${field.id}`}
                      checked={config.candidateSyncFields.includes(field.id)}
                      onCheckedChange={() => toggleCandidateField(field.id)}
                    />
                    <Label htmlFor={`candidate-${field.id}`} className="text-sm cursor-pointer">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Webhook Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Webhook Settings</h3>
            
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  value={config.webhookUrl}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button variant="outline" size="sm" onClick={handleCopyWebhook}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleTestWebhook}>
                  Test Webhook
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use this URL to receive real-time updates from {integration.name}
              </p>
            </div>
          </div>

          {/* Warning Box */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
            <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Admin-only settings</p>
              <p className="mt-1">
                Some configuration options may require admin permissions. Changes will take effect immediately after saving.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 mr-auto">
            <Button variant="ghost" size="sm" onClick={handleResetDefaults} className="text-muted-foreground">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset to Defaults
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-destructive hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Disconnect
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
