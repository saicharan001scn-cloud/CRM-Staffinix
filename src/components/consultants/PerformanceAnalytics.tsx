import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  Send, 
  Users, 
  Gift, 
  CheckCircle2,
  Clock,
  Target,
  Download,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceAnalyticsProps {
  consultantId: string;
}

const mockTimelineData = [
  { month: 'Aug 2024', submissions: 2, interviews: 1, offers: 0, placements: 0 },
  { month: 'Sep 2024', submissions: 4, interviews: 2, offers: 1, placements: 1 },
  { month: 'Oct 2024', submissions: 3, interviews: 2, offers: 1, placements: 0 },
  { month: 'Nov 2024', submissions: 5, interviews: 3, offers: 2, placements: 1 },
  { month: 'Dec 2024', submissions: 4, interviews: 3, offers: 2, placements: 2 },
  { month: 'Jan 2025', submissions: 6, interviews: 4, offers: 2, placements: 1 },
];

const mockSubmissionHistory = [
  { id: 1, date: 'Jan 15, 2025', jobTitle: 'Senior Java Developer', client: 'Google', status: 'Submitted', interview: 'Scheduled', feedback: 'positive' },
  { id: 2, date: 'Jan 10, 2025', jobTitle: 'React Developer', client: 'Microsoft', status: 'Interview', interview: 'Completed', feedback: 'strong' },
  { id: 3, date: 'Jan 05, 2025', jobTitle: 'Full Stack Engineer', client: 'Amazon', status: 'Placed', interview: '2 Rounds', feedback: 'offered' },
  { id: 4, date: 'Dec 20, 2024', jobTitle: 'Backend Developer', client: 'Meta', status: 'Rejected', interview: 'Completed', feedback: 'negative' },
  { id: 5, date: 'Dec 15, 2024', jobTitle: 'Cloud Architect', client: 'Netflix', status: 'Placed', interview: '3 Rounds', feedback: 'offered' },
];

const timeFilters = ['Last 30 days', 'Last 90 days', 'Last 6 months', 'Last Year', 'All Time'];

const feedbackConfig: Record<string, { icon: string; color: string; label: string }> = {
  positive: { icon: '✅', color: 'text-success', label: 'Positive' },
  strong: { icon: '⭐', color: 'text-warning', label: 'Strong' },
  offered: { icon: '💰', color: 'text-primary', label: 'Offered' },
  negative: { icon: '❌', color: 'text-destructive', label: 'Rejected' },
};

