import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Index from "./pages/Index";
import Homepage from "./pages/Homepage";
import Settings from "./pages/Settings";
import KYCIntro from "./pages/KYCIntro";
import KYCForm from "./pages/KYCForm";
import KYCUpload from "./pages/KYCUpload";
import KYCSelfie from "./pages/KYCSelfie";
import KYCReview from "./pages/KYCReview";
import SuccessScreen from "./pages/SuccessScreen";
import ProfileEdit from "./pages/ProfileEdit";
import MyCards from "./pages/MyCards";
import AddCard from "./pages/AddCard";
import CardRemoveSuccess from "./pages/CardRemoveSuccess";
import CameraPage from "./pages/CameraPage";
import Banking from "./pages/Banking";
import AddBank from "./pages/AddBank";
import LinkedAccounts from "./pages/LinkedAccounts";
import BankRemoveSuccess from "./pages/BankRemoveSuccess";
import SecurityDashboard from "./pages/SecurityDashboard";
import MpinSettings from "./pages/MpinSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
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
            <Route path="/kyc-upload" element={<KYCUpload />} />
            <Route path="/kyc-selfie" element={<KYCSelfie />} />
            <Route path="/kyc-review" element={<KYCReview />} />
            <Route path="/kyc-success" element={<SuccessScreen />} />
            <Route path="/profile-edit" element={<ProfileEdit />} />
            <Route path="/cards" element={<MyCards />} />
            <Route path="/cards/add" element={<AddCard />} />
            <Route path="/card-remove-success" element={<CardRemoveSuccess />} />
            <Route path="/camera-page" element={<CameraPage />} />
            <Route path="/banking" element={<Banking />} />
            <Route path="/banking/add" element={<AddBank />} />
            <Route path="/banking/linked-accounts" element={<LinkedAccounts />} />
            <Route path="/bank-remove-success" element={<BankRemoveSuccess />} />
            <Route path="/security-dashboard" element={<SecurityDashboard />} />
            <Route path="/security/mpin-settings" element={<MpinSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;