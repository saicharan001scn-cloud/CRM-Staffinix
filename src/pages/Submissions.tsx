import { MainLayout } from '@/components/layout/MainLayout';
import { SubmissionBoard } from '@/components/submissions/SubmissionBoard';
import { mockSubmissions } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Send, Calendar, CheckCircle } from 'lucide-react';

export default function Submissions() {
  const submittedCount = mockSubmissions.filter(s => s.status === 'submitted').length;
  const interviewCount = mockSubmissions.filter(s => s.status === 'interview').length;
  const placedCount = mockSubmissions.filter(s => s.status === 'placed').length;

  return (
    <MainLayout
      title="Submissions"
      subtitle="Track your candidate submissions pipeline"
      action={{ label: 'New Submission', onClick: () => {} }}
    >
      {/* Pipeline Stats */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-3">
          <Send className="w-5 h-5 text-info" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{submittedCount}</span> Submitted
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-warning" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{interviewCount}</span> In Interview
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-success" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{placedCount}</span> Placed
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-3 ml-auto">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            Conversion: <span className="font-semibold text-foreground">
              {mockSubmissions.length > 0 ? ((placedCount / mockSubmissions.length) * 100).toFixed(0) : 0}%
            </span>
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <SubmissionBoard submissions={mockSubmissions} />
    </MainLayout>
  );
}
