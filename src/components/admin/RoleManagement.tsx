import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminData } from '@/hooks/useAdminData';
import { Shield, ShieldCheck, User, Info } from 'lucide-react';

export function RoleManagement() {
  const { users, isSuperAdmin } = useAdminData();

  const roleInfo = [
    {
      role: 'super_admin',
      label: 'Super Admin',
      icon: ShieldCheck,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      count: users.filter(u => u.role === 'super_admin').length,
      permissions: [
        'Full system access',
        'Create/edit/delete all users',
        'Assign and revoke roles',
        'Access admin panel',
        'View all activity logs',
        'Manage system settings',
      ],
    },
    {
      role: 'admin',
      label: 'Admin',
      icon: Shield,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      count: users.filter(u => u.role === 'admin').length,
      permissions: [
        'Access admin panel',
        'View all users',
        'View activity logs',
        'Manage consultants',
        'Manage vendors',
        'Manage jobs',
      ],
    },
    {
      role: 'user',
      label: 'User',
      icon: User,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      count: users.filter(u => u.role === 'user' || !u.role).length,
      permissions: [
        'View dashboard',
        'Manage own consultants',
        'Manage own vendors',
        'Manage own jobs',
        'Submit candidates',
        'View analytics',
      ],
    },
  ];

  if (!isSuperAdmin) {
    return (
      <Card className="p-8 text-center">
        <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Super Admin Access Required</h3>
        <p className="text-muted-foreground">
          Only Super Admins can manage roles and permissions.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="p-4 bg-blue-500/10 border-blue-500/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground">Role-Based Access Control</h4>
            <p className="text-sm text-muted-foreground mt-1">
              This system uses a three-tier role hierarchy. Roles are stored in a separate table 
              to prevent privilege escalation attacks. Use the User Management tab to assign roles.
            </p>
          </div>
        </div>
      </Card>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roleInfo.map((info) => (
          <Card key={info.role} className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg ${info.bgColor} flex items-center justify-center`}>
                <info.icon className={`w-6 h-6 ${info.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{info.label}</h3>
                <Badge variant="outline" className="text-xs">
                  {info.count} user{info.count !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Permissions
              </p>
              <ul className="space-y-1.5">
                {info.permissions.map((permission, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Users by Role */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Users by Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleInfo.map((info) => {
            const roleUsers = users.filter(u => 
              info.role === 'user' ? (u.role === 'user' || !u.role) : u.role === info.role
            );
            return (
              <Card key={info.role} className="p-4">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <info.icon className={`w-4 h-4 ${info.color}`} />
                  {info.label}s ({roleUsers.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {roleUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No users</p>
                  ) : (
                    roleUsers.map(user => (
                      <div key={user.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-[10px] font-medium text-primary">
                            {(user.full_name || user.email || '?').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.full_name || 'No name'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
