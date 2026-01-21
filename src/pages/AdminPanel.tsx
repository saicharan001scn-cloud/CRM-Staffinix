import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { UserManagement } from '@/components/admin/UserManagement';
import { ActivityLogs } from '@/components/admin/ActivityLogs';
import { RoleManagement } from '@/components/admin/RoleManagement';
import { usePermissions } from '@/hooks/usePermissions';
import { RoleBasedContent, SuperAdminOnly } from '@/components/layout/RoleBasedContent';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, Users, Activity, Shield, Settings, CreditCard, Lock } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isSuperAdmin, canManageRoles, canViewSystemSettings } = usePermissions();

  return (
    <MainLayout 
      title="Admin Panel" 
      subtitle="Manage users, roles, and system settings"
      showBackButton={true}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-flex">
          <TabsTrigger value="dashboard" className="gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2" disabled={!canManageRoles}>
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          {/* System Settings - Super Admin Only */}
          <TabsTrigger 
            value="settings" 
            className="gap-2" 
            disabled={!canViewSystemSettings}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
            {!canViewSystemSettings && <Lock className="w-3 h-3 ml-1" />}
          </TabsTrigger>
          {/* Billing - Super Admin Only */}
          <TabsTrigger 
            value="billing" 
            className="gap-2" 
            disabled={!isSuperAdmin}
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Billing</span>
            {!isSuperAdmin && <Lock className="w-3 h-3 ml-1" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityLogs />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SuperAdminOnly
            fallback={
              <Card className="p-12 text-center">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Access Restricted</h3>
                <p className="text-muted-foreground">
                  System settings are only available to Super Admins.
                </p>
              </Card>
            }
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">System Settings</h2>
              <p className="text-muted-foreground">
                System configuration options will appear here.
              </p>
            </Card>
          </SuperAdminOnly>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <SuperAdminOnly
            fallback={
              <Card className="p-12 text-center">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Access Restricted</h3>
                <p className="text-muted-foreground">
                  Billing information is only available to Super Admins.
                </p>
              </Card>
            }
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Billing & Subscription</h2>
              <p className="text-muted-foreground">
                Billing and subscription management will appear here.
              </p>
            </Card>
          </SuperAdminOnly>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
