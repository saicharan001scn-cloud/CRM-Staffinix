import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Consultant } from '@/types';
import { 
  ArrowLeft, Download, Printer, Star, FileText, 
  File, FileType, Calendar, ChevronRight, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ResumeVersion {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'doc' | 'txt';
  fileSize: string;
  uploadDate: string;
  isPrimary: boolean;
}

interface ResumeViewerProps {
  open: boolean;
  onClose: () => void;
  consultant: Consultant | null;
}

// Mock resume content
const mockResumeContent = `JOHN DOE
Senior Software Engineer
john.doe@email.com | +1 (555) 123-4567 | Dallas, TX

PROFESSIONAL SUMMARY
Highly skilled software engineer with 8+ years of experience in full-stack development. 
Expertise in Java, Spring Boot, microservices architecture, and cloud technologies.
Proven track record of delivering scalable enterprise solutions.

TECHNICAL SKILLS
Languages: Java, JavaScript, TypeScript, Python, SQL
Frameworks: Spring Boot, React, Node.js, Express
Cloud: AWS (EC2, S3, Lambda, RDS), Azure, GCP
DevOps: Docker, Kubernetes, Jenkins, GitLab CI/CD
Databases: PostgreSQL, MySQL, MongoDB, Redis

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Corp Inc
January 2020 - Present
• Led development of microservices architecture serving 5M+ daily users
• Designed and implemented RESTful APIs using Spring Boot
• Reduced deployment time by 60% through CI/CD pipeline optimization
• Mentored junior developers and conducted code reviews

Software Engineer | Startup XYZ
June 2016 - December 2019
• Developed full-stack applications using React and Node.js
• Implemented real-time data processing with Kafka
• Improved application performance by 40% through optimization

EDUCATION
Master of Science in Computer Science
University of Texas at Dallas, 2016

Bachelor of Science in Computer Science
University of California, Los Angeles, 2014

CERTIFICATIONS
• AWS Solutions Architect - Professional
• Kubernetes Administrator (CKA)
• Oracle Certified Java Developer
`;

// Mock resume versions
const mockResumeVersions: ResumeVersion[] = [
  { id: '1', fileName: 'Resume_v3.pdf', fileType: 'pdf', fileSize: '245 KB', uploadDate: '2024-01-15', isPrimary: true },
  { id: '2', fileName: 'Resume_v2.docx', fileType: 'docx', fileSize: '198 KB', uploadDate: '2024-01-10', isPrimary: false },
  { id: '3', fileName: 'Resume_v1.pdf', fileType: 'pdf', fileSize: '220 KB', uploadDate: '2024-01-05', isPrimary: false },
];

const fileTypeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-4 h-4 text-red-500" />,
  docx: <FileType className="w-4 h-4 text-blue-500" />,
  doc: <FileType className="w-4 h-4 text-blue-500" />,
  txt: <File className="w-4 h-4 text-muted-foreground" />,
};

export function ResumeViewer({ open, onClose, consultant }: ResumeViewerProps) {
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersion>(mockResumeVersions[0]);
  const [versions, setVersions] = useState<ResumeVersion[]>(mockResumeVersions);

  const handleDownload = () => {
    const blob = new Blob([mockResumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedVersion.fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloading ${selectedVersion.fileName}`);
  };

  const handlePrint = () => {
    window.print();
    toast.success('Opening print dialog...');
  };

  const handleSetPrimary = (version: ResumeVersion) => {
    setVersions(versions.map(v => ({
      ...v,
      isPrimary: v.id === version.id
    })));
    setSelectedVersion({ ...version, isPrimary: true });
    toast.success(`${version.fileName} set as primary resume`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!consultant) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose} className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  Resume Viewer - {consultant.name}
                  {selectedVersion.isPrimary && (
                    <Badge className="bg-success/20 text-success border border-success/30 text-xs">
                      <Star className="w-3 h-3 mr-1 fill-success" />
                      Primary
                    </Badge>
                  )}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedVersion.fileName} • {selectedVersion.fileSize}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              {!selectedVersion.isPrimary && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleSetPrimary(selectedVersion)}
                  className="gap-1"
                >
                  <Star className="w-4 h-4" />
                  Set as Primary
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-[1fr_280px] gap-0 min-h-0">
          {/* Resume Content Viewer */}
          <div className="flex flex-col min-h-0 border-r border-border">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-2">
                {fileTypeIcons[selectedVersion.fileType]}
                <span className="text-sm font-medium">{selectedVersion.fileName}</span>
              </div>
              <Badge variant="outline" className="text-xs uppercase">
                {selectedVersion.fileType}
              </Badge>
            </div>
            
            {/* PDF/Document Viewer Area */}
            <ScrollArea className="flex-1 bg-background">
              {selectedVersion.fileType === 'pdf' ? (
                <div className="p-6">
                  {/* In a real app, this would be an embedded PDF viewer */}
                  <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-[650px] min-h-[800px]">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {mockResumeContent}
                    </pre>
                  </div>
                </div>
              ) : selectedVersion.fileType === 'docx' || selectedVersion.fileType === 'doc' ? (
                <div className="p-6">
                  {/* Formatted DOCX view */}
                  <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-[650px] min-h-[800px]">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {mockResumeContent}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {/* Plain text view */}
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {mockResumeContent}
                  </pre>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Resume Versions Sidebar */}
          <div className="flex flex-col min-h-0 bg-muted/10">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Resume Versions ({versions.length})
              </h3>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {versions.map((version, index) => (
                  <div
                    key={version.id}
                    onClick={() => setSelectedVersion(version)}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      selectedVersion.id === version.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {fileTypeIcons[version.fileType]}
                        <div>
                          <p className="text-xs font-medium text-foreground flex items-center gap-1">
                            {version.isPrimary && <Star className="w-3 h-3 text-success fill-success" />}
                            Version {versions.length - index}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{version.fileName}</p>
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        selectedVersion.id === version.id && "text-primary rotate-90"
                      )} />
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(version.uploadDate)}
                      </span>
                      <span>{version.fileSize}</span>
                    </div>

                    {selectedVersion.id === version.id && (
                      <div className="flex gap-1 mt-2 pt-2 border-t border-border">
                        <Button variant="outline" size="sm" className="flex-1 h-6 text-[10px] gap-1">
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 h-6 text-[10px] gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                          }}
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
