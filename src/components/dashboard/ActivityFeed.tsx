import { Send, Calendar, CheckCircle, Briefcase, Mail } from 'lucide-react';
import { ActivityItem } from '@/types';
import { cn } from '@/lib/utils';

const iconMap = {
  submission: Send,
  interview: Calendar,
  placement: CheckCircle,
  job: Briefcase,
  email: Mail,
};

const colorMap = {
  submission: 'text-info bg-info/10',
  interview: 'text-warning bg-warning/10',
  placement: 'text-success bg-success/10',
  job: 'text-primary bg-primary/10',
  email: 'text-chart-5 bg-chart-5/10',
};

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          return (
            <div 
              key={activity.id}
              className="flex items-start gap-4 animate-slide-in-left opacity-0"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                colorMap[activity.type]
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
