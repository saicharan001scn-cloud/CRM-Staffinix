import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { MatchedConsultantCard } from '@/components/jobs/MatchedConsultantCard';
import { TailorResumeModal } from '@/components/jobs/TailorResumeModal';
import { SubmitConfirmModal } from '@/components/jobs/SubmitConfirmModal';
import { mockJobs } from '@/data/mockData';
import { mockJobMatches, JobMatch } from '@/data/mockJobMatches';
import { useSubmissions } from '@/context/SubmissionsContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Building2, Sparkles, ArrowLeft, Users, Calendar, DollarSign, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function JobMatches() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { addSubmission } = useSubmissions();
  
  const job = mockJobs.find(j => j.id === jobId);
  const matches = jobId ? mockJobMatches[jobId] || [] : [];
  
  const [tailorModalOpen, setTailorModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const [tailoredConsultants, setTailoredConsultants] = useState<Set<string>>(new Set());

  if (!job) {
    return (
      <MainLayout title="Job Not Found" subtitle="">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4 text-xs">No job found with this ID.</p>
          <Button onClick={() => navigate('/jobs')} variant="outline" size="sm">
            <ArrowLeft className="w-3 h-3 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleTailorResume = (match: JobMatch) => {
    setSelectedMatch(match);
    setTailorModalOpen(true);
  };

  const handleApproveResume = () => {
    if (selectedMatch) {
      setTailoredConsultants(prev => new Set(prev).add(selectedMatch.consultant.id));
      setTailorModalOpen(false);
      toast.success('Resume tailored!', {
        description: `${selectedMatch.consultant.name}'s resume optimized.`
      });
    }
  };

  const handleSubmit = (match: JobMatch) => {
    setSelectedMatch(match);
    setSubmitModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (selectedMatch && job) {
      const newSubmission = {
        id: `sub-${Date.now()}`,
        consultantId: selectedMatch.consultant.id,
        consultantName: selectedMatch.consultant.name,
        vendorId: '1',
        vendorName: 'TechStaff Solutions',
        vendorContact: 'Vendor Rep',
        jobId: job.id,
        jobTitle: job.title,
        client: job.client,
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'applied' as const,
        appliedRate: selectedMatch.consultant.rate,
        submissionRate: undefined,
        rate: selectedMatch.consultant.rate,
        notes: tailoredConsultants.has(selectedMatch.consultant.id) 
          ? 'Resume shared with AI-tailored version. Awaiting rate confirmation.' 
          : 'Resume shared with vendor. Awaiting rate confirmation.',
        rateHistory: []
      };
      
      addSubmission(newSubmission);
      setSubmitModalOpen(false);
      
      toast.success('Resume shared!', {
        description: `${selectedMatch.consultant.name} added to pipeline as "Applied".`
      });
      
      navigate('/submissions');
    }
  };

  return (
    <MainLayout
      title="Matched Consultants"
      subtitle={`AI-matched candidates for ${job.title}`}
    >
      <Button 
        onClick={() => navigate('/jobs')} 
        variant="ghost" 
        size="sm" 
        className="mb-4 gap-2 text-xs"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to Jobs
      </Button>

      {/* Job Header with Full JD */}
      <Card className="p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">{job.title}</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>{job.client}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>${job.rate.min}-${job.rate.max}/hr</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Deadline: {job.deadline}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">{job.jobType}</Badge>
        </div>
        
        {/* Full Job Description */}
        <div className="p-3 bg-muted/30 rounded-lg mb-3">
          <div className="flex items-center gap-1 mb-2">
            <FileText className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-foreground">Job Description</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {job.description}
            {' '}We are looking for an experienced professional with strong skills in the required technologies. 
            The ideal candidate should have excellent communication skills and ability to work in a fast-paced environment. 
            This is a {job.jobType} position based in {job.location}. The role requires working closely with cross-functional teams 
            to deliver high-quality solutions. Candidates must be comfortable with agile methodologies and have experience 
            with enterprise-level applications.
          </p>
        </div>

        {/* Required Skills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Skills:</span>
          <div className="flex flex-wrap gap-1">
            {job.skills.map(skill => (
              <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">{skill}</Badge>
            ))}
          </div>
        </div>

        {/* Visa Requirements */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">Visa:</span>
          <div className="flex flex-wrap gap-1">
            {job.visaRequirements.map(visa => (
              <Badge key={visa} variant="outline" className="text-[10px] px-1.5 py-0">{visa}</Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Match Stats */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{matches.length}</span> Matched
          </span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-success" />
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {matches.filter(m => m.matchScore >= 85).length}
            </span> High Matches
          </span>
        </div>
        <div className="h-3 w-px bg-border" />
        <span className="text-xs text-muted-foreground">
          Avg: <span className="font-medium text-foreground">
            {matches.length > 0 
              ? Math.round(matches.reduce((acc, m) => acc + m.matchScore, 0) / matches.length)
              : 0}%
          </span>
        </span>
      </div>

      {/* Matched Consultants Grid */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {matches
            .sort((a, b) => b.matchScore - a.matchScore)
            .map((match, index) => (
              <MatchedConsultantCard
                key={match.consultant.id}
                match={match}
                index={index}
                onTailorResume={() => handleTailorResume(match)}
                onSubmit={() => handleSubmit(match)}
                isTailored={tailoredConsultants.has(match.consultant.id)}
              />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-card border border-border rounded-lg">
          <Users className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">No matches found</p>
          <p className="text-xs text-muted-foreground">No consultants match this job's requirements.</p>
        </div>
      )}

      {/* Modals */}
      {selectedMatch && (
        <>
          <TailorResumeModal
            open={tailorModalOpen}
            onClose={() => setTailorModalOpen(false)}
            onApprove={handleApproveResume}
            consultantName={selectedMatch.consultant.name}
            jobTitle={job.title}
          />
          <SubmitConfirmModal
            open={submitModalOpen}
            onClose={() => setSubmitModalOpen(false)}
            onConfirm={handleConfirmSubmit}
            consultantName={selectedMatch.consultant.name}
            jobTitle={job.title}
            client={job.client}
            rate={selectedMatch.consultant.rate}
            isTailored={tailoredConsultants.has(selectedMatch.consultant.id)}
          />
        </>
      )}
    </MainLayout>
  );
}
