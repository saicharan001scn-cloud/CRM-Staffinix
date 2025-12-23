import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ImportVendorModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (vendors: any[]) => void;
}

type ColumnMapping = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
};

const crmFields = [
  { key: 'companyName', label: 'Company Name', required: true },
  { key: 'contactPerson', label: 'Contact Person', required: false },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Phone', required: false },
  { key: 'location', label: 'Location', required: false },
];

export function ImportVendorModal({ open, onClose, onImport }: ImportVendorModalProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast.error('Invalid file type', {
          description: 'Only Excel files (.xlsx, .xls) are allowed'
        });
        return;
      }
      setFile(selectedFile);
      // Simulate parsing Excel columns
      simulateExcelParsing(selectedFile);
    }
  };

  const simulateExcelParsing = (file: File) => {
    // In a real implementation, you would use a library like xlsx
    // For now, we'll simulate the column detection
    const simulatedColumns = ['Company', 'Contact Name', 'Email Address', 'Phone Number', 'City', 'State'];
    setExcelColumns(simulatedColumns);
    
    // Auto-map columns based on common names
    setColumnMapping({
      companyName: simulatedColumns.find(c => c.toLowerCase().includes('company')) || '',
      contactPerson: simulatedColumns.find(c => c.toLowerCase().includes('contact') || c.toLowerCase().includes('name')) || '',
      email: simulatedColumns.find(c => c.toLowerCase().includes('email')) || '',
      phone: simulatedColumns.find(c => c.toLowerCase().includes('phone')) || '',
      location: simulatedColumns.find(c => c.toLowerCase().includes('city') || c.toLowerCase().includes('location')) || '',
    });

    // Simulate preview data
    setPreviewData([
      { company: 'ABC Solutions', contact: 'John Doe', email: 'john@abc.com', phone: '555-1234', location: 'New York' },
      { company: 'XYZ Tech', contact: 'Jane Smith', email: 'jane@xyz.com', phone: '555-5678', location: 'Chicago' },
      { company: 'Tech Corp', contact: 'Bob Wilson', email: 'bob@tech.com', phone: '555-9012', location: 'Dallas' },
    ]);

    setStep('mapping');
    toast.success('File uploaded!', { description: `Found ${simulatedColumns.length} columns` });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        input.files = dataTransfer.files;
        handleFileChange({ target: input } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleConfirmImport = () => {
    if (!columnMapping.companyName) {
      toast.error('Company Name mapping is required');
      return;
    }
    
    // In real implementation, transform data based on mapping
    const transformedVendors = previewData.map(row => ({
      companyName: row.company,
      contactPerson: row.contact,
      email: row.email,
      phone: row.phone,
      location: row.location,
    }));

    onImport(transformedVendors);
    toast.success('Import successful!', {
      description: `${transformedVendors.length} vendors imported`
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep('upload');
    setFile(null);
    setExcelColumns([]);
    setColumnMapping({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      location: '',
    });
    setPreviewData([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Import Vendor List
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          {['Upload', 'Map Columns', 'Preview'].map((label, index) => (
            <div key={label} className="flex items-center">
              <Badge
                variant={
                  (step === 'upload' && index === 0) ||
                  (step === 'mapping' && index === 1) ||
                  (step === 'preview' && index === 2)
                    ? 'default'
                    : 'secondary'
                }
                className="rounded-full"
              >
                {index + 1}. {label}
              </Badge>
              {index < 2 && <div className="w-8 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-foreground mb-1">
              Drop your Excel file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports .xlsx and .xls files
            </p>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {step === 'mapping' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{file?.name}</span>
              <Badge variant="secondary" className="ml-auto">{excelColumns.length} columns</Badge>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Map Excel columns to CRM fields:</p>
              
              {crmFields.map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <div className="w-32 text-sm">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </div>
                  <Select
                    value={columnMapping[field.key as keyof ColumnMapping]}
                    onValueChange={(v) => setColumnMapping({ ...columnMapping, [field.key]: v })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select column..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Skip --</SelectItem>
                      {excelColumns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {columnMapping[field.key as keyof ColumnMapping] && (
                    <Check className="w-4 h-4 text-success" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={() => setStep('preview')}>
                Preview Data
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
              <Check className="w-4 h-4 text-success" />
              <span className="text-sm text-success font-medium">
                {previewData.length} vendors ready to import
              </span>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.company}</TableCell>
                      <TableCell>{row.contact}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-warning" />
              <span className="text-xs text-warning">
                Review the data above before confirming import
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back
              </Button>
              <Button onClick={handleConfirmImport}>
                <Check className="w-4 h-4 mr-1" />
                Confirm Import
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
