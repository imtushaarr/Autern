import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import { JobDetail } from "./pages/JobDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
                <Index />
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
    </AuthProvider>
  </QueryClientProvider>
);export default App;
