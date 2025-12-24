import { useNavigate } from 'react-router-dom';
import { JobRequirement } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Users, Building2, Sparkles, Globe, Mail, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface JobCardProps {
  job: JobRequirement;
  index: number;
}

const portalIcons: Record<string, string> = {
  'Dice': '🎲',
  'LinkedIn': '💼',
  'Indeed': '🔍',
  'Monster': '👹',
  'CareerBuilder': '🏗️',
};

export function JobCard({ job, index }: JobCardProps) {
  const navigate = useNavigate();

  const handleViewMatches = () => {
    navigate(`/jobs/${job.id}/matches`);
  };

  const handleSubmitAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.sourceType === 'portal') {
      if (job.portalApplyUrl) {
        window.open(job.portalApplyUrl, '_blank');
        toast.success(`Opening ${job.source} portal...`);
      } else {
        toast.error('Portal URL not available');
      }
    } else {
      // For vendor email jobs, store data and redirect to email automation
      sessionStorage.setItem('vendorSubmission', JSON.stringify({
        vendorEmail: job.vendorEmail,
        vendorName: job.vendorName || job.source,
        jobTitle: job.title,
        clientName: job.client,
      }));
      navigate('/emails?type=vendor_submission');
    }
  };

  const isPortal = job.sourceType === 'portal';
  const sourceIcon = isPortal ? (portalIcons[job.source] || '🌐') : '📧';

  return (
    <div 
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-glow transition-all duration-300 animate-slide-up opacity-0 group"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{sourceIcon}</span>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{job.client}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
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
          <Badge 
            variant="outline" 
            className={cn(
              "text-[10px]",
              isPortal 
                ? "bg-blue-500/10 text-blue-500 border-blue-500/30" 
                : "bg-amber-500/10 text-amber-500 border-amber-500/30"
            )}
          >
            {isPortal ? <Globe className="w-3 h-3 mr-1" /> : <Mail className="w-3 h-3 mr-1" />}
            {isPortal ? 'Portal' : 'Vendor Email'}
          </Badge>
        </div>
      </div>

      {/* Source Info */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        {isPortal ? (
          <span className="text-muted-foreground">
            Source: <span className="text-foreground font-medium">{job.source} Portal</span>
          </span>
        ) : (
          <span className="text-muted-foreground">
            Vendor: <span className="text-foreground font-medium">{job.vendorName || job.source}</span>
            {job.vendorEmail && (
              <span className="text-muted-foreground ml-1">({job.vendorEmail})</span>
            )}
          </span>
        )}
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
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            className="gap-1 text-xs"
            onClick={handleSubmitAction}
          >
            {isPortal ? (
              <>
                <ExternalLink className="w-3 h-3" />
                Open Portal
              </>
            ) : (
              <>
                <Mail className="w-3 h-3" />
                Email Vendor
              </>
            )}
          </Button>
          <Button size="sm" className="gap-2" onClick={handleViewMatches}>
            <Sparkles className="w-3 h-3" />
            View Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
