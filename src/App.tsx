import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import LatestJobs from "./pages/LatestJobs";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerBrowse from "./pages/FreelancerBrowse";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserAuthProvider } from "@/contexts/UserAuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProtectedRoute } from "@/components/UserProtectedRoute";
import { FreelancerLogin } from "./pages/auth/FreelancerLogin";
import { FreelancerRegister } from "./pages/auth/FreelancerRegister";
import { ClientLogin } from "./pages/auth/ClientLogin";
import { ClientRegister } from "./pages/auth/ClientRegister";
import { ForgotPassword } from "./pages/auth/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <Routes>
          {/* Public Routes with Header/Footer */}
          <Route path="/" element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Index />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/job/:id" element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <JobDetail />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/latest" element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <LatestJobs />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/freshers" element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Index />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/experienced" element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Index />
              </main>
              <Footer />
            </div>
          } />
          
          {/* Freelancing Platform Routes */}
          <Route path="/freelancer" element={
            <UserProtectedRoute requiredUserType="freelancer">
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <FreelancerDashboard />
                </main>
                <Footer />
              </div>
            </UserProtectedRoute>
          } />
          <Route path="/client" element={
            <UserProtectedRoute requiredUserType="client">
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <ClientDashboard />
                </main>
                <Footer />
              </div>
            </UserProtectedRoute>
          } />
          <Route path="/freelancers" element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <FreelancerBrowse />
              </main>
              <Footer />
            </div>
          } />
          
          {/* Authentication Routes */}
          <Route path="/freelancer/login" element={<FreelancerLogin />} />
          <Route path="/freelancer/register" element={<FreelancerRegister />} />
          <Route path="/freelancer/forgot-password" element={<ForgotPassword />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/forgot-password" element={<ForgotPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminDashboard />} />
            <Route path="applications" element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminDashboard />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </UserAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
