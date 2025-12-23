import { MainLayout } from '@/components/layout/MainLayout';
import { AIAssistant } from '@/components/ai/AIAssistant';

export default function Assistant() {
  return (
    <MainLayout
      title="AI Assistant"
      subtitle="Your intelligent staffing co-pilot"
      showBackButton={false}
    >
      <AIAssistant />
    </MainLayout>
  );
}
