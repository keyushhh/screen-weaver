import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Homepage from "./pages/Homepage";
import Settings from "./pages/Settings";
import KYCIntro from "./pages/KYCIntro";
import KYCForm from "./pages/KYCForm";
import KYCUpload from "./pages/KYCUpload"; // Ensure this is here
import KYCSelfie from "./pages/KYCSelfie";
import KYCReview from "./pages/KYCReview";
import SuccessScreen from "./pages/SuccessScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/kyc-intro" element={<KYCIntro />} />
          <Route path="/kyc-form" element={<KYCForm />} />
          <Route path="/kyc-upload" element={<KYCUpload />} /> {/* Ensure this route is here */}
          <Route path="/kyc-selfie" element={<KYCSelfie />} />
          <Route path="/kyc-review" element={<KYCReview />} />
          <Route path="/kyc-success" element={<SuccessScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;