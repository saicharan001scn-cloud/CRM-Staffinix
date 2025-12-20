import { Vendor } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Mail, Phone, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VendorTableProps {
  vendors: Vendor[];
}

export function VendorTable({ vendors }: VendorTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vendor</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Submissions</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Placements</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Trust Score</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Interaction</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, index) => (
              <tr 
                key={vendor.id} 
                className="table-row-hover border-b border-border last:border-0 animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <td className="p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{vendor.companyName}</p>
                    <p className="text-xs text-muted-foreground">{vendor.recruiterName}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {vendor.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {vendor.phone}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium text-foreground">{vendor.totalSubmissions}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium text-success">{vendor.placements}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      vendor.trustScore >= 90 ? "bg-success/20 text-success" :
                      vendor.trustScore >= 80 ? "bg-warning/20 text-warning" :
                      "bg-destructive/20 text-destructive"
                    )}>
                      <Star className="w-3 h-3" />
                      {vendor.trustScore}%
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{vendor.lastInteraction}</span>
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
                        <Mail className="w-4 h-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Phone className="w-4 h-4" />
                        Call Vendor
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
