import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, DollarSign, FileEdit, Send, CheckCircle, Globe, Mail } from 'lucide-react';
import { JobMatch } from '@/data/mockJobMatches';
import { cn } from '@/lib/utils';

interface MatchedConsultantCardProps {
  match: JobMatch;
  index: number;
  onTailorResume: () => void;
  onSubmit: () => void;
  isTailored: boolean;
  sourceType?: 'portal' | 'vendor_email';
}

export function MatchedConsultantCard({ 
  match, 
  index, 
  onTailorResume, 
  onSubmit,
  isTailored,
  sourceType = 'vendor_email'
}: MatchedConsultantCardProps) {
  const { consultant, matchScore, matchingSkills, missingSkills } = match;
  
  const isPortal = sourceType === 'portal';
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 85) return 'bg-success';
    if (score >= 70) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  return (
    <div 
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-glow transition-all duration-300 animate-slide-up opacity-0"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{consultant.name}</h3>
            <Badge variant="outline" className="text-xs">{consultant.visaStatus}</Badge>
            {isTailored && (
              <Badge className="bg-success/20 text-success border border-success/30 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Resume Tailored
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {consultant.location}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ${consultant.rate}/hr
            </div>
            <span>{consultant.experience} years exp.</span>
          </div>
        </div>
        
        {/* Match Score */}
        <div className="text-right">
          <div className={cn("text-3xl font-bold", getScoreColor(matchScore))}>
            {matchScore}%
          </div>
          <span className="text-xs text-muted-foreground">Match Score</span>
          <div className="w-24 mt-2">
            <Progress 
              value={matchScore} 
              className="h-2"
              style={{ 
                ['--progress-background' as string]: matchScore >= 85 ? 'hsl(var(--success))' : matchScore >= 70 ? 'hsl(var(--warning))' : 'hsl(var(--muted-foreground))'
              }}
            />
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="space-y-3 mb-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground mb-2 block">Matching Skills</span>
          <div className="flex flex-wrap gap-2">
            {matchingSkills.map(skill => (
              <Badge 
                key={skill} 
                className="bg-success/20 text-success border border-success/30"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        {missingSkills.length > 0 && (
          <div>
            <span className="text-xs font-medium text-muted-foreground mb-2 block">Missing Skills</span>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map(skill => (
                <Badge 
                  key={skill} 
                  variant="outline"
                  className="text-muted-foreground border-border"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Summary */}
      <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
        {consultant.aiSummary}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          className="flex-1 gap-2"
          onClick={onTailorResume}
        >
          <FileEdit className="w-4 h-4" />
          {isTailored ? 'View Tailored Resume' : 'Tailor Resume'}
        </Button>
        <Button 
          className={cn(
            "flex-1 gap-2",
            isPortal && "bg-blue-600 hover:bg-blue-700"
          )}
          onClick={onSubmit}
        >
          {isPortal ? (
            <>
              <Globe className="w-4 h-4" />
              Submit to Portal
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Submit to Vendor
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
