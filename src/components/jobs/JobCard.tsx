import { useNavigate } from 'react-router-dom';
import { JobRequirement } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Users, Building2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: JobRequirement;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleViewMatches = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${job.id}/matches`);
  };

  return (
    <div 
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-glow transition-all duration-300 animate-slide-up opacity-0 group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{job.client}</span>
          </div>
        </div>
        <Badge 
          className={cn(
            "badge-status border",
            job.status === 'open' ? "bg-success/20 text-success border-success/30" :
            job.status === 'filled' ? "bg-primary/20 text-primary border-primary/30" :
            "bg-muted text-muted-foreground border-border"
          )}
        >
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </Badge>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">${job.rate.min}-${job.rate.max}/hr</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Due: {job.deadline}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{job.matchedConsultants} matches</span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Visa Requirements */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-muted-foreground">Visa:</span>
        {job.visaRequirements.map((visa) => (
          <Badge key={visa} variant="outline" className="text-xs">
            {visa}
          </Badge>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {job.jobType}
          </Badge>
          <span className="text-xs text-muted-foreground">via {job.source}</span>
        </div>
        <Button size="sm" className="gap-2" onClick={handleViewMatches}>
          <Sparkles className="w-3 h-3" />
          View Matches
        </Button>
      </div>
    </div>
  );
}
