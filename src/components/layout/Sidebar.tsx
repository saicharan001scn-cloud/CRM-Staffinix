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
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import staffinixLogo from '@/assets/staffinix-logo.png';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Consultants', path: '/consultants' },
  { icon: Briefcase, label: 'Job Requirements', path: '/jobs' },
  { icon: Building2, label: 'Vendors', path: '/vendors' },
  { icon: Send, label: 'Submissions', path: '/submissions' },
  { icon: Mail, label: 'Email Automation', path: '/emails' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Bot, label: 'AI Assistant', path: '/assistant' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const userEmail = user?.email || 'User';
  const userInitials = userEmail.split('@')[0].slice(0, 2).toUpperCase();

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
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-link",
                isActive && "nav-link-active"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 nav-icon transition-transform", isActive && "text-primary")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings & Admin */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              "nav-link",
              location.pathname === '/admin' && "nav-link-active"
            )}
          >
            <ShieldCheck className="w-5 h-5 shrink-0 nav-icon transition-transform" />
            <span>Admin Panel</span>
          </Link>
        )}
        <Link
          to="/settings"
          className={cn(
            "nav-link",
            location.pathname === '/settings' && "nav-link-active"
          )}
        >
          <Settings className="w-5 h-5 shrink-0 nav-icon transition-transform" />
          <span>Settings</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userEmail.split('@')[0]}</p>
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
}
