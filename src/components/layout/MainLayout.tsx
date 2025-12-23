import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from './GlobalSearch';
import { NotificationDropdown } from './NotificationDropdown';
import { BackButton } from './BackButton';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  showBackButton?: boolean;
}

export function MainLayout({ children, title, subtitle, action, showBackButton = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-64 min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Global Search */}
            <GlobalSearch />

            {/* Actions */}
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              
              {action && (
                <Button onClick={action.onClick} className="gap-2">
                  <Plus className="w-4 h-4" />
                  {action.label}
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Back Button & Page Title */}
          <div className="mb-8">
            {showBackButton && (
              <div className="mb-2">
                <BackButton />
              </div>
            )}
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
