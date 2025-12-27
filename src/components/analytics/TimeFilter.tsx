import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export type TimeFilterType = 'weekly' | 'monthly' | 'quarterly' | 'custom';

interface TimeFilterProps {
  activeFilter: TimeFilterType;
  onFilterChange: (filter: TimeFilterType) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function TimeFilter({ activeFilter, onFilterChange, dateRange, onDateRangeChange }: TimeFilterProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleFilterClick = (filter: TimeFilterType) => {
    onFilterChange(filter);
    if (filter !== 'custom') {
      const today = new Date();
      let from: Date;
      
      switch (filter) {
        case 'weekly':
          from = subDays(today, 7);
          break;
        case 'monthly':
          from = subDays(today, 30);
          break;
        case 'quarterly':
          from = subDays(today, 90);
          break;
        default:
          from = subDays(today, 7);
      }
      
      onDateRangeChange({ from, to: today });
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
    if (range?.from && range?.to) {
      setCalendarOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
        <Button
          variant={activeFilter === 'weekly' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => handleFilterClick('weekly')}
        >
          Weekly
        </Button>
        <Button
          variant={activeFilter === 'monthly' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => handleFilterClick('monthly')}
        >
          Monthly
        </Button>
        <Button
          variant={activeFilter === 'quarterly' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => handleFilterClick('quarterly')}
        >
          Quarterly
        </Button>
      </div>

      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={activeFilter === 'custom' ? 'secondary' : 'outline'}
            size="sm"
            className={cn(
              "h-7 text-xs gap-2 justify-start",
              activeFilter === 'custom' && "bg-secondary"
            )}
            onClick={() => onFilterChange('custom')}
          >
            <CalendarIcon className="h-3 w-3" />
            {activeFilter === 'custom' && dateRange?.from && dateRange?.to ? (
              <span>
                {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd, yyyy')}
              </span>
            ) : (
              <span>Custom Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {dateRange?.from && dateRange?.to && (
        <span className="text-xs text-muted-foreground ml-2">
          {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
        </span>
      )}
    </div>
  );
}
