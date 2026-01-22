import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubmissionsProvider } from "./context/SubmissionsContext";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { OperationalRoute } from "./components/auth/OperationalRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Consultants from "./pages/Consultants";
import ConsultantProfile from "./pages/ConsultantProfile";
import Jobs from "./pages/Jobs";
import JobMatches from "./pages/JobMatches";
import Vendors from "./pages/Vendors";
import Submissions from "./pages/Submissions";
import Emails from "./pages/Emails";
import Analytics from "./pages/Analytics";
import Assistant from "./pages/Assistant";
import Settings from "./pages/Settings";
import IntegrationsManagement from "./pages/IntegrationsManagement";
import ApiKeysManagement from "./pages/ApiKeysManagement";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SubmissionsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SubmissionsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
