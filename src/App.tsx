<<<<<<< HEAD
=======

>>>>>>> acceb899a0bb91372a4fba9e6a0b6162831f78a2
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import { validateEnv } from "./lib/env";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InterviewDetails from "./pages/InterviewDetails";
import LiveInterview from "./pages/LiveInterview";
>>>>>>> acceb899a0bb91372a4fba9e6a0b6162831f78a2
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

<<<<<<< HEAD
// Validate environment variables on app startup
validateEnv();

=======
>>>>>>> acceb899a0bb91372a4fba9e6a0b6162831f78a2
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
<<<<<<< HEAD
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interview/:id" 
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/feedback/:id" 
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
=======
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/interview/:interviewId" element={<InterviewDetails />} />
          <Route path="/interview/:interviewId/live" element={<LiveInterview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
>>>>>>> acceb899a0bb91372a4fba9e6a0b6162831f78a2
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
