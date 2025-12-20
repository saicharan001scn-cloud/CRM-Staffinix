import { useState } from 'react';
import { Vendor } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Mail, Phone, Star, Eye, Ban, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface VendorTableProps {
  vendors: Vendor[];
}

export function VendorTable({ vendors }: VendorTableProps) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [blockedVendors, setBlockedVendors] = useState<Set<string>>(new Set());

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDetailsModalOpen(true);
  };

  const handleBlockVendor = (vendor: Vendor) => {
    const newBlocked = new Set(blockedVendors);
    if (newBlocked.has(vendor.id)) {
      newBlocked.delete(vendor.id);
      toast.success(`${vendor.companyName} unblocked`);
    } else {
      newBlocked.add(vendor.id);
      toast.warning(`${vendor.companyName} blocked`);
    }
    setBlockedVendors(newBlocked);
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Vendor</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Contact</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Submissions</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Placements</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Trust Score</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Last Interaction</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr 
                  key={vendor.id} 
                  className={cn(
                    "table-row-hover border-b border-border last:border-0 animate-fade-in opacity-0",
                    blockedVendors.has(vendor.id) && "opacity-50"
                  )}
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs font-medium text-foreground">{vendor.companyName}</p>
                        <p className="text-[10px] text-muted-foreground">{vendor.recruiterName}</p>
                      </div>
                      {blockedVendors.has(vendor.id) && (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0">Blocked</Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <button 
                        className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        onClick={() => handleEmailClick(vendor.email)}
                      >
                        <Mail className="w-3 h-3" />
                        {vendor.email}
                        <ExternalLink className="w-2 h-2" />
                      </button>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {vendor.phone}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-xs font-medium text-foreground">{vendor.totalSubmissions}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-xs font-medium text-success">{vendor.placements}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <div className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium",
                        vendor.trustScore >= 90 ? "bg-success/20 text-success" :
                        vendor.trustScore >= 80 ? "bg-warning/20 text-warning" :
                        "bg-destructive/20 text-destructive"
                      )}>
                        <Star className="w-2 h-2" />
                        {vendor.trustScore}%
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] text-muted-foreground">{vendor.lastInteraction}</span>
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
                          onClick={() => handleViewDetails(vendor)}
                        >
                          <Eye className="w-3 h-3" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-xs"
                          onClick={() => handleEmailClick(vendor.email)}
                        >
                          <Mail className="w-3 h-3" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className={cn(
                            "gap-2 text-xs",
                            blockedVendors.has(vendor.id) ? "text-success" : "text-destructive"
                          )}
                          onClick={() => handleBlockVendor(vendor)}
                        >
                          <Ban className="w-3 h-3" />
                          {blockedVendors.has(vendor.id) ? 'Unblock Vendor' : 'Block Vendor'}
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

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Vendor Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-semibold text-foreground">{selectedVendor.companyName}</h3>
                <p className="text-xs text-muted-foreground">{selectedVendor.recruiterName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Email</span>
                  <button 
                    className="block text-primary hover:underline mt-0.5"
                    onClick={() => handleEmailClick(selectedVendor.email)}
                  >
                    {selectedVendor.email}
                  </button>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone</span>
                  <p className="text-foreground mt-0.5">{selectedVendor.phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Submissions</span>
                  <p className="text-foreground font-medium mt-0.5">{selectedVendor.totalSubmissions}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Placements</span>
                  <p className="text-success font-medium mt-0.5">{selectedVendor.placements}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trust Score</span>
                  <div className={cn(
                    "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium mt-0.5",
                    selectedVendor.trustScore >= 90 ? "bg-success/20 text-success" :
                    selectedVendor.trustScore >= 80 ? "bg-warning/20 text-warning" :
                    "bg-destructive/20 text-destructive"
                  )}>
                    <Star className="w-2 h-2" />
                    {selectedVendor.trustScore}%
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Interaction</span>
                  <p className="text-foreground mt-0.5">{selectedVendor.lastInteraction}</p>
                </div>
              </div>

              {selectedVendor.notes && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <span className="text-[10px] text-muted-foreground">Notes</span>
                  <p className="text-xs text-foreground mt-0.5">{selectedVendor.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
