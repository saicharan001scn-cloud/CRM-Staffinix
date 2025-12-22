import { useNavigate } from 'react-router-dom';
import { JobRequirement } from '@/types';
import { Flame, MapPin, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HotJobsProps {
  jobs: JobRequirement[];
}

export function HotJobs({ jobs }: HotJobsProps) {
  const navigate = useNavigate();
  const hotJobs = jobs.filter(job => job.status === 'open').slice(0, 4);

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}/matches`);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Hot Job Openings</h3>
        <Flame className="w-5 h-5 text-accent" />
      </div>
      
      <div className="space-y-4">
        {hotJobs.map((job) => (
          <div 
            key={job.id}
            onClick={() => handleJobClick(job.id)}
            className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h4>
              <Badge variant="secondary" className="text-xs">
                {job.matchedConsultants} matches
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">{job.client}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                ${job.rate.min}-${job.rate.max}/hr
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.deadline}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {job.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
