import { Consultant } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Mail, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Consultant</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Skills</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Visa</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rate</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Location</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Match</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultants.map((consultant, index) => (
              <tr 
                key={consultant.id} 
                className="table-row-hover border-b border-border last:border-0 animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {consultant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{consultant.name}</p>
                      <p className="text-xs text-muted-foreground">{consultant.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {consultant.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {consultant.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{consultant.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="text-xs font-medium">
                    {consultant.visaStatus}
                  </Badge>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground font-medium">${consultant.rate}/hr</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{consultant.location}</span>
                </td>
                <td className="p-4">
                  <Badge className={cn("badge-status border", statusColors[consultant.status])}>
                    {consultant.status.charAt(0).toUpperCase() + consultant.status.slice(1)}
                  </Badge>
                </td>
                <td className="p-4">
                  {consultant.matchScore && (
                    <div className={cn(
                      "match-score text-xs",
                      consultant.matchScore >= 85 ? "match-score-high" :
                      consultant.matchScore >= 70 ? "match-score-medium" : "match-score-low"
                    )}>
                      {consultant.matchScore}
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="gap-2">
                        <FileText className="w-4 h-4" />
                        View Resume
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Mail className="w-4 h-4" />
                        Send Marketing Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Generate Summary
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
  );
}
