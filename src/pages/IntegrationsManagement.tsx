import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Link2, Mail, Globe, Calendar, Database, Video, Cloud, RefreshCw,
  Settings, CheckCircle, XCircle, Search, Plus, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { RequestIntegrationModal } from '@/components/integrations/RequestIntegrationModal';
import { ConfigureIntegrationModal } from '@/components/integrations/ConfigureIntegrationModal';

interface Integration {
  id: string;
  name: string;
  icon: React.ElementType;
  category: 'Job Boards' | 'Communication' | 'Calendar' | 'Storage' | 'Other';
  status: 'connected' | 'disconnected' | 'pending';
  lastSynced?: string;
  description: string;
}

const integrations: Integration[] = [
  { id: '1', name: 'LinkedIn', icon: Link2, category: 'Job Boards', status: 'connected', lastSynced: '2024-01-15 10:30 AM', description: 'Import jobs and candidates from LinkedIn' },
  { id: '2', name: 'Dice', icon: Globe, category: 'Job Boards', status: 'connected', lastSynced: '2024-01-15 09:45 AM', description: 'Sync job postings with Dice.com' },
  { id: '3', name: 'Indeed', icon: Globe, category: 'Job Boards', status: 'disconnected', description: 'Post jobs to Indeed automatically' },
  { id: '4', name: 'Monster', icon: Globe, category: 'Job Boards', status: 'disconnected', description: 'Integrate with Monster job board' },
  { id: '5', name: 'Gmail', icon: Mail, category: 'Communication', status: 'connected', lastSynced: '2024-01-15 11:00 AM', description: 'Send emails directly from CRM' },
  { id: '6', name: 'Outlook', icon: Mail, category: 'Communication', status: 'disconnected', description: 'Connect Microsoft Outlook for emails' },
  { id: '7', name: 'Zoom', icon: Video, category: 'Communication', status: 'pending', description: 'Schedule interviews with Zoom integration' },
  { id: '8', name: 'Google Calendar', icon: Calendar, category: 'Calendar', status: 'connected', lastSynced: '2024-01-15 08:00 AM', description: 'Sync interviews and meetings' },
  { id: '9', name: 'Microsoft Calendar', icon: Calendar, category: 'Calendar', status: 'disconnected', description: 'Integrate with Outlook calendar' },
  { id: '10', name: 'Google Drive', icon: Cloud, category: 'Storage', status: 'connected', lastSynced: '2024-01-14 04:30 PM', description: 'Store resumes and documents' },
  { id: '11', name: 'Dropbox', icon: Cloud, category: 'Storage', status: 'disconnected', description: 'Connect Dropbox for file storage' },
  { id: '12', name: 'MongoDB', icon: Database, category: 'Other', status: 'connected', lastSynced: '2024-01-15 12:00 PM', description: 'Database connection for CRM data' },
];

export default function IntegrationsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [integrationList, setIntegrationList] = useState(integrations);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [configureModalOpen, setConfigureModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const filteredIntegrations = integrationList.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(integrations.map(i => i.category))];

  const handleConnect = (id: string) => {
    setIntegrationList(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'connected' as const, lastSynced: new Date().toLocaleString() } : i
    ));
    toast.success('Integration connected!');
  };

  const handleDisconnect = (id: string) => {
    setIntegrationList(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'disconnected' as const, lastSynced: undefined } : i
    ));
    toast.success('Integration disconnected');
  };

  const handleTestConnection = async (id: string) => {
    setIsTesting(id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTesting(null);
    toast.success('Connection test successful!');
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigureModalOpen(true);
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-success/20 text-success border-success/30 gap-1"><CheckCircle className="w-3 h-3" />Connected</Badge>;
      case 'disconnected':
        return <Badge variant="secondary" className="gap-1"><XCircle className="w-3 h-3" />Disconnected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-warning border-warning/30 gap-1"><RefreshCw className="w-3 h-3" />Pending</Badge>;
    }
  };

  return (
    <MainLayout title="Manage Integrations" subtitle="Connect and configure external services">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search integrations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Button className="gap-2" onClick={() => setRequestModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Request New Integration
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold text-foreground">{integrationList.length}</p></Card>
          <Card className="p-4"><p className="text-xs text-muted-foreground">Connected</p><p className="text-2xl font-bold text-success">{integrationList.filter(i => i.status === 'connected').length}</p></Card>
          <Card className="p-4"><p className="text-xs text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning">{integrationList.filter(i => i.status === 'pending').length}</p></Card>
          <Card className="p-4"><p className="text-xs text-muted-foreground">Disconnected</p><p className="text-2xl font-bold text-muted-foreground">{integrationList.filter(i => i.status === 'disconnected').length}</p></Card>
        </div>

        {categories.map(category => {
          const categoryIntegrations = filteredIntegrations.filter(i => i.category === category);
          if (categoryIntegrations.length === 0) return null;
          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-3">{category}</h3>
              <div className="grid grid-cols-2 gap-4">
                {categoryIntegrations.map(integration => (
                  <Card key={integration.id} className="p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <integration.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{integration.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                          {integration.lastSynced && <p className="text-[10px] text-muted-foreground mt-1">Last synced: {integration.lastSynced}</p>}
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                      {integration.status === 'connected' ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1" onClick={() => handleTestConnection(integration.id)} disabled={isTesting === integration.id}>
                            {isTesting === integration.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                            Test
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1" onClick={() => handleConfigure(integration)}>
                            <Settings className="w-3 h-3" />
                            Configure
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => handleDisconnect(integration.id)}>
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="flex-1 h-7 text-xs gap-1" onClick={() => handleConnect(integration.id)}>
                          <ExternalLink className="w-3 h-3" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <RequestIntegrationModal open={requestModalOpen} onClose={() => setRequestModalOpen(false)} />
      {selectedIntegration && (
        <ConfigureIntegrationModal open={configureModalOpen} onClose={() => setConfigureModalOpen(false)} integration={selectedIntegration} />
      )}
    </MainLayout>
  );
}
