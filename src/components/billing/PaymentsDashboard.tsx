import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  RotateCcw,
  MoreVertical,
  Download,
  Mail,
  CreditCard,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Payment } from '@/types/billing';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { ManualPaymentModal } from './ManualPaymentModal';

interface PaymentsDashboardProps {
  payments: Payment[];
  onUpdatePayment: (id: string, updates: Partial<Payment>) => Promise<{ error: Error | null }>;
  onCreatePayment: (payment: Partial<Payment>) => Promise<{ error: Error | null }>;
}

export const PaymentsDashboard = ({
  payments,
  onUpdatePayment,
  onCreatePayment
}: PaymentsDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isManualPaymentOpen, setIsManualPaymentOpen] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRetryPayment = async (payment: Payment) => {
    toast.info(`Retrying payment for ${payment.company_name}...`);
    // In production, this would call a payment gateway
    await onUpdatePayment(payment.id, { status: 'pending' });
    toast.success('Payment retry initiated');
  };

  const handleRefund = async (payment: Payment) => {
    const result = await onUpdatePayment(payment.id, { 
      status: 'refunded',
      refunded_at: new Date().toISOString()
    });
    if (!result.error) {
      toast.success(`Refund processed for ${payment.company_name}`);
    }
  };

  const handleMarkPaid = async (payment: Payment) => {
    const result = await onUpdatePayment(payment.id, { status: 'succeeded' });
    if (!result.error) {
      toast.success(`Payment marked as successful`);
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      succeeded: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline',
      cancelled: 'outline'
    };

    const labels: Record<string, string> = {
      succeeded: 'Successful',
      pending: 'Pending',
      failed: 'Failed',
      refunded: 'Refunded',
      cancelled: 'Cancelled'
    };

    return (
      <Badge variant={variants[status] || 'secondary'} className="gap-1">
        {getStatusIcon(status)}
        {labels[status] || status}
      </Badge>
    );
  };

  // Calculate stats
  const stats = {
    total: payments.reduce((sum, p) => p.status === 'succeeded' ? sum + p.amount : sum, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    failed: payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0),
    successful: payments.filter(p => p.status === 'succeeded').reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          Recent Payments
        </CardTitle>
        <Button onClick={() => setIsManualPaymentOpen(true)} className="gap-2">
          <CreditCard className="h-4 w-4" />
          Add Manual Payment
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground">Total Revenue</div>
            <div className="text-xl font-bold text-green-600">${stats.total.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="text-xl font-bold text-yellow-600">${stats.pending.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground">Failed</div>
            <div className="text-xl font-bold text-red-600">${stats.failed.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground">Successful</div>
            <div className="text-xl font-bold text-primary">${stats.successful.toLocaleString()}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company or invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {statusFilter === 'all' ? 'All Status' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('succeeded')}>Successful</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('failed')}>Failed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('refunded')}>Refunded</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Payments List */}
        <div className="space-y-3">
          {filteredPayments.slice(0, 10).map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {getStatusIcon(payment.status)}
                </div>
                <div>
                  <div className="font-medium">{payment.company_name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{payment.invoice_number}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}</span>
                  </div>
                  {payment.failure_reason && (
                    <div className="text-xs text-red-500 mt-1">
                      Reason: {payment.failure_reason}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold">${payment.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(payment.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
                {getStatusBadge(payment.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Invoice
                    </DropdownMenuItem>
                    {payment.status === 'pending' && (
                      <DropdownMenuItem 
                        onClick={() => handleMarkPaid(payment)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                    {payment.status === 'failed' && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => handleRetryPayment(payment)}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Retry Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Mail className="h-4 w-4" />
                          Contact Customer
                        </DropdownMenuItem>
                      </>
                    )}
                    {payment.status === 'succeeded' && (
                      <DropdownMenuItem 
                        onClick={() => handleRefund(payment)}
                        className="gap-2 text-destructive"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Refund
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No payments found
            </div>
          )}
        </div>
      </CardContent>

      <ManualPaymentModal
        isOpen={isManualPaymentOpen}
        onClose={() => setIsManualPaymentOpen(false)}
        onSubmit={onCreatePayment}
      />
    </Card>
  );
};
