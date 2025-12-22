import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from './GlobalSearch';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function MainLayout({ children, title, subtitle, action }: MainLayoutProps) {
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
              <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </button>
              
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
          {/* Page Title */}
          <div className="mb-8">
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
