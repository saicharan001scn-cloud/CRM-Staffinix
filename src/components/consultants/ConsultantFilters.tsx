import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

interface ConsultantFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  visaFilter: string;
  setVisaFilter: (value: string) => void;
}

export function ConsultantFilters({ 
  statusFilter, 
  setStatusFilter, 
  visaFilter, 
  setVisaFilter 
}: ConsultantFiltersProps) {
  const hasFilters = statusFilter !== 'all' || visaFilter !== 'all';

  const clearFilters = () => {
    setStatusFilter('all');
    setVisaFilter('all');
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filters:</span>
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40 bg-secondary border-0">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="bench">Bench</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="interview">Interview</SelectItem>
          <SelectItem value="placed">Placed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={visaFilter} onValueChange={setVisaFilter}>
        <SelectTrigger className="w-40 bg-secondary border-0">
          <SelectValue placeholder="Visa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Visa</SelectItem>
          <SelectItem value="H1B">H1B</SelectItem>
          <SelectItem value="OPT">OPT</SelectItem>
          <SelectItem value="GC">Green Card</SelectItem>
          <SelectItem value="USC">US Citizen</SelectItem>
          <SelectItem value="H4 EAD">H4 EAD</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
          <X className="w-3 h-3" />
          Clear
        </Button>
      )}

      {hasFilters && (
        <div className="flex items-center gap-2 ml-auto">
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('all')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {visaFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Visa: {visaFilter}
              <button onClick={() => setVisaFilter('all')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
