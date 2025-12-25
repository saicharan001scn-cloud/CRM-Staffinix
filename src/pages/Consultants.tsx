import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ConsultantTable } from '@/components/consultants/ConsultantTable';
import { ConsultantFilters } from '@/components/consultants/ConsultantFilters';
import { AddConsultantModal, NewConsultant } from '@/components/consultants/AddConsultantModal';
import { useConsultants } from '@/hooks/useConsultants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid3X3, List, Search, X, MoreVertical, User, FileText, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Consultant } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const statusColors: Record<string, string> = {
  available: 'bg-success/20 text-success border-success/30',
  bench: 'bg-info/20 text-info border-info/30',
  marketing: 'bg-warning/20 text-warning border-warning/30',
  interview: 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  placed: 'bg-primary/20 text-primary border-primary/30',
};

export default function Consultants() {
  const navigate = useNavigate();
  const { consultants, isLoading, addConsultant, deleteConsultant } = useConsultants();
  const [statusFilter, setStatusFilter] = useState('all');
  const [visaFilter, setVisaFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);

  const filteredConsultants = consultants.filter((consultant) => {
    const matchesStatus = statusFilter === 'all' || consultant.status === statusFilter;
    const matchesVisa = visaFilter === 'all' || consultant.visaStatus === visaFilter;
    const matchesSearch = searchQuery === '' || 
      consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      consultant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.visaStatus.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesVisa && matchesSearch;
  });

  const handleViewProfile = (consultant: Consultant) => {
    navigate(`/consultants/${consultant.id}`);
  };

  const handleViewResume = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setResumeModalOpen(true);
  };

  const handleEdit = (consultant: Consultant) => {
    toast.info(`Edit ${consultant.name} - Coming soon`);
  };

  const handleDelete = (consultant: Consultant) => {
    deleteConsultant.mutate(consultant.id);
  };

  const handleAddConsultant = (newConsultant: NewConsultant) => {
    addConsultant.mutate({
      firstName: newConsultant.firstName,
      lastName: newConsultant.lastName,
      email: newConsultant.email,
      phone: newConsultant.phone,
      visaStatus: newConsultant.visaStatus,
      skills: [...newConsultant.skills, ...newConsultant.secondarySkills],
      rate: newConsultant.rate,
      status: newConsultant.status,
      location: newConsultant.location,
      experience: newConsultant.yearsOfExperience,
    });
  };

  if (isLoading) {
    return (
      <MainLayout title="Consultants" subtitle="Loading..." showBackButton={false}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Consultants"
      subtitle={`Manage your ${consultants.length} consultants`}
      action={{ label: 'Add Consultant', onClick: () => setAddModalOpen(true) }}
      showBackButton={false}
    >
      <Tabs defaultValue="table" className="space-y-4">
        <div className="flex flex-col gap-3">
          {/* Search Bar */}
          <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, location, visa status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-background"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Found <span className="font-semibold text-foreground">{filteredConsultants.length}</span> consultants
            </span>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between">
            <ConsultantFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              visaFilter={visaFilter}
              setVisaFilter={setVisaFilter}
            />
            <TabsList className="bg-secondary">
              <TabsTrigger value="table" className="gap-2">
                <List className="w-4 h-4" />
                Table
              </TabsTrigger>
              <TabsTrigger value="grid" className="gap-2">
                <Grid3X3 className="w-4 h-4" />
                Grid
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="table">
          <ConsultantTable consultants={filteredConsultants} />
        </TabsContent>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConsultants.map((consultant, index) => (
              <div 
                key={consultant.id}
                className="relative bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-glow transition-all animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                {/* Action Menu - Top Right */}
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-popover border-border">
                      <DropdownMenuItem 
                        className="gap-2 text-sm cursor-pointer" 
                        onClick={() => handleViewProfile(consultant)}
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 text-sm cursor-pointer"
                        onClick={() => handleViewResume(consultant)}
                      >
                        <FileText className="w-4 h-4" />
                        View Resume
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="gap-2 text-sm cursor-pointer"
                        onClick={() => handleEdit(consultant)}
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 text-sm text-destructive cursor-pointer"
                        onClick={() => handleDelete(consultant)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Card Content */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {consultant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{consultant.name}</h3>
                    <p className="text-xs text-muted-foreground">{consultant.location}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {consultant.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                  {consultant.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{consultant.skills.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visa</span>
                    <span className="font-medium text-foreground">{consultant.visaStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="font-medium text-foreground">${consultant.rate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium text-foreground">{consultant.experience} years</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className={cn("text-xs px-2 py-0.5 border", statusColors[consultant.status])}>
                      {consultant.status.charAt(0).toUpperCase() + consultant.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Resume Modal */}
      <Dialog open={resumeModalOpen} onOpenChange={setResumeModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {selectedConsultant?.name} - Resume
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-muted/30 rounded-lg min-h-[400px]">
            <div className="text-sm text-muted-foreground space-y-3">
              <h3 className="text-base font-semibold text-foreground">{selectedConsultant?.name}</h3>
              <p>{selectedConsultant?.email} | {selectedConsultant?.phone}</p>
              <p>{selectedConsultant?.location}</p>
              
              <div className="pt-3 border-t border-border">
                <h4 className="font-medium text-foreground mb-1">Professional Summary</h4>
                <p>{selectedConsultant?.aiSummary}</p>
              </div>
              
              <div className="pt-3 border-t border-border">
                <h4 className="font-medium text-foreground mb-1">Skills</h4>
                <p>{selectedConsultant?.skills.join(', ')}</p>
              </div>
              
              <div className="pt-3 border-t border-border">
                <h4 className="font-medium text-foreground mb-1">Experience</h4>
                <p>{selectedConsultant?.experience} years of professional experience</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Consultant Modal */}
      <AddConsultantModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddConsultant}
      />
    </MainLayout>
  );
}
