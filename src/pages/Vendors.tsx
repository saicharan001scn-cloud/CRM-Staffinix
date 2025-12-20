import { MainLayout } from '@/components/layout/MainLayout';
import { VendorTable } from '@/components/vendors/VendorTable';
import { mockVendors } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Building2, Trophy, Mail } from 'lucide-react';

export default function Vendors() {
  const totalSubmissions = mockVendors.reduce((acc, v) => acc + v.totalSubmissions, 0);
  const totalPlacements = mockVendors.reduce((acc, v) => acc + v.placements, 0);

  return (
    <MainLayout
      title="Vendors"
      subtitle="Manage your vendor relationships"
      action={{ label: 'Add Vendor', onClick: () => {} }}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{mockVendors.length}</p>
            <p className="text-sm text-muted-foreground">Total Vendors</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-info" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalSubmissions}</p>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalPlacements}</p>
            <p className="text-sm text-muted-foreground">Total Placements</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {((totalPlacements / totalSubmissions) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <VendorTable vendors={mockVendors} />
    </MainLayout>
  );
}
