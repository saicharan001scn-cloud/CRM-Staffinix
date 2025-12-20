import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockConsultants } from '@/data/mockData';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText,
  Sparkles,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  available: 'bg-success/20 text-success border-success/30',
  bench: 'bg-info/20 text-info border-info/30',
  marketing: 'bg-warning/20 text-warning border-warning/30',
  interview: 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  placed: 'bg-primary/20 text-primary border-primary/30',
};

export default function ConsultantProfile() {
  const { consultantId } = useParams<{ consultantId: string }>();
  const navigate = useNavigate();
  
  const consultant = mockConsultants.find(c => c.id === consultantId);

  if (!consultant) {
    return (
      <MainLayout title="Consultant Not Found" subtitle="">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4 text-sm">No consultant found.</p>
          <Button onClick={() => navigate('/consultants')} variant="outline" size="sm">
            <ArrowLeft className="w-3 h-3 mr-2" />
            Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={consultant.name}
      subtitle="Consultant Profile"
    >
      <Button 
        onClick={() => navigate('/consultants')} 
        variant="ghost" 
        size="sm" 
        className="mb-4 gap-2 text-xs"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to Consultants
      </Button>

      <div className="grid grid-cols-3 gap-4">
        {/* Main Info */}
        <Card className="col-span-2 p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {consultant.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold text-foreground">{consultant.name}</h2>
                <Badge className={cn("border text-xs", statusColors[consultant.status])}>
                  {consultant.status.charAt(0).toUpperCase() + consultant.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  {consultant.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  {consultant.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {consultant.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-3 h-3" />
                  {consultant.experience} years experience
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1">
              {consultant.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          {consultant.aiSummary && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-primary" />
                <h3 className="text-xs font-medium text-muted-foreground">AI Summary</h3>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{consultant.aiSummary}</p>
            </div>
          )}
        </Card>

        {/* Side Info */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-3">Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Visa Status</span>
                <Badge variant="outline" className="text-xs">{consultant.visaStatus}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Rate</span>
                <span className="text-xs font-medium text-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {consultant.rate}/hr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Match Score</span>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  consultant.matchScore && consultant.matchScore >= 85 
                    ? "bg-success/20 text-success" 
                    : consultant.matchScore && consultant.matchScore >= 70 
                    ? "bg-warning/20 text-warning" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {consultant.matchScore || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Last Updated</span>
                <span className="text-xs text-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {consultant.lastUpdated}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-3">Resume</h3>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Resume_Sample.pdf</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs h-7">
                View Resume
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
