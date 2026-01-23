import { memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Building2, 
  Send, 
  Mail, 
  BarChart3, 
  Bot, 
  Settings,
  LogOut,
  ShieldCheck,
  Crown,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import staffinixLogo from '@/assets/staffinix-logo-small.webp';

// Memoized NavItem to prevent unnecessary re-renders
const NavItem = memo(function NavItem({ 
  icon: Icon, 
  label, 
  path, 
  isActive 
}: { 
  icon: React.ElementType; 
  label: string; 
  path: string; 
  isActive: boolean;
}) {
  return (
    <Link
      to={path}
      className={cn(
        "nav-link",
        isActive && "nav-link-active"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0 nav-icon transition-transform", isActive && "text-primary")} />
      <span>{label}</span>
    </Link>
  );
});

export const Sidebar = memo(function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { 
    canAccessAdminPanel, 
    canViewAnalytics, 
    isSuperAdmin, 
    isAdmin,
    getRoleBadgeStyles,
    getRoleLabel 
  } = usePermissions();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const userEmail = user?.email || 'User';
  const userInitials = userEmail.split('@')[0].slice(0, 2).toUpperCase();
  const roleStyles = getRoleBadgeStyles();

  // Build nav items based on permissions
  // Super Admin sees platform management, not operational pages
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', visible: !isSuperAdmin },
    { icon: Users, label: 'Consultants', path: '/consultants', visible: !isSuperAdmin },
    { icon: Briefcase, label: 'Job Requirements', path: '/jobs', visible: !isSuperAdmin },
    { icon: Building2, label: 'Vendors', path: '/vendors', visible: !isSuperAdmin },
    { icon: Send, label: 'Submissions', path: '/submissions', visible: !isSuperAdmin },
    { icon: Mail, label: 'Email Automation', path: '/emails', visible: !isSuperAdmin },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', visible: canViewAnalytics && !isSuperAdmin },
    { icon: Bot, label: 'AI Assistant', path: '/assistant', visible: !isSuperAdmin },
  ].filter(item => item.visible);

  return (
    <aside 
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col w-64"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <img src={staffinixLogo} alt="Staffinix" className="w-10 h-10 rounded-xl object-cover" />
          <span className="font-bold text-xl text-foreground tracking-tight">
            Staffinix
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
          />
        ))}
        
        {/* Admin Panel & Settings - inline for all users */}
        {canAccessAdminPanel && (
          <NavItem
            icon={ShieldCheck}
            label="Admin Panel"
            path="/admin"
            isActive={location.pathname === '/admin'}
          />
        )}
        
        {/* Billing - Super Admin only */}
        {isSuperAdmin && (
          <NavItem
            icon={CreditCard}
            label="Billing"
            path="/billing"
            isActive={location.pathname === '/billing'}
          />
        )}
        
        <NavItem
          icon={Settings}
          label="Settings"
          path="/settings"
          isActive={location.pathname === '/settings'}
        />
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isSuperAdmin ? "bg-gradient-to-br from-amber-500/30 to-yellow-500/30 ring-2 ring-amber-500/30" :
            isAdmin ? "bg-blue-500/20 ring-2 ring-blue-500/20" :
            "bg-primary/20"
          )}>
            {isSuperAdmin ? (
              <Crown className="w-5 h-5 text-amber-400" />
            ) : (
              <span className="text-sm font-medium text-primary">{userInitials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">{userEmail.split('@')[0]}</p>
              <Badge 
                variant="outline" 
                className={cn("text-[10px] px-1.5 py-0", roleStyles.bg, roleStyles.text, roleStyles.border)}
              >
                {getRoleLabel()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
});
