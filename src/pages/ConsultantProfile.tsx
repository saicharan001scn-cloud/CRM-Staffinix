import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockConsultants } from '@/data/mockData';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText,
  Sparkles,
  Briefcase,
  Plus,
  Download,
  Eye,
  Star,
  Trash2,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusColors: Record<string, string> = {
  available: 'bg-success/20 text-success border-success/30',
  bench: 'bg-info/20 text-info border-info/30',
  marketing: 'bg-warning/20 text-warning border-warning/30',
  interview: 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  placed: 'bg-primary/20 text-primary border-primary/30',
};

interface ResumeVersion {
  id: string;
  version: number;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  isPrimary: boolean;
}

const mockResumes: ResumeVersion[] = [
  { id: '1', version: 3, fileName: 'Resume_v3_Updated.pdf', fileSize: '245 KB', uploadDate: '2024-01-15', isPrimary: true },
  { id: '2', version: 2, fileName: 'Resume_v2.pdf', fileSize: '230 KB', uploadDate: '2024-01-10', isPrimary: false },
  { id: '3', version: 1, fileName: 'Resume_Original.pdf', fileSize: '218 KB', uploadDate: '2024-01-05', isPrimary: false },
];

export default function ConsultantProfile() {
  const { consultantId } = useParams<{ consultantId: string }>();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeVersion[]>(mockResumes);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const consultant = mockConsultants.find(c => c.id === consultantId);

  const handleSetPrimary = (id: string) => {
    setResumes(prev => prev.map(r => ({
      ...r,
      isPrimary: r.id === id
    })));
    toast.success('Primary resume updated');
  };

  const handleDeleteResume = (id: string) => {
    const resume = resumes.find(r => r.id === id);
    if (resume?.isPrimary) {
      toast.error('Cannot delete primary resume');
      return;
    }
    setResumes(prev => prev.filter(r => r.id !== id));
    toast.success('Resume deleted');
  };

  const handleViewResume = (resume: ResumeVersion) => {
    toast.info(`Viewing ${resume.fileName}`);
  };

  const handleDownloadResume = (resume: ResumeVersion) => {
    toast.success(`Downloading ${resume.fileName}`);
  };

  const handleUploadResume = () => {
    const newVersion = Math.max(...resumes.map(r => r.version)) + 1;
    const newResume: ResumeVersion = {
      id: String(Date.now()),
      version: newVersion,
      fileName: `Resume_v${newVersion}.pdf`,
      fileSize: '250 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      isPrimary: false
    };
    setResumes(prev => [newResume, ...prev]);
    setShowUploadModal(false);
    toast.success('Resume uploaded successfully');
  };

  if (!consultant) {
    return (
      <MainLayout title="Consultant Not Found" subtitle="">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4 text-sm">No consultant found.</p>
          <Button onClick={() => navigate('/consultants')} variant="outline" size="sm">
            <ArrowLeft className="w-3 h-3 mr-2" />
            Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={consultant.name}
      subtitle="Consultant Profile"
    >
      <Button 
        onClick={() => navigate('/consultants')} 
        variant="ghost" 
        size="sm" 
        className="mb-4 gap-2 text-xs"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to Consultants
      </Button>

      <div className="grid grid-cols-3 gap-4">
        {/* Main Info */}
        <Card className="col-span-2 p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {consultant.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold text-foreground">{consultant.name}</h2>
                <Badge className={cn("border text-xs", statusColors[consultant.status])}>
                  {consultant.status.charAt(0).toUpperCase() + consultant.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  {consultant.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  {consultant.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {consultant.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-3 h-3" />
                  {consultant.experience} years experience
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1">
              {consultant.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          {consultant.aiSummary && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-primary" />
                <h3 className="text-xs font-medium text-muted-foreground">AI Summary</h3>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{consultant.aiSummary}</p>
            </div>
          )}
        </Card>

        {/* Side Info */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-3">Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Visa Status</span>
                <Badge variant="outline" className="text-xs">{consultant.visaStatus}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Rate</span>
                <span className="text-xs font-medium text-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {consultant.rate}/hr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Match Score</span>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  consultant.matchScore && consultant.matchScore >= 85 
                    ? "bg-success/20 text-success" 
                    : consultant.matchScore && consultant.matchScore >= 70 
                    ? "bg-warning/20 text-warning" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {consultant.matchScore || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Last Updated</span>
                <span className="text-xs text-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {consultant.lastUpdated}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-muted-foreground">Resume Versions</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs gap-1"
                onClick={() => setShowUploadModal(true)}
              >
                <Plus className="w-3 h-3" />
                Add Resume
              </Button>
            </div>
            
            <div className="space-y-2">
              {resumes.map((resume) => (
                <div 
                  key={resume.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    resume.isPrimary 
                      ? "bg-primary/5 border-primary/30" 
                      : "bg-muted/50 border-border hover:bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-foreground truncate">
                            {resume.fileName}
                          </p>
                          {resume.isPrimary && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          v{resume.version} • {resume.fileSize} • {resume.uploadDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/50">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-[10px] gap-1"
                      onClick={() => handleViewResume(resume)}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-[10px] gap-1"
                      onClick={() => handleDownloadResume(resume)}
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                    {!resume.isPrimary && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-[10px] gap-1 text-primary"
                          onClick={() => handleSetPrimary(resume.id)}
                        >
                          <Star className="w-3 h-3" />
                          Set Primary
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-[10px] gap-1 text-destructive"
                          onClick={() => handleDeleteResume(resume.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Upload Resume Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Add New Resume Version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={handleUploadResume}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-foreground mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (Max 10MB)</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleUploadResume}>
                Upload Resume
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}