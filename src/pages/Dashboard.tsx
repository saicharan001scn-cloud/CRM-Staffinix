import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { SubmissionChart } from '@/components/dashboard/SubmissionChart';
import { SkillDemandChart } from '@/components/dashboard/SkillDemandChart';
import { TopConsultants } from '@/components/dashboard/TopConsultants';
import { HotJobs } from '@/components/dashboard/HotJobs';
import { 
  mockDashboardStats, 
  mockActivities, 
  mockConsultants, 
  mockJobs,
  submissionChartData,
  skillDemandData 
} from '@/data/mockData';
import { Users, Briefcase, Send, Calendar, Building2, Sparkles, Target } from 'lucide-react';

export default function Dashboard() {
  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Overview of your staffing operations"
      action={{ label: 'Add Consultant', onClick: () => {} }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Consultants"
          value={mockDashboardStats.totalConsultants}
          change={{ value: 12, type: 'increase' }}
          icon={Users}
          delay={0}
          href="/consultants"
        />
        <StatCard
          title="On Bench"
          value={mockDashboardStats.benchConsultants}
          icon={Target}
          iconColor="text-info"
          delay={100}
          href="/consultants"
        />
        <StatCard
          title="Active Jobs"
          value={mockDashboardStats.activeJobs}
          change={{ value: 8, type: 'increase' }}
          icon={Briefcase}
          iconColor="text-warning"
          delay={200}
          href="/jobs"
        />
        <StatCard
          title="Submissions Today"
          value={mockDashboardStats.submissionsToday}
          change={{ value: 24, type: 'increase' }}
          icon={Send}
          iconColor="text-success"
          delay={300}
          href="/submissions"
        />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Interviews This Week"
          value={mockDashboardStats.interviewsThisWeek}
          icon={Calendar}
          iconColor="text-chart-5"
          delay={400}
          href="/submissions"
        />
        <StatCard
          title="Avg Match Score"
          value={`${mockDashboardStats.avgMatchScore}%`}
          icon={Sparkles}
          iconColor="text-primary"
          delay={500}
          href="/jobs"
        />
        <StatCard
          title="Active Vendors"
          value={mockDashboardStats.hotVendors}
          icon={Building2}
          iconColor="text-accent"
          delay={600}
          href="/vendors"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SubmissionChart data={submissionChartData} />
        <SkillDemandChart data={skillDemandData} />
        <TopConsultants consultants={mockConsultants} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <HotJobs jobs={mockJobs} />
        </div>
        <ActivityFeed activities={mockActivities} />
      </div>
    </MainLayout>
  );
}
