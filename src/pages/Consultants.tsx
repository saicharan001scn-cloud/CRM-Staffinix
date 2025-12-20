import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ConsultantTable } from '@/components/consultants/ConsultantTable';
import { ConsultantFilters } from '@/components/consultants/ConsultantFilters';
import { mockConsultants } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, List } from 'lucide-react';

export default function Consultants() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [visaFilter, setVisaFilter] = useState('all');

  const filteredConsultants = mockConsultants.filter((consultant) => {
    const matchesStatus = statusFilter === 'all' || consultant.status === statusFilter;
    const matchesVisa = visaFilter === 'all' || consultant.visaStatus === visaFilter;
    return matchesStatus && matchesVisa;
  });

  return (
    <MainLayout
      title="Consultants"
      subtitle={`Manage your ${mockConsultants.length} consultants`}
      action={{ label: 'Add Consultant', onClick: () => {} }}
    >
      <Tabs defaultValue="table" className="space-y-6">
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

        <TabsContent value="table">
          <ConsultantTable consultants={filteredConsultants} />
        </TabsContent>

        <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-6">
            {filteredConsultants.map((consultant, index) => (
              <div 
                key={consultant.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-glow transition-all animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">
                      {consultant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{consultant.name}</h3>
                    <p className="text-sm text-muted-foreground">{consultant.location}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
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
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
