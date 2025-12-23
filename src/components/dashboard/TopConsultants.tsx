import { useNavigate } from 'react-router-dom';
import { Consultant } from '@/types';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface TopConsultantsProps {
  consultants: Consultant[];
}

export function TopConsultants({ consultants }: TopConsultantsProps) {
  const navigate = useNavigate();
  
  const topConsultants = [...consultants]
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 5);

  const handleConsultantClick = (consultantId: string) => {
    navigate(`/consultants/${consultantId}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Top Matched Consultants</h3>
        <TrendingUp className="w-5 h-5 text-success" />
      </div>
      
      <div className="space-y-3">
        {topConsultants.map((consultant, index) => (
          <div 
            key={consultant.id}
            onClick={() => handleConsultantClick(consultant.id)}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{consultant.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {consultant.skills.slice(0, 3).join(' • ')}
              </p>
            </div>
            <div className={cn(
              "match-score",
              consultant.matchScore && consultant.matchScore >= 85 ? "match-score-high" :
              consultant.matchScore && consultant.matchScore >= 70 ? "match-score-medium" : "match-score-low"
            )}>
              {consultant.matchScore}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
