import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, Briefcase, Building2, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockConsultants, mockJobs, mockVendors, mockSubmissions } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'consultant' | 'job' | 'vendor' | 'submission';
  title: string;
  subtitle: string;
  matchedField: string;
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim().toLowerCase());
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (q: string) => {
    const searchResults: SearchResult[] = [];

    // Search consultants
    mockConsultants.forEach(c => {
      const matches: string[] = [];
      if (c.name.toLowerCase().includes(q)) matches.push('Name');
      if (c.skills.some(s => s.toLowerCase().includes(q))) matches.push('Skills');
      if (c.email.toLowerCase().includes(q)) matches.push('Email');
      if (c.phone.includes(q)) matches.push('Phone');
      
      if (matches.length > 0) {
        searchResults.push({
          id: c.id,
          type: 'consultant',
          title: c.name,
          subtitle: `${c.visaStatus} • ${c.location}`,
          matchedField: matches.join(', ')
        });
      }
    });

    // Search jobs
    mockJobs.forEach(j => {
      const matches: string[] = [];
      if (j.title.toLowerCase().includes(q)) matches.push('Title');
      if (j.skills.some(s => s.toLowerCase().includes(q))) matches.push('Skills');
      if (j.location.toLowerCase().includes(q)) matches.push('Location');
      if (j.client.toLowerCase().includes(q)) matches.push('Client');
      
      if (matches.length > 0) {
        searchResults.push({
          id: j.id,
          type: 'job',
          title: j.title,
          subtitle: `${j.client} • ${j.location}`,
          matchedField: matches.join(', ')
        });
      }
    });

    // Search vendors
    mockVendors.forEach(v => {
      const matches: string[] = [];
      if (v.companyName.toLowerCase().includes(q)) matches.push('Company');
      if (v.recruiterName.toLowerCase().includes(q)) matches.push('Contact');
      if (v.email.toLowerCase().includes(q)) matches.push('Email');
      if (v.phone.includes(q)) matches.push('Phone');
      
      if (matches.length > 0) {
        searchResults.push({
          id: v.id,
          type: 'vendor',
          title: v.companyName,
          subtitle: v.recruiterName,
          matchedField: matches.join(', ')
        });
      }
    });

    // Search submissions
    mockSubmissions.forEach(s => {
      const matches: string[] = [];
      if (s.consultantName.toLowerCase().includes(q)) matches.push('Candidate');
      if (s.jobTitle.toLowerCase().includes(q)) matches.push('Job');
      if (s.client.toLowerCase().includes(q)) matches.push('Client');
      
      if (matches.length > 0) {
        searchResults.push({
          id: s.id,
          type: 'submission',
          title: s.consultantName,
          subtitle: `${s.jobTitle} • ${s.client}`,
          matchedField: matches.join(', ')
        });
      }
    });

    setResults(searchResults.slice(0, 10));
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    switch (result.type) {
      case 'consultant':
        navigate(`/consultants/${result.id}`);
        break;
      case 'job':
        navigate(`/jobs/${result.id}/matches`);
        break;
      case 'vendor':
        navigate('/vendors');
        break;
      case 'submission':
        navigate('/submissions');
        break;
    }
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'consultant': return <User className="w-4 h-4" />;
      case 'job': return <Briefcase className="w-4 h-4" />;
      case 'vendor': return <Building2 className="w-4 h-4" />;
      case 'submission': return <Users className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'consultant': return 'Consultant';
      case 'job': return 'Job';
      case 'vendor': return 'Vendor';
      case 'submission': return 'Submission';
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'consultant': return 'text-primary bg-primary/10';
      case 'job': return 'text-success bg-success/10';
      case 'vendor': return 'text-warning bg-warning/10';
      case 'submission': return 'text-info bg-info/10';
    }
  };

  const highlightMatch = (text: string, searchQuery: string) => {
    const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-primary font-medium bg-primary/10 px-0.5 rounded">{text.slice(idx, idx + searchQuery.length)}</span>
        {text.slice(idx + searchQuery.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input 
        placeholder="Search consultants, jobs, vendors..." 
        className="pl-10 pr-8 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => { setQuery(''); setIsOpen(false); }}
        >
          <X className="w-3 h-3" />
        </Button>
      )}

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <ScrollArea className="max-h-[400px]">
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  onClick={() => handleResultClick(result)}
                >
                  <div className={cn("p-1.5 rounded-md", getTypeColor(result.type))}>
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {highlightMatch(result.title, query)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{getTypeLabel(result.type)}</span>
                    <span className="text-[10px] text-primary">{result.matchedField}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t border-border p-2 text-center">
            <span className="text-xs text-muted-foreground">
              Found <span className="font-medium text-foreground">{results.length}</span> results
            </span>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 p-6 text-center">
          <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}