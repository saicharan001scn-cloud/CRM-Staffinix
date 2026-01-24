import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCompanyAdmins } from '@/hooks/useCompanyAdmins';
import { FullScreenCompanyActions } from './FullScreenCompanyActions';
import { CreateCompanyAdminModal } from './CreateCompanyAdminModal';
import type { CompanyAdmin, CompanyAdminFilters } from '@/types/companyAdmin';
import { formatDistanceToNow } from 'date-fns';
import {
  Search,
  UserPlus,
  Building2,
  AlertTriangle,
  Circle,
  Filter,
} from 'lucide-react';

export function CompanyAdminsDashboard() {
  const {
    admins,
    loading,
    error,
    filters,
    setFilters,
    statusCounts,
    needsAttention,
    refetch,
  } = useCompanyAdmins();

  const [selectedAdmin, setSelectedAdmin] = useState<CompanyAdmin | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleAdminClick = (admin: CompanyAdmin) => {
    setSelectedAdmin(admin);
    setActionsOpen(true);
  };

  const handleCloseActions = () => {
    setActionsOpen(false);
    setSelectedAdmin(null);
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev: CompanyAdminFilters) => ({ ...prev, search: value }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev: CompanyAdminFilters) => ({ 
      ...prev, 
      status: value as CompanyAdminFilters['status'] 
    }));
  };

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    refetch();
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30">Trial</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">Suspended</Badge>;
      case 'past_due':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">Past Due</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={refetch}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Company Admins
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage company administrators and their platform access
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create New Company Admin
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'All', value: statusCounts.all, color: 'bg-muted' },
          { label: 'Active', value: statusCounts.active, color: 'bg-green-500/20' },
          { label: 'Trial', value: statusCounts.trial, color: 'bg-blue-500/20' },
          { label: 'Suspended', value: statusCounts.suspended, color: 'bg-red-500/20' },
          { label: 'Past Due', value: statusCounts.past_due, color: 'bg-amber-500/20' },
          { label: 'Cancelled', value: statusCounts.cancelled, color: 'bg-gray-500/20' },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${
              filters.status === stat.label.toLowerCase() ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleStatusFilter(stat.label.toLowerCase())}
          >
            <CardContent className="py-3 px-4">
              <div className={`text-2xl font-bold ${stat.color} inline-block px-2 py-0.5 rounded`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Needs Attention Alert */}
      {needsAttention.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">{needsAttention.length} companies need attention</span>
              <span className="text-sm text-amber-400/70">
                (trial ending soon, suspended, or past due)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filters.status} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="past_due">Past Due</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Admins Table */}
      <Card className="overflow-hidden">
        <CardHeader className="py-4">
          <CardTitle className="text-base font-medium">
            {admins.length} Company Admin{admins.length !== 1 ? 's' : ''}
            {filters.status !== 'all' && ` (${filters.status})`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {admins.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No company admins found</p>
              {filters.search || filters.status !== 'all' ? (
                <Button
                  variant="link"
                  onClick={() => setFilters({ search: '', status: 'all' })}
                >
                  Clear filters
                </Button>
              ) : null}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Session</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleAdminClick(admin)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {admin.company_name || 'Unknown Company'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={admin.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(admin.full_name, admin.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {admin.full_name || 'No Name'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(admin.company_status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {admin.last_login
                          ? formatDistanceToNow(new Date(admin.last_login), { addSuffix: true })
                          : 'Never'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Circle
                          className={`h-2 w-2 fill-current ${
                            admin.is_online ? 'text-green-400' : 'text-gray-400'
                          }`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {admin.is_online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Full Screen Actions Panel */}
      <FullScreenCompanyActions
        admin={selectedAdmin}
        open={actionsOpen}
        onClose={handleCloseActions}
        onActionComplete={refetch}
      />

      {/* Create Company Admin Modal */}
      <CreateCompanyAdminModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
