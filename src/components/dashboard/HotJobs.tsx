import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobRequirement } from '@/types';
import { Flame, MapPin, Clock, DollarSign, TrendingUp, Target, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterType = 'all' | 'high-rate' | 'more-matches' | 'latest' | 'location';

interface HotJobsProps {
  jobs: JobRequirement[];
}

export function HotJobs({ jobs }: HotJobsProps) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [locationFilter, setLocationFilter] = useState<string>('');

  // Get all open jobs
  const openJobs = jobs.filter(job => job.status === 'open');

  // Get unique locations for dropdown
  const uniqueLocations = [...new Set(openJobs.map(job => job.location))];

  // Apply filters and sorting
  const getFilteredJobs = () => {
    let filteredJobs = [...openJobs];

    switch (activeFilter) {
      case 'high-rate':
        filteredJobs.sort((a, b) => b.rate.max - a.rate.max);
        break;
      case 'more-matches':
        filteredJobs.sort((a, b) => (b.matchedConsultants || 0) - (a.matchedConsultants || 0));
        break;
      case 'latest':
        filteredJobs.sort((a, b) => {
          // Parse deadline dates for sorting
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'location':
        if (locationFilter) {
          filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(locationFilter.toLowerCase())
          );
        }
        break;
      default:
        // 'all' - no sorting, keep original order
        break;
    }

    return filteredJobs.slice(0, 4);
  };

  const hotJobs = getFilteredJobs();

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}/matches`);
  };

  const handleFilterClick = (filter: FilterType) => {
    if (filter === 'location') {
      // Location filter is handled by dropdown
      return;
    }
    setActiveFilter(filter);
    setLocationFilter('');
  };

  const handleLocationSelect = (location: string) => {
    setActiveFilter('location');
    setLocationFilter(location);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Hot Job Openings</h3>
          <Badge variant="secondary" className="text-xs">
            {openJobs.length}
          </Badge>
        </div>
        <Flame className="w-5 h-5 text-accent" />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterClick('all')}
          className="text-xs"
        >
          All
        </Button>
        <Button
          variant={activeFilter === 'high-rate' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterClick('high-rate')}
          className="text-xs gap-1"
        >
          <Flame className="w-3 h-3" />
          High Rate
        </Button>
        <Button
          variant={activeFilter === 'more-matches' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterClick('more-matches')}
          className="text-xs gap-1"
        >
          <Target className="w-3 h-3" />
          More Matches
        </Button>
        <Button
          variant={activeFilter === 'latest' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterClick('latest')}
          className="text-xs gap-1"
        >
          <TrendingUp className="w-3 h-3" />
          Latest
        </Button>
        
        {/* Location Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={activeFilter === 'location' ? 'default' : 'outline'}
              size="sm"
              className="text-xs gap-1"
            >
              <MapPin className="w-3 h-3" />
              {locationFilter || 'Location'}
              <Filter className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setActiveFilter('all'); setLocationFilter(''); }}>
              All Locations
            </DropdownMenuItem>
            {uniqueLocations.map((location) => (
              <DropdownMenuItem 
                key={location} 
                onClick={() => handleLocationSelect(location)}
              >
                {location}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-4">
        {hotJobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No jobs match the selected filter
          </div>
        ) : (
          hotJobs.map((job) => (
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
          ))
        )}
      </div>
    </div>
  );
}