import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  X, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  submissions: number;
  interviews: number;
  offers: number;
  placements: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  performanceScore: 'above' | 'on' | 'below';
}

const mockTeamData: TeamMember[] = [
  { id: '1', name: 'John Smith', role: 'Recruiter', department: 'Recruiting', submissions: 45, interviews: 15, offers: 8, placements: 6, trend: 'up', trendValue: 12, performanceScore: 'above' },
  { id: '2', name: 'Sarah Johnson', role: 'Account Manager', department: 'Sales', submissions: 12, interviews: 6, offers: 4, placements: 3, trend: 'up', trendValue: 8, performanceScore: 'on' },
  { id: '3', name: 'Mike Chen', role: 'Recruiter', department: 'Recruiting', submissions: 38, interviews: 12, offers: 7, placements: 5, trend: 'down', trendValue: 5, performanceScore: 'on' },
  { id: '4', name: 'Emily Davis', role: 'Team Lead', department: 'Recruiting', submissions: 52, interviews: 20, offers: 12, placements: 9, trend: 'up', trendValue: 18, performanceScore: 'above' },
  { id: '5', name: 'Robert Wilson', role: 'Recruiter', department: 'Operations', submissions: 28, interviews: 8, offers: 4, placements: 2, trend: 'down', trendValue: 10, performanceScore: 'below' },
];

const dateRanges = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-quarter', label: 'This Quarter' },
  { value: 'custom', label: 'Custom Range' },
];

const roles = ['All', 'Recruiters', 'Account Managers', 'Team Leads'];
const departments = ['All', 'Recruiting', 'Sales', 'Operations'];
const sortOptions = ['Submissions (High to Low)', 'Placements', 'Revenue'];

export function TeamPerformance() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('this-month');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('Submissions (High to Low)');

  const filteredData = mockTeamData.filter(member => {
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'All' || 
      member.role.toLowerCase().includes(selectedRole.toLowerCase().replace('s', ''));
    
    const matchesDepartment = selectedDepartment === 'All' || 
      member.department === selectedDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'Placements') return b.placements - a.placements;
    return b.submissions - a.submissions;
  });

  const totals = {
    employees: filteredData.length,
    submissions: filteredData.reduce((acc, m) => acc + m.submissions, 0),
    interviews: filteredData.reduce((acc, m) => acc + m.interviews, 0),
    offers: filteredData.reduce((acc, m) => acc + m.offers, 0),
    placements: filteredData.reduce((acc, m) => acc + m.placements, 0),
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting as ${format}...`);
  };

  const handleRowClick = (memberId: string) => {
    toast.info('Employee analytics detail page coming soon');
  };

  const getPerformanceColor = (score: string) => {
    switch (score) {
      case 'above': return 'bg-success/20 text-success border-success/30';
      case 'on': return 'bg-warning/20 text-warning border-warning/30';
      case 'below': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">My Team Performance</h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem onClick={() => handleExport('PDF')}>
              PDF
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => handleExport('Excel')}>
              Excel
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => handleExport('CSV')}>
              CSV
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-sm bg-background"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map(range => (
              <SelectItem key={range.value} value={range.value} className="text-xs">
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role} value={role} className="text-xs">
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept} className="text-xs">
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option} value={option} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold">Employee Name</TableHead>
              <TableHead className="text-xs font-semibold">Role</TableHead>
              <TableHead className="text-xs font-semibold text-center">Submissions</TableHead>
              <TableHead className="text-xs font-semibold text-center">Interviews</TableHead>
              <TableHead className="text-xs font-semibold text-center">Offers</TableHead>
              <TableHead className="text-xs font-semibold text-center">Placements</TableHead>
              <TableHead className="text-xs font-semibold text-center">Trend</TableHead>
              <TableHead className="text-xs font-semibold text-center">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((member) => (
              <TableRow 
                key={member.id} 
                className="table-row-hover cursor-pointer"
                onClick={() => handleRowClick(member.id)}
              >
                <TableCell className="text-sm font-medium text-foreground">
                  {member.name}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {member.role}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-semibold text-foreground">{member.submissions}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-semibold text-foreground">{member.interviews}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-semibold text-foreground">{member.offers}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-semibold text-foreground">{member.placements}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    member.trend === 'up' ? 'text-success' : member.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                  )}>
                    {member.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : member.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    {member.trendValue}%
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={cn("text-[10px] border", getPerformanceColor(member.performanceScore))}>
                    {member.performanceScore === 'above' ? 'Above Target' : 
                     member.performanceScore === 'on' ? 'On Target' : 'Below Target'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Totals Row */}
      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">
            Total: {totals.employees} employees
          </span>
          <div className="flex items-center gap-6">
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{totals.submissions}</span> submissions
            </span>
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{totals.interviews}</span> interviews
            </span>
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{totals.offers}</span> offers
            </span>
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{totals.placements}</span> placements
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}