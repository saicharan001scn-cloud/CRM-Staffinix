import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmailDashboard } from '@/components/emails/EmailDashboard';
import { CampaignBuilder } from '@/components/emails/CampaignBuilder';
import { TemplateLibrary } from '@/components/emails/TemplateLibrary';
import { EmailAnalytics } from '@/components/emails/EmailAnalytics';
import { HotlistCampaign } from '@/components/emails/HotlistCampaign';
import { FollowUpQueue } from '@/components/emails/FollowUpQueue';
import { CampaignDetails } from '@/components/emails/CampaignDetails';

type View = 'dashboard' | 'campaign' | 'templates' | 'analytics' | 'hotlist' | 'followups' | 'campaign-details';

export default function Emails() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const handleViewCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setCurrentView('campaign-details');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'campaign':
        return <CampaignBuilder onBack={() => setCurrentView('dashboard')} />;
      case 'templates':
        return (
          <TemplateLibrary 
            onBack={() => setCurrentView('dashboard')} 
            onUseTemplate={() => setCurrentView('campaign')}
          />
        );
      case 'analytics':
        return <EmailAnalytics onBack={() => setCurrentView('dashboard')} />;
      case 'hotlist':
        return <HotlistCampaign onBack={() => setCurrentView('dashboard')} />;
      case 'followups':
        return <FollowUpQueue onBack={() => setCurrentView('dashboard')} />;
      case 'campaign-details':
        return selectedCampaign ? (
          <CampaignDetails campaign={selectedCampaign} onBack={() => setCurrentView('dashboard')} />
        ) : null;
      default:
        return (
          <EmailDashboard 
            onCreateCampaign={() => setCurrentView('campaign')}
            onOpenTemplates={() => setCurrentView('templates')}
            onOpenAnalytics={() => setCurrentView('analytics')}
            onSendHotlist={() => setCurrentView('hotlist')}
            onOpenFollowUps={() => setCurrentView('followups')}
            onViewCampaign={handleViewCampaign}
          />
        );
    }
  };

  return (
    <MainLayout
      title="Email Automation"
      subtitle="AI-powered email campaigns with max 50 recipients per campaign"
      showBackButton={false}
    >
      {renderContent()}
    </MainLayout>
  );
}
