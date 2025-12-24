import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Consultant } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, User, FileText, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ResumeViewer } from './ResumeViewer';

interface ConsultantTableProps {
  consultants: Consultant[];
}

const statusColors: Record<string, string> = {
  available: 'bg-success/20 text-success border-success/30',
  bench: 'bg-info/20 text-info border-info/30',
  marketing: 'bg-warning/20 text-warning border-warning/30',
  interview: 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  placed: 'bg-primary/20 text-primary border-primary/30',
};

export function ConsultantTable({ consultants }: ConsultantTableProps) {
  const navigate = useNavigate();
  const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);

  const handleViewProfile = (consultant: Consultant) => {
    navigate(`/consultants/${consultant.id}`);
  };

  const handleViewResume = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setResumeViewerOpen(true);
  };

  const handleEdit = (consultant: Consultant) => {
    toast.info(`Edit ${consultant.name} - Coming soon`);
  };

  const handleDelete = (consultant: Consultant) => {
    toast.error(`Delete ${consultant.name} - Coming soon`);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Consultant</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Skills</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Visa</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Rate</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Location</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Match</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultants.map((consultant, index) => (
                <tr 
                  key={consultant.id} 
                  className="table-row-hover border-b border-border last:border-0 animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {consultant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">{consultant.name}</p>
                        <p className="text-[10px] text-muted-foreground">{consultant.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {consultant.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {skill}
                        </Badge>
                      ))}
                      {consultant.skills.length > 2 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          +{consultant.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">
                      {consultant.visaStatus}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <span className="text-xs text-foreground font-medium">${consultant.rate}/hr</span>
                  </td>
                  <td className="p-3">
                    <span className="text-xs text-muted-foreground">{consultant.location}</span>
                  </td>
                  <td className="p-3">
                    <Badge className={cn("badge-status border text-[10px] px-1.5 py-0", statusColors[consultant.status])}>
                      {consultant.status.charAt(0).toUpperCase() + consultant.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {consultant.matchScore && (
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold",
                        consultant.matchScore >= 85 ? "bg-success/20 text-success border border-success/30" :
                        consultant.matchScore >= 70 ? "bg-warning/20 text-warning border border-warning/30" : 
                        "bg-destructive/20 text-destructive border border-destructive/30"
                      )}>
                        {consultant.matchScore}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          className="gap-2 text-xs" 
                          onClick={() => handleViewProfile(consultant)}
                        >
                          <User className="w-3 h-3" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-xs"
                          onClick={() => handleViewResume(consultant)}
                        >
                          <FileText className="w-3 h-3" />
                          View Resume
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 text-xs"
                          onClick={() => handleEdit(consultant)}
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-xs text-destructive"
                          onClick={() => handleDelete(consultant)}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resume Viewer */}
      <ResumeViewer
        open={resumeViewerOpen}
        onClose={() => setResumeViewerOpen(false)}
        consultant={selectedConsultant}
      />
    </>
  );
}
