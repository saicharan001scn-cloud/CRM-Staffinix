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
import { MapPin, Building2, Sparkles, ArrowLeft, Users } from 'lucide-react';
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
      <MainLayout title="Job Not Found" subtitle="The job you're looking for doesn't exist">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No job found with this ID.</p>
          <Button onClick={() => navigate('/jobs')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
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
      toast.success('Resume tailored successfully!', {
        description: `${selectedMatch.consultant.name}'s resume has been optimized for this position.`
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
        jobId: job.id,
        jobTitle: job.title,
        client: job.client,
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'submitted' as const,
        rate: selectedMatch.consultant.rate,
        notes: tailoredConsultants.has(selectedMatch.consultant.id) 
          ? 'Submitted with AI-tailored resume' 
          : 'Submitted with original resume'
      };
      
      addSubmission(newSubmission);
      setSubmitModalOpen(false);
      
      toast.success('Submission successful!', {
        description: `${selectedMatch.consultant.name} has been submitted for ${job.title}.`
      });
      
      navigate('/submissions');
    }
  };

  return (
    <MainLayout
      title="Matched Consultants"
      subtitle={`AI-matched candidates for ${job.title}`}
    >
      {/* Job Header */}
      <div className="p-6 bg-card border border-border rounded-xl mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">{job.title}</h2>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{job.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/jobs')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Button>
          </div>
        </div>
        
        {/* Required Skills */}
        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground mb-2 block">Required Skills</span>
          <div className="flex flex-wrap gap-2">
            {job.skills.map(skill => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Match Stats */}
      <div className="flex items-center gap-6 mb-6 p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{matches.length}</span> Matched Consultants
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-success" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {matches.filter(m => m.matchScore >= 85).length}
            </span> High Matches (85%+)
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Avg Score: <span className="font-semibold text-foreground">
              {matches.length > 0 
                ? Math.round(matches.reduce((acc, m) => acc + m.matchScore, 0) / matches.length)
                : 0}%
            </span>
          </span>
        </div>
      </div>

      {/* Matched Consultants Grid */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
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
        <div className="flex flex-col items-center justify-center py-12 bg-card border border-border rounded-xl">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No matches found</p>
          <p className="text-muted-foreground">No consultants match this job's requirements yet.</p>
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
