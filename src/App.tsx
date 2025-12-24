import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubmissionsProvider } from "./context/SubmissionsContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Consultants from "./pages/Consultants";
import ConsultantProfile from "./pages/ConsultantProfile";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import JobMatches from "./pages/JobMatches";
import Vendors from "./pages/Vendors";
import Submissions from "./pages/Submissions";
import Emails from "./pages/Emails";
import Analytics from "./pages/Analytics";
import Assistant from "./pages/Assistant";
import Settings from "./pages/Settings";
import IntegrationsManagement from "./pages/IntegrationsManagement";
import ApiKeysManagement from "./pages/ApiKeysManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SubmissionsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/consultants" element={<Consultants />} />
            <Route path="/consultants/:consultantId" element={<ConsultantProfile />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
            <Route path="/jobs/:jobId/matches" element={<JobMatches />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/emails" element={<Emails />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/integrations" element={<IntegrationsManagement />} />
            <Route path="/settings/api-keys" element={<ApiKeysManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SubmissionsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
