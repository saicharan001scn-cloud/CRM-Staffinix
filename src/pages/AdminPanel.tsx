import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/admin/UserManagement';
import { ActivityLogs } from '@/components/admin/ActivityLogs';
import { Users, Activity } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <MainLayout 
      title="Admin Panel" 
      subtitle="Manage users and system settings"
      showBackButton={true}
      hideGlobalSearch={true}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityLogs />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
