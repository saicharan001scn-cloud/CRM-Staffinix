import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
  href?: string;
}

export function StatCard({ title, value, change, icon: Icon, iconColor = 'text-primary', delay = 0, href }: StatCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <div 
      className={cn(
        "stat-card animate-slide-up opacity-0",
        href && "cursor-pointer"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              "mt-1 text-xs font-medium",
              change.type === 'increase' ? 'text-success' : 'text-destructive'
            )}>
              {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%
              <span className="text-muted-foreground ml-1">vs last week</span>
            </p>
          )}
        </div>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          "bg-primary/10"
        )}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}