const statusColors: Record<string, string> = {
  Submitted: 'bg-info/20 text-info border-info/30',
  Interview: 'bg-warning/20 text-warning border-warning/30',
  Placed: 'bg-success/20 text-success border-success/30',
  Rejected: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function PerformanceAnalytics({ consultantId }: PerformanceAnalyticsProps) {
  const [selectedFilter, setSelectedFilter] = useState('Last 6 months');

  // Calculate summary metrics
  const totalSubmissions = mockTimelineData.reduce((acc, d) => acc + d.submissions, 0);
  const totalInterviews = mockTimelineData.reduce((acc, d) => acc + d.interviews, 0);
  const totalOffers = mockTimelineData.reduce((acc, d) => acc + d.offers, 0);
  const totalPlacements = mockTimelineData.reduce((acc, d) => acc + d.placements, 0);

  const submissionToInterviewRate = Math.round((totalInterviews / totalSubmissions) * 100);
  const interviewToOfferRate = Math.round((totalOffers / totalInterviews) * 100);
  const offerToPlacementRate = Math.round((totalPlacements / totalOffers) * 100);

  // Last 30 days (last entry)
  const last30Days = mockTimelineData[mockTimelineData.length - 1];

  return (
    <Card className="p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Performance Analytics</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <Download className="w-3 h-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Period Filters */}
      <div className="flex flex-wrap gap-1 mb-4">
        {timeFilters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? 'default' : 'outline'}
            size="sm"
            className="h-6 text-[10px] px-2"
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="p-3 bg-chart-1/5 border-chart-1/20">
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-3 h-3 text-chart-1" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Submissions</span>
          </div>
          <p className="text-xl font-bold text-foreground">{totalSubmissions}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-[10px] text-success">+12% vs prev</span>
          </div>
        </Card>

        <Card className="p-3 bg-chart-2/5 border-chart-2/20">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-chart-2" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Last 30 Days</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-foreground">Submissions: <span className="font-semibold">{last30Days.submissions}</span></p>
            <p className="text-xs text-foreground">Interviews: <span className="font-semibold">{last30Days.interviews}</span></p>
            <p className="text-xs text-foreground">Offers: <span className="font-semibold">{last30Days.offers}</span></p>
          </div>
        </Card>

        <Card className="p-3 bg-chart-3/5 border-chart-3/20">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-3 h-3 text-chart-3" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Success Rates</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-foreground">Sub → Int: <span className="font-semibold">{submissionToInterviewRate}%</span></p>
            <p className="text-xs text-foreground">Int → Offer: <span className="font-semibold">{interviewToOfferRate}%</span></p>
            <p className="text-xs text-foreground">Offer → Place: <span className="font-semibold">{offerToPlacementRate}%</span></p>
          </div>
        </Card>

        <Card className="p-3 bg-chart-4/5 border-chart-4/20">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-3 h-3 text-chart-4" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Average Time</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-foreground">Sub to Int: <span className="font-semibold">7 days</span></p>
            <p className="text-xs text-foreground">Int to Offer: <span className="font-semibold">14 days</span></p>
            <p className="text-xs text-foreground">Total: <span className="font-semibold">21 days</span></p>
          </div>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card className="p-4 mb-4 bg-muted/30">
        <h4 className="text-xs font-medium text-muted-foreground mb-3">Performance Timeline</h4>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTimelineData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10 }} 
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="submissions" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 3 }}
                name="Submissions"
              />
              <Line 
                type="monotone" 
                dataKey="interviews" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 3 }}
                name="Interviews"
              />
              <Line 
                type="monotone" 
                dataKey="offers" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 3 }}
                name="Offers"
              />
              <Line 
                type="monotone" 
                dataKey="placements" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 2, r: 3 }}
                name="Placements"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-3 mb-4 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-medium text-foreground">Performance Insights</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Strongest in:</strong> Java/Spring Boot roles (80% interview rate)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Peak performance:</strong> Q4 2024 (2 placements)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Recommended:</strong> Focus on FinTech clients (highest conversion)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Benchmark:</strong> Interview success 67% vs agency avg 55% ✅</span>
          </li>
        </ul>
      </Card>

      {/* Submission History Table */}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Submission History</h4>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-[10px] h-8">#</TableHead>
                <TableHead className="text-[10px] h-8">Date</TableHead>
                <TableHead className="text-[10px] h-8">Job Title</TableHead>
                <TableHead className="text-[10px] h-8">Client</TableHead>
                <TableHead className="text-[10px] h-8">Status</TableHead>
                <TableHead className="text-[10px] h-8">Interview</TableHead>
                <TableHead className="text-[10px] h-8">Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSubmissionHistory.map((row, index) => (
                <TableRow key={row.id} className="hover:bg-muted/30">
                  <TableCell className="text-[10px] py-2">{index + 1}</TableCell>
                  <TableCell className="text-[10px] py-2">{row.date}</TableCell>
                  <TableCell className="text-[10px] py-2 font-medium">{row.jobTitle}</TableCell>
                  <TableCell className="text-[10px] py-2">{row.client}</TableCell>
                  <TableCell className="py-2">
                    <Badge className={cn("text-[9px] px-1.5 py-0", statusColors[row.status])}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[10px] py-2">{row.interview}</TableCell>
                  <TableCell className="py-2">
                    <span className={cn("text-xs", feedbackConfig[row.feedback]?.color)}>
                      {feedbackConfig[row.feedback]?.icon} {feedbackConfig[row.feedback]?.label}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-[10px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Total Placements: <strong className="text-foreground">{totalPlacements}</strong></span>
          <span>Avg Rating: <strong className="text-foreground">4.8/5</strong></span>
          <span>Top Skill: <strong className="text-foreground">Java</strong></span>
        </div>
        <span>Last updated: Today</span>
      </div>
    </Card>
  );
}
