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
import { Users, Briefcase, Send, Calendar, TrendingUp, Building2, Sparkles, Target } from 'lucide-react';

export default function Dashboard() {
  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Overview of your staffing operations"
      action={{ label: 'Add Consultant', onClick: () => {} }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Consultants"
          value={mockDashboardStats.totalConsultants}
          change={{ value: 12, type: 'increase' }}
          icon={Users}
          delay={0}
        />
        <StatCard
          title="On Bench"
          value={mockDashboardStats.benchConsultants}
          icon={Target}
          iconColor="text-info"
          delay={100}
        />
        <StatCard
          title="Active Jobs"
          value={mockDashboardStats.activeJobs}
          change={{ value: 8, type: 'increase' }}
          icon={Briefcase}
          iconColor="text-warning"
          delay={200}
        />
        <StatCard
          title="Submissions Today"
          value={mockDashboardStats.submissionsToday}
          change={{ value: 24, type: 'increase' }}
          icon={Send}
          iconColor="text-success"
          delay={300}
        />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Interviews This Week"
          value={mockDashboardStats.interviewsThisWeek}
          icon={Calendar}
          iconColor="text-chart-5"
          delay={400}
        />
        <StatCard
          title="Placements This Month"
          value={mockDashboardStats.placementsThisMonth}
          change={{ value: 15, type: 'increase' }}
          icon={TrendingUp}
          iconColor="text-success"
          delay={500}
        />
        <StatCard
          title="Avg Match Score"
          value={`${mockDashboardStats.avgMatchScore}%`}
          icon={Sparkles}
          iconColor="text-primary"
          delay={600}
        />
        <StatCard
          title="Active Vendors"
          value={mockDashboardStats.hotVendors}
          icon={Building2}
          iconColor="text-accent"
          delay={700}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <SubmissionChart data={submissionChartData} />
        <SkillDemandChart data={skillDemandData} />
        <TopConsultants consultants={mockConsultants} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <HotJobs jobs={mockJobs} />
        </div>
        <ActivityFeed activities={mockActivities} />
      </div>
    </MainLayout>
  );
}
