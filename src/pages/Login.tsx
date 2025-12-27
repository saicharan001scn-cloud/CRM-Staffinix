import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Lock, Mail, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import staffinixLogo from '@/assets/staffinix-logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - simulate API call
    setTimeout(() => {
      if (email && password) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error('Please enter email and password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <img src={staffinixLogo} alt="Staffinix" className="w-16 h-16 rounded-xl mx-auto mb-3" />
          <h1 className="text-xl font-bold text-foreground">Staffinix CRM</h1>
          <p className="text-xs text-muted-foreground mt-1">Sign in to continue</p>
        </div>

        <Card className="p-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@staffinix.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-sm h-9"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-sm h-9"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-9 text-sm gap-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Demo: Use any email/password to login
        </p>
      </div>
    </div>
  );
}
