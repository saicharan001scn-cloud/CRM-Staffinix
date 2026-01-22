import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Ticket, 
  Percent,
  DollarSign,
  Calendar,
  Copy
} from 'lucide-react';
import { Coupon } from '@/types/billing';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface CouponsManagerProps {
  coupons: Coupon[];
  onCreateCoupon: (coupon: Partial<Coupon>) => Promise<{ error: Error | null }>;
}

export const CouponsManager = ({
  coupons,
  onCreateCoupon
}: CouponsManagerProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const resetForm = () => {
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMaxUses('');
    setValidUntil('');
  };

  const handleSubmit = async () => {
    if (!code || !discountValue) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onCreateCoupon({
        code: code.toUpperCase(),
        description,
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        max_uses: maxUses ? parseInt(maxUses) : null,
        valid_until: validUntil || null,
        is_active: true
      });

      if (result.error) {
        toast.error('Failed to create coupon');
      } else {
        toast.success('Coupon created successfully');
        setIsCreateModalOpen(false);
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    toast.success('Coupon code copied');
  };

  const activeCoupons = coupons.filter(c => c.is_active);
  const expiredCoupons = coupons.filter(c => !c.is_active);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Discount Coupons ({coupons.length})
        </CardTitle>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {coupon.discount_type === 'percentage' ? (
                  <Percent className="h-5 w-5 text-primary" />
                ) : (
                  <DollarSign className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <code className="font-mono font-bold text-lg">{coupon.code}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyCode(coupon.code)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{coupon.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <Badge variant="secondary" className="text-lg">
                  {coupon.discount_type === 'percentage' 
                    ? `${coupon.discount_value}% OFF`
                    : `$${coupon.discount_value} OFF`
                  }
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {coupon.times_used}/{coupon.max_uses || '∞'} uses
                </div>
              </div>
              {coupon.valid_until && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Expires {format(new Date(coupon.valid_until), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>
        ))}

        {activeCoupons.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Ticket className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No active coupons</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create your first coupon
            </Button>
          </div>
        )}
      </CardContent>

      {/* Create Coupon Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎫 Create Discount Coupon</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g., SUMMER2024"
                  className="font-mono"
                />
                <Button variant="outline" onClick={generateCode}>
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summer sale discount"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select value={discountType} onValueChange={(v) => setDiscountType(v as 'percentage' | 'fixed')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {discountType === 'percentage' ? '%' : '$'}
                  </span>
                  <Input
                    id="discountValue"
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="pl-8"
                    placeholder={discountType === 'percentage' ? '20' : '50'}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUses">Usage Limit</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Expires On</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
