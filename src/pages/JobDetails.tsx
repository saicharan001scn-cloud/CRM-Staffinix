import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockJobs, mockVendors } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  Building2, 
  DollarSign, 
  Calendar, 
  FileText, 
  Users, 
  Send, 
  XCircle,
  Sparkles,
  Clock,
  Briefcase
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

export default function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const job = mockJobs.find(j => j.id === jobId);
  const [closeJobModalOpen, setCloseJobModalOpen] = useState(false);
  const [jobStatus, setJobStatus] = useState(job?.status || 'open');

  if (!job) {
    return (
      <MainLayout title="Job Not Found" subtitle="">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4 text-sm">No job found with this ID.</p>
          <Button onClick={() => navigate('/jobs')} variant="outline" size="sm">
            Back to Jobs
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleViewMatches = () => {
    navigate(`/jobs/${job.id}/matches`);
  };

  const handleSendToVendor = () => {
    // Get relevant vendors (mock: all vendors for now)
    const vendorEmails = mockVendors.map(v => v.email).join(', ');
    
    // Navigate to emails page with job context
    navigate('/emails', {
      state: {
        fromJob: true,
        jobId: job.id,
        jobTitle: job.title,
        jobLocation: job.location,
        jobSkills: job.skills,
        jobRate: job.rate,
        jobClient: job.client,
        jobType: job.jobType,
        jobDescription: job.description,
        visaRequirements: job.visaRequirements,
        vendorEmails: vendorEmails,
        breadcrumb: 'Job Requirement → Email Automation'
      }
    });
  };

  const handleCloseJob = () => {
    setJobStatus('filled');
    setCloseJobModalOpen(false);
    toast.success('Job closed successfully', {
      description: `${job.title} has been marked as filled.`
    });
  };

  return (
    <MainLayout
      title="Job Details"
      subtitle={`${job.title} at ${job.client}`}
    >
      {/* Job Header Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-foreground">{job.title}</h2>
              <Badge 
                className={
                  jobStatus === 'open' 
                    ? "bg-success/20 text-success border-success/30" 
                    : "bg-primary/20 text-primary border-primary/30"
                }
              >
                {jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{job.client}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>${job.rate.min}-${job.rate.max}/hr</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {job.deadline}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline">{job.jobType}</Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button onClick={handleViewMatches} className="gap-2">
            <Sparkles className="w-4 h-4" />
            View Matches
          </Button>
          <Button onClick={handleSendToVendor} variant="secondary" className="gap-2">
            <Send className="w-4 h-4" />
            Send to Vendor
          </Button>
          <Button 
            onClick={() => setCloseJobModalOpen(true)} 
            variant="outline" 
            className="gap-2"
            disabled={jobStatus === 'filled'}
          >
            <XCircle className="w-4 h-4" />
            Close Job
          </Button>
        </div>
      </Card>

      {/* Job Details Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Full Job Description */}
        <Card className="col-span-2 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Full Job Description</h3>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="mb-4">{job.description}</p>
            <p className="mb-4">
              We are looking for an experienced professional with strong skills in the required technologies. 
              The ideal candidate should have excellent communication skills and ability to work in a fast-paced environment.
            </p>
            <p className="mb-4">
              This is a {job.jobType} position based in {job.location}. The role requires working closely with 
              cross-functional teams to deliver high-quality solutions. Candidates must be comfortable with agile 
              methodologies and have experience with enterprise-level applications.
            </p>
            <h4 className="text-foreground font-medium mb-2">Responsibilities:</h4>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Design and develop scalable applications using {job.skills[0]} and related technologies</li>
              <li>Collaborate with product and design teams to implement new features</li>
              <li>Write clean, maintainable, and well-documented code</li>
              <li>Participate in code reviews and mentor junior developers</li>
              <li>Troubleshoot and debug applications in production environments</li>
            </ul>
            <h4 className="text-foreground font-medium mb-2">Requirements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>5+ years of experience in software development</li>
              <li>Strong proficiency in {job.skills.slice(0, 3).join(', ')}</li>
              <li>Experience with cloud platforms (AWS/Azure/GCP)</li>
              <li>Excellent problem-solving and communication skills</li>
              <li>Bachelor's degree in Computer Science or related field</li>
            </ul>
          </div>
        </Card>

        {/* Job Metadata Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Job Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Matched Consultants
                </span>
                <span className="font-semibold text-foreground">{job.matchedConsultants}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Posted Date
                </span>
                <span className="font-semibold text-foreground">{job.postedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Source
                </span>
                <span className="font-semibold text-foreground">{job.source}</span>
              </div>
            </div>
          </Card>

          {/* Required Skills */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Visa Requirements */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Visa Requirements</h3>
            <div className="flex flex-wrap gap-2">
              {job.visaRequirements.map(visa => (
                <Badge key={visa} variant="outline" className="text-xs">
                  {visa}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Close Job Confirmation Modal */}
      <Dialog open={closeJobModalOpen} onOpenChange={setCloseJobModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Job Requirement</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this job? This will mark it as filled and remove it from active listings.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-foreground">{job.title}</p>
              <p className="text-sm text-muted-foreground">{job.client} • {job.location}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseJobModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloseJob}>
              Confirm & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
