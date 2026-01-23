import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { SuperAdminActionPanels } from '@/components/admin/SuperAdminActionPanels';
import { UserManagement } from '@/components/admin/UserManagement';
import { ActivityLogs } from '@/components/admin/ActivityLogs';
import { useUserRole } from '@/hooks/useUserRole';
import { LayoutDashboard, Users, Activity } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isSuperAdmin } = useUserRole();

  return (
    <MainLayout 
      title="Admin Panel" 
      subtitle={isSuperAdmin ? "Platform Management • Super Admin" : "Manage users and system settings"}
      showBackButton={!isSuperAdmin}
      hideGlobalSearch={true}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="dashboard" className="gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Super Admin sees action panels, regular admins see stats dashboard */}
          {isSuperAdmin ? <SuperAdminActionPanels /> : <AdminDashboard />}
        </TabsContent>

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
