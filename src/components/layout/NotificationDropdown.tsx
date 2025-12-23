import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Settings, UserPlus, Briefcase, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'match' | 'job' | 'submission' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'match',
    title: 'New Candidate Matched',
    message: 'John Doe matched with Senior React Developer position',
    timestamp: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'job',
    title: 'Job Status Updated',
    message: 'Full Stack Developer position marked as filled',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'submission',
    title: 'Submission Approved',
    message: 'Sarah Johnson moved to interview stage',
    timestamp: '3 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'general',
    title: 'Welcome to CRM',
    message: 'Get started by adding your first consultant',
    timestamp: '1 day ago',
    read: true,
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match':
        return <UserPlus className="w-4 h-4 text-primary" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-warning" />;
      case 'submission':
        return <Send className="w-4 h-4 text-success" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7 gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => {
                    setNotifications(notifications.map(n =>
                      n.id === notification.id ? { ...n, read: true } : n
                    ));
                  }}
                >
                  <div className="mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm truncate",
                      !notification.read ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-border bg-muted/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-3 h-3" />
              Notification Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
