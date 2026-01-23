import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubmissionsProvider } from "./context/SubmissionsContext";
import { AuthProvider } from "./hooks/useAuth";
import { UserRoleProvider } from "./hooks/useUserRole";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { OperationalRoute } from "./components/auth/OperationalRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { Loader2 } from "lucide-react";

// Eagerly load auth pages for fast initial render
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Lazy load all other pages to reduce initial bundle size
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Consultants = lazy(() => import("./pages/Consultants"));
const ConsultantProfile = lazy(() => import("./pages/ConsultantProfile"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobMatches = lazy(() => import("./pages/JobMatches"));
const Vendors = lazy(() => import("./pages/Vendors"));
const Submissions = lazy(() => import("./pages/Submissions"));
const Emails = lazy(() => import("./pages/Emails"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Settings = lazy(() => import("./pages/Settings"));
const IntegrationsManagement = lazy(() => import("./pages/IntegrationsManagement"));
const ApiKeysManagement = lazy(() => import("./pages/ApiKeysManagement"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const BillingManagement = lazy(() => import("./pages/BillingManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh for 5 minutes - prevents re-fetching on navigation
      staleTime: 5 * 60 * 1000,
      // Cache data for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Don't refetch on window focus for better UX during navigation
      refetchOnWindowFocus: false,
      // Retry failed requests once
      retry: 1,
    },
  },
});

// Unified loading fallback component - minimal loading state for fast perceived performance
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background animate-in fade-in duration-150">
    <Loader2 className="w-6 h-6 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <UserRoleProvider>
          <SubmissionsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/consultants" element={<OperationalRoute><Consultants /></OperationalRoute>} />
                  <Route path="/consultants/:consultantId" element={<OperationalRoute><ConsultantProfile /></OperationalRoute>} />
                  <Route path="/jobs" element={<OperationalRoute><Jobs /></OperationalRoute>} />
                  <Route path="/jobs/:jobId/matches" element={<OperationalRoute><JobMatches /></OperationalRoute>} />
                  <Route path="/vendors" element={<OperationalRoute><Vendors /></OperationalRoute>} />
                  <Route path="/submissions" element={<OperationalRoute><Submissions /></OperationalRoute>} />
                  <Route path="/emails" element={<OperationalRoute><Emails /></OperationalRoute>} />
                  <Route path="/analytics" element={<OperationalRoute><Analytics /></OperationalRoute>} />
                  <Route path="/assistant" element={<OperationalRoute><Assistant /></OperationalRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/settings/integrations" element={<ProtectedRoute><IntegrationsManagement /></ProtectedRoute>} />
                  <Route path="/settings/api-keys" element={<ProtectedRoute><ApiKeysManagement /></ProtectedRoute>} />
                  <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                  <Route path="/billing" element={<AdminRoute><BillingManagement /></AdminRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </SubmissionsProvider>
        </UserRoleProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
